# 3D Model Placeholders

The current build ships with a lightweight geometric experience. External `.glb` files are optional.  
If you want to swap the procedural shapes for richer assets, drop your optimised models here and wire
them up inside the section components / morphing element.

Guidelines:

- Keep pivots centred and aligned with world-up (`Y+`).
- Aim for assets under **10 MB** (Draco compression recommended).
- Freeze transforms and triangulate before export.

Restart the dev server after adding new models so they're picked up by Vite/Next.js.
