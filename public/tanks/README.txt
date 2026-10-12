Tank photos.

Paths come from `photos` in src/site/data/tanks.ts:

  public/tanks/shallow-long/01.jpg  (main — printed wide)  02.jpg  03.jpg  04.jpg
  public/tanks/shrimp-cube/        (none yet)
  public/tanks/rice-fish/          (none yet)

Add a file, then add its path to that tank's `photos` array. Mark one `main: true`
to make it the wide lead shot. A listed file that isn't on disk renders as an empty
frame showing the path it's waiting for, so the layout holds.
