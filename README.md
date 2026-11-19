# How Did So Much of North America Become Just Two Countries?

An interactive three-act visual story built with **React 19**, **TypeScript**, **HTML5 Canvas**, **Next.js / Vinext**, and **Cloudflare Workers**.

Starting from a simple question about wildfire and borders, the story walks through 300 million years of North American history in three acts:

1. **Land (`Act I`):** How plate tectonics and mountain building assembled the North American landmass from Pangaea.
2. **Water (`Act II`):** How continental divides, watersheds, and ice sheets routed rivers toward the Pacific, the Atlantic and Gulf, and Hudson Bay, including an interactive raindrop divide explorer.
3. **People (`Act III`):** How Indigenous Nations stewarded landscapes with cultural fire long before European treaties, why night-light satellite maps confuse low density with empty land, and how claims, treaties, and borders created the modern two-country map.

Each act links directly to primary sources from the **USGS**, **NASA**, **National Park Service**, **Smithsonian NK360**, **US Census Bureau**, and **Statistics Canada**. Act III is a concise geographic overview of continental border formation rather than an exhaustive treaty or legal history, and links readers to primary Indigenous and archival resources for deeper study.

## Quick start

Run locally with Node.js `>=22.13.0`:

```bash
npm install
npm run dev
```

## Build and verify

```bash
npm test
npm run lint
```

`npm test` builds the Cloudflare Worker bundle, executes `worker.fetch` in Node, and checks the server-rendered HTML across all three acts, control markup (`aria-label`, `aria-live`), primary-source links, and CSS/source invariants (`prefers-reduced-motion`, print rules, and zero `dangerouslySetInnerHTML`).

## Project structure

- `app/Report.tsx`: Interactive three-act story, canvas animations, and watershed divide slider
- `app/facts.ts`: Immutable copy and primary-source registry
- `app/styles/`: Sticky chapter layout, responsive breakpoints, print styles, and `prefers-reduced-motion` fallbacks
- `tests/rendered-html.test.mjs`: Worker SSR HTML and markup verification suite

## License and imagery credits

Application source code in this repository is licensed under the MIT License (`LICENSE`).

Public-domain and open imagery credits:
- `public/usgs-north-america-terrain.jpg`: U.S. Geological Survey (*A Tapestry of Time and Terrain*, USGS I-2720 / I-2781, public domain).
- `public/nasa-americas-night.jpg`: NASA Earth Observatory (*Earth at Night / Black Marble*, public domain; NASA imagery usage guidelines apply and do not imply endorsement).
- `public/og.png`: Project-authored social preview card composited over the public-domain USGS terrain map above.
- Fonts (`Geist` and `Geist Mono`) are loaded under the SIL Open Font License 1.1.
