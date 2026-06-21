import { defineConfig } from 'astro/config';

// @tailwindcss/vite 4.x does not yet support Vite 8 (Rolldown) shipped with
// Astro 6. All styling is handled by Solid State SCSS; Tailwind can be wired
// back once the upstream plugin adds Vite 8 support.
export default defineConfig({});
