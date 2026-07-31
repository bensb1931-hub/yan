# Zaikovski — cinematic landing

Профессиональный груминг на дому. Vite + React + GSAP + Lenis.

## Motion board

1. **Enter** — hero: clip-path brand reveal + staggered fade-up (headline / sub / CTA)
2. **Bind** — sticky process scrub (4 slides) + horizontal gallery pin + punch slogan scale scrub
3. **Punctuate** — final CTA scale-in

Parallax on hero / punch / gallery images ≤ ~12% `yPercent`.

`prefers-reduced-motion: reduce` отключает scrub/parallax и Lenis.

## Run

```bash
npm install
npm run dev
```

## Tweaks

- Accent: `--accent` in `src/index.css`
- Contact links: Telegram / phone in CTA section of `src/App.tsx`
- Photos: `public/photos/`
