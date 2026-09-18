#!/usr/bin/env python3
"""
Build the photo gallery manifest and optimized derivatives.

- Scans the source folders below, dedupes identical shots, reads EXIF.
- Writes public/gallery/<id>-1600.jpg and <id>-800.jpg plus a tiny blur placeholder.
- Writes src/site/data/gallery.json.

Run:  python3 scripts/build-gallery.py
Optional: python3 scripts/build-gallery.py --sheets <dir>   (also writes contact sheets)
"""
import base64
import hashlib
import io
import json
import os
import re
import sys

from PIL import Image, ImageOps, ExifTags, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, 'public', 'gallery')
MANIFEST = os.path.join(ROOT, 'src', 'site', 'data', 'gallery.json')

# (folder, group). Drop new folders in public/gallery-src/<name>/ and they get picked up too.
SOURCES = [
    ('public/newz', 'newz'),
    ('public/f1', 'f1'),
    ('public/mexico', 'mexico'),
    ('public/seattle', 'seattle'),
    ('public/photos', 'grid'),
    ('public/creative-photos/photography', 'grid'),
    ('public/creative-photos/photography-1', 'grid'),
]
EXTRA_ROOT = os.path.join(ROOT, 'public', 'gallery-src')
if os.path.isdir(EXTRA_ROOT):
    for name in sorted(os.listdir(EXTRA_ROOT)):
        p = os.path.join('public', 'gallery-src', name)
        if os.path.isdir(os.path.join(ROOT, p)):
            SOURCES.append((p, name))

TAGS = {v: k for k, v in ExifTags.TAGS.items()}


def fmt_shutter(t):
    try:
        t = float(t)
    except Exception:
        return None
    if t <= 0:
        return None
    if t < 1:
        return f'1/{round(1 / t)}'
    return f'{t:g}s'


def fmt_lens(s):
    if not s:
        return None
    s = str(s).replace('.0 mm', 'mm').replace(' mm', 'mm').replace('.0-', '-').replace('.0 ', ' ')
    s = re.sub(r'(\d)\.0(?=\D|$)', r'\1', s)
    return s.strip().lower()


def read_exif(im):
    ex = im.getexif()
    out = {}
    if not ex:
        return out, None
    sub = ex.get_ifd(0x8769) if hasattr(ex, 'get_ifd') else {}
    merged = dict(ex)
    merged.update(sub or {})

    def g(name):
        k = TAGS.get(name)
        return merged.get(k) if k is not None else None

    model = g('Model')
    if model:
        out['camera'] = str(model).strip().lower()
    lens = fmt_lens(g('LensModel'))
    if lens:
        out['lens'] = lens
    fn = g('FNumber')
    if fn:
        try:
            out['aperture'] = f'f/{float(fn):g}'
        except Exception:
            pass
    sh = fmt_shutter(g('ExposureTime'))
    if sh:
        out['shutter'] = sh
    iso = g('ISOSpeedRatings') or g('PhotographicSensitivity')
    if iso:
        if isinstance(iso, (tuple, list)):
            iso = iso[0]
        out['iso'] = f'iso {iso}'
    fl = g('FocalLength')
    if fl:
        try:
            out['focal'] = f'{float(fl):g}mm'
        except Exception:
            pass
    dt = g('DateTimeOriginal') or g('DateTime')
    date_key = None
    if dt:
        m = re.match(r'(\d{4}):(\d{2}):(\d{2})', str(dt))
        if m:
            months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            out['date'] = f'{months[int(m.group(2)) - 1]} {m.group(1)}'
            date_key = str(dt)

    return out, date_key


def save_variant(im, path, longest, quality):
    w, h = im.size
    scale = min(1.0, longest / max(w, h))
    v = im if scale == 1 else im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    v.save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
    return v.size


def blur_placeholder(im):
    w, h = im.size
    scale = 24 / max(w, h)
    v = im.resize((max(1, round(w * scale)), max(1, round(h * scale))), Image.LANCZOS)
    buf = io.BytesIO()
    v.save(buf, 'JPEG', quality=40)
    return 'data:image/jpeg;base64,' + base64.b64encode(buf.getvalue()).decode('ascii')


def main():
    sheets_dir = None
    if '--sheets' in sys.argv:
        sheets_dir = sys.argv[sys.argv.index('--sheets') + 1]
        os.makedirs(sheets_dir, exist_ok=True)
    os.makedirs(OUT_DIR, exist_ok=True)

    seen_md5 = set()
    seen_shot = set()
    seen_name = set()
    photos = []
    thumbs = []

    for folder, group in SOURCES:
        full = os.path.join(ROOT, folder)
        if not os.path.isdir(full):
            continue
        files = sorted(f for f in os.listdir(full) if f.lower().endswith(('.jpg', '.jpeg')))
        for f in files:
            path = os.path.join(full, f)
            with open(path, 'rb') as fh:
                md5 = hashlib.md5(fh.read()).hexdigest()
            if md5 in seen_md5:
                continue
            seen_md5.add(md5)
            try:
                im = Image.open(path)
                exif, date_key = read_exif(im)
                im = ImageOps.exif_transpose(im).convert('RGB')
            except Exception as e:
                print('skip', path, e)
                continue
            shot_key = (date_key, exif.get('camera')) if date_key else None
            if shot_key and shot_key in seen_shot:
                continue
            if shot_key:
                seen_shot.add(shot_key)
            name_key = re.sub(r'^\d+\s*-\s*', '', f).lower()
            if name_key in seen_name:
                continue
            seen_name.add(name_key)

            idx = len(photos) + 1
            pid = f'{group}-{idx:03d}'
            large = os.path.join(OUT_DIR, f'{pid}-1600.jpg')
            small = os.path.join(OUT_DIR, f'{pid}-800.jpg')
            w, h = save_variant(im, large, 1600, 80)
            save_variant(im, small, 800, 78)
            photos.append({
                'id': pid,
                'group': group,
                'file': f,
                'src': f'/gallery/{pid}-1600.jpg',
                'srcSmall': f'/gallery/{pid}-800.jpg',
                'w': w,
                'h': h,
                'blur': blur_placeholder(im),
                'exif': exif,
            })
            if sheets_dir is not None:
                t = im.copy()
                t.thumbnail((200, 200))
                thumbs.append((pid, t))
            print('ok', pid, f, exif.get('camera', 'no exif'))

    with open(MANIFEST, 'w') as fh:
        json.dump({'photos': photos}, fh, indent=1)
    print(f'wrote {len(photos)} photos to {MANIFEST}')

    if sheets_dir is not None and thumbs:
        cols, rows = 6, 4
        per = cols * rows
        for si in range(0, len(thumbs), per):
            chunk = thumbs[si:si + per]
            sheet = Image.new('RGB', (cols * 210, ((len(chunk) + cols - 1) // cols) * 230), 'white')
            d = ImageDraw.Draw(sheet)
            for i, (pid, t) in enumerate(chunk):
                x = (i % cols) * 210 + 5
                y = (i // cols) * 230 + 5
                sheet.paste(t, (x, y))
                d.text((x, y + 205), pid, fill='black')
            sp = os.path.join(sheets_dir, f'sheet-{si // per + 1}.png')
            sheet.save(sp)
            print('sheet', sp)


if __name__ == '__main__':
    main()
