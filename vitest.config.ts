import path from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/**
 * Unit + component tests. Separate from the Playwright e2e suite, which builds
 * and drives the real site; this one mounts components in isolation.
 *
 * COVERAGE SCOPE — this suite covers the APPLICATION components. Two kinds of
 * file are excluded, and the reasons are written here rather than left implicit:
 *
 *   1. `src/components/ui/**` — 92 vendored shadcn-vue primitives. NOT
 *      untouched: they carry two local patches (a Tailwind 3 -> 4
 *      arbitrary-value migration, and a TypeScript 5 -> 6 bump). But those
 *      patches are CSS class strings, and the one real defect this directory
 *      has produced (a NavigationMenu viewport collapsing to height 0) was
 *      found by smoke-testing a rendered dropdown — something a mounted unit
 *      test would not have caught either. e2e and a visual pass cover it.
 *
 *   2. `src/icons/**` and `src/components/icons/**` — static SVG assets. Eight
 *      of the nine have no <script> block at all and the ninth takes a single
 *      `class` passthrough. There is no application behaviour to assert; a test
 *      would only restate the path data. They are artwork, not logic.
 *
 * What remains is the 28 files carrying this project's own behaviour and
 * content, and those are held to 100% on all four metrics.
 */
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'happy-dom',
    // happy-dom defaults to about:blank, which is an OPAQUE origin - and an
    // opaque origin has no Storage, so `localStorage` comes back undefined.
    // Components that persist a preference (ToggleTheme via useColorMode,
    // ExitIntentPopup's dismissal flag) would throw here while working fine in
    // a browser. Giving the environment a real origin fixes the cause rather
    // than polyfilling around it, and makes window.location realistic too.
    environmentOptions: {
      happyDOM: {
        url: 'https://www.efficiver.com/',
        // TurnstileWidget appends a <script src="challenges.cloudflare.com/...">.
        // Left alone, happy-dom tries to FETCH it and settles the load promise
        // itself - so a test could never drive the load/error paths, and the
        // suite would quietly depend on the network. Tests own those callbacks.
        settings: { disableJavaScriptFileLoading: true, disableCSSFileLoading: true }
      }
    },
    // Installs an in-memory localStorage — happy-dom 20 leaves it undefined.
    // The full reasoning is in the file itself.
    setupFiles: ['src/test/setup.ts'],
    globals: true,
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/components/ui/**', // vendored — see the note above
        'src/icons/**', // static SVG artwork — see the note above
        'src/components/icons/**', // static SVG artwork — see the note above
        'src/test/**', // test infrastructure, not product code
        'src/main.ts', // 3-line bootstrap: createApp().mount(). Nothing to assert.
        'src/vite-env.d.ts',
        'src/**/*.spec.ts'
      ],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 }
    }
  }
})
