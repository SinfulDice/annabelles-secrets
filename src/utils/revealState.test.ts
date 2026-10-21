import { describe, expect, it } from 'vitest'
import { initialRevealState, isRevealedIn, revealReducer, type RevealAction } from './revealState'

const run = (...actions: RevealAction[]) => actions.reduce(revealReducer, initialRevealState)

describe('R132 explicit images are blurred until shown', () => {
  it('everything is blurred at first', () => {
    expect(isRevealedIn(run(), 1)).toBe(false)
  })

  it("« Afficher l'image » shows only that product", () => {
    const state = run({ type: 'revealed', id: 1 })
    expect(isRevealedIn(state, 1)).toBe(true)
    expect(isRevealedIn(state, 2)).toBe(false)
  })

  it('« Masquer » blurs it again', () => {
    expect(isRevealedIn(run({ type: 'revealed', id: 1 }, { type: 'hidden', id: 1 }), 1)).toBe(false)
  })

  it('« Tout afficher » shows every product', () => {
    const state = run({ type: 'allRevealed' })
    expect([1, 2, 45].every((id) => isRevealedIn(state, id))).toBe(true)
  })

  it('after « Tout afficher », hiding one keeps the others shown', () => {
    const state = run({ type: 'allRevealed' }, { type: 'hidden', id: 2 })
    expect(isRevealedIn(state, 2)).toBe(false)
    expect(isRevealedIn(state, 1)).toBe(true)
  })

  it('a hidden one can be shown again', () => {
    const state = run(
      { type: 'allRevealed' },
      { type: 'hidden', id: 2 },
      { type: 'revealed', id: 2 },
    )
    expect(isRevealedIn(state, 2)).toBe(true)
  })

  it('going back to SFW resets everything', () => {
    expect(run({ type: 'allRevealed' }, { type: 'reset' })).toEqual(initialRevealState)
  })
})
