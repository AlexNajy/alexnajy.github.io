# Alexander Najy — Portfolio

Personal portfolio for Alexander Najy, a fourth-year computer science student. The site's job is to get interviews: a recruiter should be able to find projects, resume, and contact info within ~10 seconds, even though the site is highly interactive.

## Stack

- Vite + React + TypeScript
- React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), `@react-three/postprocessing`, Three.js
- Framer Motion for UI/overlay animation
- ESLint
- Static site only: no backend, no server features, no secrets

## Commands

- `npm run dev`: local dev server
- `npm run build`: production build into `dist/`
- `npm run lint`: lint
- `npm run deploy`: builds and publishes `dist/` to the `gh-pages` branch

## Deployment

- GitHub Pages **user site**: repo `AlexNajy/alexnajy.github.io`, live at https://alexnajy.github.io/
- `main` = source code (default branch). `gh-pages` = built output, managed by the `gh-pages` package. Never edit `gh-pages` by hand.
- Vite `base` stays `/` (user site, not a project site).
- GitHub Pages has no server-side routing: use URL hashes (e.g. `#/file/dataset-explorer`) for deep links, never `BrowserRouter`-style paths.
- Assets in `public/` must be referenced with `import.meta.env.BASE_URL`, or imported from `src/assets`.

## Concept: the investigator's corkboard

**Home screen (3D, React Three Fiber):**
- A cork board lit by one warm spotlight (desk-lamp feel) with soft, real shadows; edges fall off into darkness.
- Cards and yellow folders with content pinned to the board: projects, experience, skills, and a central "subject" card (Alex). Slight random tilts; each card is a real mesh that casts shadows onto the cork.
- Red strings are 3D tubes along curves that sag in the middle, connecting related items (e.g. a project to the skills it used). They cast thin shadows.
- The camera drifts slightly toward the cursor (eased each frame) for parallax.
- Hovering an item highlights its connected strings and pins; everything else dims.
- Clicking an item glides the camera toward it and opens its dossier file.
- The site starts focused on the maine profile in the middle which has my picture, name, location, title, education, and all the important info

**Dossier files (HTML overlay, not WebGL):**
- A "classified case file" look: manila/typed-report styling, typewriter font (e.g. Special Elite or Courier Prime), rotated CLASSIFIED stamp, redacted words that reveal on hover.
- Content must stay crisp, selectable, and readable: description, role, stack, results, links (GitHub, live demo).
- Each file has a hash URL so it can be shared and the back button works.

**Principle:** 3D is for atmosphere and exploration; HTML is for reading. The concept frames the content and never hides it.

## Content

- All pins, connections, and file content live in one data file (e.g. `src/data/case.ts`). Adding a project should only require editing that file.
- Pin positions are stored as board-relative coordinates, not pixels.
- Existing project to include: DSCI 320 Dataset Explorer, live at https://alexnajy.github.io/dsci320-dataset-explorer/
- Use clearly marked placeholder content until Alex provides real content. Never invent real-sounding facts about Alex.

## Requirements

- **Performance:** lazy-load the 3D scene (`React.lazy` + `Suspense`); page shell and content appear immediately. Compress textures and models. Target Lighthouse 90+.
- **Mobile:** on small screens, replace the 3D board with a simplified vertical stack of case files using the same data. Reduce shadow and postprocessing quality on low-power devices.
- **Accessibility:** always-present HTML links to every file (keyboard and screen reader reachable), good contrast, respect `prefers-reduced-motion` (disable camera drift and heavy animation).
- **Recruiter path:** resume PDF, email, GitHub, and LinkedIn reachable from the home screen without exploring the board.
- Only use original or properly licensed textures, fonts, and assets (e.g. Poly Haven, ambientCG, Google Fonts). No assets copied from games, films, or other sites.

## Working style

- Alex wants to understand the code well enough to explain it in interviews: explain non-obvious decisions, especially Three.js/R3F concepts.
- Propose a plan before large changes. Build in small, working steps.
- Keep components small and typed; no `any`.
- Suggest a short, present-tense commit message after each working step (e.g. "Add corkboard lighting").
- Use human like commenting, no redundant explanations within functions