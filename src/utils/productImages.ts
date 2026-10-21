import type { ContentMode, ImageSource, ImageSubject } from '../types'

/** SFW images of a product: its gallery, or at least its thumbnail. */
export function sfwImages(subject: ImageSubject): string[] {
  return subject.images && subject.images.length > 0 ? subject.images : [subject.thumbnail]
}

/**
 * Which picture to show (R130, R133). SFW: the sober visual. NSFW: the real product photo
 * from `nsfwImages`, marked explicit (so it starts blurred) and credited.
 * Goodies stay the same in both modes; without an NSFW photo we fall back to SFW.
 */
export function getImageSource(subject: ImageSubject, mode: ContentMode, index = 0): ImageSource {
  const sfw = sfwImages(subject)
  const safe: ImageSource = {
    src: sfw[index] ?? subject.thumbnail,
    isExplicit: false,
    credit: null,
  }
  if (mode === 'sfw' || subject.category === 'goodies') return safe

  const nsfwSrc = subject.nsfwImages?.[index]
  if (!nsfwSrc) return safe
  return { src: nsfwSrc, isExplicit: true, credit: subject.nsfwImageCredits?.[index] ?? null }
}

export function parseContentMode(stored: unknown): ContentMode {
  return stored === 'nsfw' ? 'nsfw' : 'sfw'
}
