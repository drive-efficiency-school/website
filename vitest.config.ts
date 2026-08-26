import path from 'path'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

/**
 * Unit + component tests. Separate from the Playwright e2e suite, which builds
 * and drives the real site; this one mounts components in isolation.
 *
 * COVERAGE SCOPE — `src/components/ui/**` is EXCLUDED (D4), and the reason is
 * written here rather than left implicit:
 *
 *   That directory is 92 vendored shadcn-vue primitives against 42 files this
 *   project authors. It is NOT untouched — it carries two local patches (a
 *   Tailwind 3 -> 4 arbitrary-value migration, and a TypeScript 5 -> 6 bump).
 *   But those patches are CSS class strings, and the one real defect that
 *   directory has produced (a NavigationMenu viewport collapsing to height 0)
 *   was found by smoke-testing a rendered dropdown - something a mounted unit
 *   test would not have caught either. Excluding it does not hide the risk
 *   class; e2e and a visual pass are what cover it.
 *
 * Everything this project authors is held to 100% on all four metrics.
 */
export default defineConfig({
  plugins: [vue()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'src/components/ui/**', // vendored — see the note above
        'src/main.ts', // 3-line bootstrap: createApp().mount(). Nothing to assert.
        'src/vite-env.d.ts',
        'src/**/*.spec.ts'
      ],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 }
    }
  }
})
