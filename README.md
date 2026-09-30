# alexnajy.github.io

Portfolio for Alexander Najy, built as an investigator's corkboard: a 3D board
(React Three Fiber) for exploring, and HTML case files for reading.

Live at https://alexnajy.github.io/

## Commands

```
npm run dev      # local dev server
npm run build    # production build into dist/
npm run lint
npm run deploy   # build and publish dist/ to the gh-pages branch
```

## Editing content

Everything on the board lives in `src/data/case.ts`: the subject profile,
contact links, every pin, and the strings between them. To add a project, add
a pin with `kind: 'project'`, give it a free board position (`x`/`y` from -1
to 1), and add its connections.

- Put your resume at `public/resume.pdf`.
- Put a compressed photo (roughly 600×750 JPEG/WebP) in `public/` and set `subject.photo`.

## Layout

```
src/
  data/        content and types
  lib/         hash router, media queries, connection graph
  components/  HTML: case index, dossier overlay, mobile stack
  scene/       3D: board, cards, strings, camera rig (lazy-loaded)
```
