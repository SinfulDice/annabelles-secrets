/** A parody ad as written in constants/ads.ts: `{ville}` and `{n}` are filled at draw time. */
export type AdMessage = {
  title: string
  subtitle: string
  cta: string
  badge: string
}

/** A drawn ad, variables filled; `index` is its position in the list (to avoid repeats). */
export type ResolvedAd = AdMessage & { index: number }

export type AdFormat = 'banner' | 'square' | 'popup'
