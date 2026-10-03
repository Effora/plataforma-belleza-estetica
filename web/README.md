# Glowly web (prototipo)
Next.js con exportación estática (SEO/GEO: HTML real por página). Sin costo en Cloudflare Pages.
- Local: `npm install && npm run dev`
- Build: `npm run build` → carpeta `out/`
- Cloudflare Pages: Root directory `web`, Build command `npm run build`, Output directory `out`.
- `noindex` activo mientras los salones sean ficticios. Quitar `robots` en `app/layout.jsx` al publicar con datos reales.
