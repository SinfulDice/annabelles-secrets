/**
 * Which explicit images are shown unblurred (R132). Two ways to show them: one by one
 * (« Afficher l'image »), or all at once (« Tout afficher ») minus the ones hidden again.
 */
export type RevealState = {
  isAllRevealed: boolean
  revealedIds: number[]
  /** Only used after « Tout afficher »: products re-blurred with « Masquer ». */
  hiddenIds: number[]
}

export type RevealAction =
  | { type: 'revealed'; id: number }
  | { type: 'hidden'; id: number }
  | { type: 'allRevealed' }
  | { type: 'reset' }

export const initialRevealState: RevealState = {
  isAllRevealed: false,
  revealedIds: [],
  hiddenIds: [],
}

const without = (ids: number[], id: number) => ids.filter((item) => item !== id)

export function revealReducer(state: RevealState, action: RevealAction): RevealState {
  switch (action.type) {
    case 'revealed':
      return {
        ...state,
        revealedIds: [...without(state.revealedIds, action.id), action.id],
        hiddenIds: without(state.hiddenIds, action.id),
      }
    case 'hidden':
      return {
        ...state,
        revealedIds: without(state.revealedIds, action.id),
        hiddenIds: state.isAllRevealed ? [...state.hiddenIds, action.id] : state.hiddenIds,
      }
    case 'allRevealed':
      return { isAllRevealed: true, revealedIds: [], hiddenIds: [] }
    case 'reset':
      return initialRevealState
  }
}

export function isRevealedIn(state: RevealState, id: number): boolean {
  return state.isAllRevealed ? !state.hiddenIds.includes(id) : state.revealedIds.includes(id)
}
