# Creative Photos Directory

This folder contains images for your creative portfolio page.

## 📁 Folder Structure

```
creative-photos/
├── photography/     # Your photography work
├── designs/         # UI/UX and graphic design work
└── videos/          # Video thumbnails or stills (for future use)
```

## 📸 How to Add Images

### Photography (Row 1 - Scrolls Left)
Add 6 images to `photography/` folder:
- `1.jpg` - First photo
- `2.jpg` - Second photo
- `3.jpg` - Third photo
- `4.jpg` - Fourth photo
- `5.jpg` - Fifth photo
- `6.jpg` - Sixth photo

### Design Work (Row 2 - Scrolls Right)
Add 6 images to `designs/` folder:
- `1.jpg` - First design
- `2.jpg` - Second design
- `3.jpg` - Third design
- `4.jpg` - Fourth design
- `5.jpg` - Fifth design
- `6.jpg` - Sixth design

## 🎨 Image Guidelines

**Recommended Image Specs:**
- **Aspect Ratio:** 4:3 (horizontal)
- **Dimensions:** 1200px × 900px or higher
- **Format:** JPG or PNG
- **File Size:** < 500KB per image (optimized for web)

**Why these specs?**
- Photos display at 400px × 280px on screen
- Higher resolution ensures crisp display on retina screens
- 4:3 ratio matches the carousel item dimensions

## 🔄 Adding More Images

To add more images to a carousel:

1. **Add files to folder** (e.g., `7.jpg`, `8.jpg`, etc.)
2. **Update code** in `src/components/CreativePage.tsx`:
   ```typescript
   const photographyPhotos = [
     '/creative-photos/photography/1.jpg',
     '/creative-photos/photography/2.jpg',
     // ... add more here
     '/creative-photos/photography/7.jpg',
   ];
   ```

## ⚡ Features

- **Infinite Loop:** Carousels scroll continuously
- **Smooth Animation:** 80-second full cycle (slower = smoother)
- **Pause on Hover:** Hover over any image to pause the carousel
- **Two Directions:** Row 1 scrolls left, Row 2 scrolls right for visual interest

## 📝 Notes

- Images are named numerically for easy organization
- You can use any image format (jpg, png, webp)
- Keep image file sizes optimized for faster loading
- The carousel automatically duplicates images for seamless infinite scroll

