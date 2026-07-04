# Journey Through My Universe

A fully 3D interactive developer portfolio built with React, Vite, React Three Fiber, Three.js, Drei, GSAP, Framer Motion, and Tailwind CSS. Instead of scrolling a page, the visitor pilots a spaceship between planets, each one a section of the portfolio.

## What's built vs. scaffolded

This first version fully implements:
- The core engine: galaxy background, procedural spaceship, cinematic camera-flight navigation, asteroid fields, bloom/vignette post-processing
- Cinematic intro with typing "AI computer" welcome message
- Holographic HUD (sector readout, waypoint console, holo-compass, sound toggle)
- **4 fully-built planets:** Launch Pad, Developer Planet (About), Skills Planet, Projects Planet (with a clickable cyber-city + project detail modal)
- **8 scaffolded planets** (Figma, Certificates, Hackathons, Achievements, Mission Control, Resume, Contact, Social): they already fly-to correctly, open a real data-driven panel, and use a lightweight placeholder 3D decoration — see "Extending a planet" below to give them the same full treatment as the core 4.

All content lives in **`src/data/portfolioData.js`** — replace every placeholder value there with your real info, links, and copy.

## Getting started

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Adding your real content

1. Open `src/data/portfolioData.js` and fill in:
   - `profile` — name, tagline, resume path, social links
   - `about`, `skills`, `projects`, `figmaDesigns`, `certificates`, `hackathons`, `achievements`, `missionControl`
2. Drop real files into `public/assets/`:
   - `profile-placeholder.jpg` → your photo
   - `resume-placeholder.pdf` → your resume
   - `ambient.mp3` → optional background music loop
   - `og-cover.jpg` → 1200×630 social preview image
3. Wire up the contact form: create a free account at [emailjs.com](https://www.emailjs.com/), then set `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID`, `EMAILJS_PUBLIC_KEY` in `src/components/ui/ContactForm.jsx`.
4. Update `index.html` canonical URL and structured data `sameAs` links once you know your real domain and social URLs.

## Extending a planet to full detail

Look at `src/components/canvas/planets/AboutPlanet.jsx` or `SkillsPlanet.jsx` for the pattern:

1. Create `src/components/canvas/planets/YourPlanet.jsx` — it receives `position`, `radius`, `color` and renders whatever 3D decoration you want (orbiting shapes, a mini scene, etc).
2. Register it in `DECORATIONS` inside `src/components/canvas/Scene.jsx`.
3. Flesh out its case in the `switch` inside `src/components/ui/PlanetPanel.jsx` if you want richer panel content than the current data-driven list/grid.

Waypoint position, color, ring, and radius for every planet are defined in `src/lib/navigation.js` — tune spacing or add new stops there.

## Project structure

```
src/
  components/
    canvas/          3D scene: Galaxy, Spaceship, Planet, CameraRig, AsteroidField
      planets/       per-planet 3D decorations
    ui/              HUD, panels, modals, intro/loading overlays
  data/
    portfolioData.js  <- all your real content goes here
  lib/
    navigation.js     planet waypoints + travel helpers
  store/
    useUniverseStore.js  zustand store: phase, active planet, panel/modal state
  hooks/
    useTypewriter.js
```

## Performance notes

- Post-processing (Bloom/Vignette/Chromatic Aberration) is the most expensive part on low-end GPUs — reduce `Bloom` `intensity`/remove `ChromaticAberration` in `Scene.jsx` if you see frame drops.
- Planet count, asteroid count, and particle counts are all easy to tune in `navigation.js`, `AsteroidField.jsx`, and `Spaceship.jsx`.
- On mobile, the custom cursor and Sparkles density are reduced automatically via CSS/media checks — for further mobile tuning, consider lowering `dpr` in `App.jsx`.

## SEO checklist already in place

`robots.txt`, `sitemap.xml`, `manifest.json`, Open Graph + Twitter Card tags, JSON-LD `Person` structured data, canonical URL, and semantic heading hierarchy are all in `index.html` / `public/`. Update the placeholder domain (`ranipatel-universe.dev`) once you deploy.
