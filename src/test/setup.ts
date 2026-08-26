/**
 * Vitest setup — runs before every spec file.
 *
 * WHY THIS EXISTS: happy-dom 20 under Vitest exposes `window.sessionStorage`
 * but leaves `window.localStorage` UNDEFINED. It is present as a key (`in
 * window` is true) with no descriptor behind it, so any read reaches undefined
 * rather than throwing a clear error. Two components persist a preference and
 * would fail here while working perfectly in a browser:
 *
 *   - ToggleTheme, via useColorMode's store
 *   - ExitIntentPopup, via its `exitPopupDismissed` flag
 *
 * Setting a real origin (see environmentOptions in vitest.config.ts) was tried
 * first and did not help — the URL applies, the storage still does not. So this
 * installs a spec-compliant in-memory Storage. It is a HOST GAP being filled,
 * not a product defect being masked: e2e drives a real browser with real
 * storage, and these components' persistence is asserted there too.
 */

function createMemoryStorage(): Storage {
  const entries = new Map<string, string>()

  // Built as an object rather than a `class ... implements Storage`: Storage
  // carries an index signature, and the oxc transform Vite uses here cannot
  // parse one inside a class body.
  const storage: Storage = {
    get length(): number {
      return entries.size
    },
    clear(): void {
      entries.clear()
    },
    getItem(key: string): string | null {
      // Storage returns null for a miss — NOT undefined. Code branching on
      // `if (!dismissed)` behaves the same either way; code comparing against
      // null does not, so match the spec.
      const value = entries.get(String(key))
      return value === undefined ? null : value
    },
    key(index: number): string | null {
      return Array.from(entries.keys())[index] ?? null
    },
    removeItem(key: string): void {
      entries.delete(String(key))
    },
    setItem(key: string, value: string): void {
      // Storage coerces both sides to string.
      entries.set(String(key), String(value))
    }
  }

  return storage
}

const store = createMemoryStorage()

for (const target of [window, globalThis]) {
  Object.defineProperty(target, 'localStorage', {
    value: store,
    configurable: true,
    writable: true
  })
}
