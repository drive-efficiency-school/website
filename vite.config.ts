import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * Per-environment robots policy.
 *
 * The problem this solves: NEITHER deploy script builds. Both check that ./dist
 * exists and refuse otherwise, so dev and prod have always shipped the IDENTICAL
 * artifact from one `npm run build` — which is why www-dev.efficiver.com has been
 * indexable with prod's `index, follow`.
 *
 * `SITE_ENV=dev` (set by build:dev, which deploy-dev.sh now calls) emits
 * noindex; every other build keeps `index, follow`, so the production path and
 * the e2e gate are unchanged.
 */
function robotsPolicy() {
  const isDevSite = process.env.SITE_ENV === 'dev'
  return {
    name: 'efficiver-robots-policy',
    transformIndexHtml(html: string) {
      return html.replace('%ROBOTS%', isDevSite ? 'noindex, nofollow' : 'index, follow')
    }
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), robotsPolicy()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    allowedHosts: ['www.efficiver.com', 'efficiver.com'],
    hmr: {
      protocol: 'wss',
      host: 'www.efficiver.com',
      clientPort: 443
    }
  },
  build: {
    rollupOptions: {
      output: {
        // Vite 7+ (rolldown bundler) requires manualChunks as a
        // function. Object form is no longer accepted. Same chunk
        // mapping as before, expressed via id-prefix matching.
        manualChunks: (id: string) => {
          if (id.includes('/node_modules/vue/') || id.includes('/node_modules/@vueuse/core/')) {
            return 'vue-vendor'
          }
          if (
            id.includes('/node_modules/lucide-vue-next/') ||
            id.includes('/node_modules/class-variance-authority/') ||
            id.includes('/node_modules/clsx/') ||
            id.includes('/node_modules/tailwind-merge/')
          ) {
            return 'ui-vendor'
          }
        }
      }
    }
  }
})
