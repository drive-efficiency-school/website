import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    // Held in variables rather than written as literals: `false && 'b'` inline
    // is a constant expression and eslint's no-constant-binary-expression
    // rejects it, correctly.
    const off = false
    const missing: string | null = null
    expect(cn('a', off && 'b', missing, undefined, 'c')).toBe('a c')
  })

  it('lets a later tailwind class win over an earlier conflicting one', () => {
    // This is the whole reason cn exists over a plain join.
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('keeps non-conflicting tailwind classes', () => {
    expect(cn('p-2', 'm-4')).toBe('p-2 m-4')
  })

  it('accepts arrays and objects', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c')
  })

  it('returns an empty string for no input', () => {
    expect(cn()).toBe('')
  })
})
