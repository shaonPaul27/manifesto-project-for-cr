# Timon — The Golden Days (v2)

## 1. Add your files
Drop these eleven files into this same folder (exact names — they're already wired into the code):

```
timon.jpg    → Timon's portrait (intro background, hero, and photo #1)
group1.jpg … group9.jpg  → nine more memory photos (photos #2–#10 in the wall)
song.mp3     → the theme song
```

Any file that isn't there yet just shows a soft gold-on-cream placeholder instead of breaking, so you can preview and share the link before every photo is ready.

## 2. Preview it
Double-click `index.html`, or serve it locally for the truest preview:
```
python3 -m http.server 8000
```
then open `http://localhost:8000`.

## 3. Publish on GitHub Pages
1. Push all files in this folder to a repo (e.g. `timon-golden-days`).
2. **Settings → Pages** → Source: `main` branch, root.
3. Live at `https://USERNAME.github.io/timon-golden-days/`.

Plain HTML/CSS/JS — no build step, no backend.

## What's new in this version
- **Light theme throughout** — warm ivory/gold, used everywhere except the cinematic photo intro.
- **Ten photos** in an asymmetric bento wall instead of five.
- **Scroll progress bar** at the very top, tracking how far through the story you are.
- **Word-by-word headline reveals** — every major heading rises into place as you scroll, instead of a flat fade.
- **Marquee ticker** — a scrolling gold-to-maroon band ("The Golden Days · One Captain · The Comeback...") for energy right under the hero.
- **Animated stat counters** — "1 Captain," "10 Golden Moments," "100% Heart" — count up when they scroll into view.
- **Magnetic buttons & photo tilt** — on desktop, the main buttons drift toward your cursor and photos gently tilt in 3D on hover; a soft cursor glow follows your pointer. All of this is automatically skipped on touch devices.
- **New closing section** — a "Vote Timon — Captain" call-to-action band right before the footer, so the site ends on a decision, not just a feeling.
- Fully responsive, and `prefers-reduced-motion` is respected for visitors who need calmer motion.
