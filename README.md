# Interactive 3D Card

**A pointer-tracked card that tilts in real 3D space and lights up as you move across it, with automatic dark mode.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-3dcard--hover--effect.netlify.app-2ea44f?style=flat-square&logo=vercel&logoColor=white)](https://3dcard-hover-effect.netlify.app/)
![React 19](https://img.shields.io/badge/React_19-61dafb?style=flat-square&logoColor=white)
![CSS 3D](https://img.shields.io/badge/CSS_3D-1572b6?style=flat-square&logoColor=white)
![CSS Modules](https://img.shields.io/badge/CSS_Modules-0969da?style=flat-square&logoColor=white)

<p align="center">
  <a href="https://3dcard-hover-effect.netlify.app/">
    <img src="docs/preview.png" alt="Interactive 3D Card — desktop preview" width="100%">
  </a>
</p>

## Overview

A single card that reads the pointer position over it, converts that position into `rotateX` / `rotateY` angles and applies them as a CSS 3D transform — so the card appears to lean towards the cursor. Move away and it springs back to flat.

There is no animation library here on purpose. The transform is written straight to React state and handed to CSS, which keeps the effect easy to follow and trivial to tune.

The card also carries its own theme: it reads `localStorage` first and falls back to the `prefers-color-scheme` media query, then re-renders in the matching palette.

## Features

- Pointer-position → `rotateX` / `rotateY` transform, updated live on `mousemove`
- Card returns to its resting position on `mouseleave`
- Gloss / highlight layer that follows the cursor
- Dark mode resolved from `localStorage`, falling back to `prefers-color-scheme`
- Theme changes are written back to `localStorage`
- Component-scoped styling with CSS Modules

## Tech Stack

| Layer | Technology |
| --- | --- |
| UI | React 19 |
| Effect | CSS 3D transforms driven by React state |
| Styling | CSS Modules |
| Build | Vite, ESLint |

## Screenshots

| Desktop | Mobile |
| :---: | :---: |
| <img src="docs/preview.png" alt="Desktop view"> | <img src="docs/preview-mobile.png" alt="Mobile view" width="230"> |

## Getting Started

```bash
git clone https://github.com/Mister2314/Interactive-3D-Card.git
cd Interactive-3D-Card
npm install
npm run dev
```

## Project Structure

```
src/components/InteractiveCard.jsx — pointer tracking, transform maths, theme resolution
src/components/InteractiveCard.module.css — 3D perspective, gloss layer and both palettes
src/App.jsx — mounts the card
```

## Notes

Doing this without a library was the whole exercise: it forced me to understand what `perspective` and `transform-style: preserve-3d` actually do before reaching for a package that hides them.

## Author

**Xəyal Hüseynli** — Junior Front-End Developer

[Portfolio](https://hypnosdev.vercel.app) · [GitHub](https://github.com/Mister2314) · [LinkedIn](https://www.linkedin.com/in/x%C9%99yal-h%C3%BCseynli-3487b91ba/) · [xeyalhuseynli06@gmail.com](mailto:xeyalhuseynli06@gmail.com)
