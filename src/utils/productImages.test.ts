import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import { getImageSource, parseContentMode } from './productImages'

const credit = { photographer: 'IFONNX Toys', page: 'https://unsplash.com/photos/ZJX8EGDYDd4' }
const toy = makeProduct({
  category: 'femme',
  thumbnail: 'sfw-1.png',
  images: ['sfw-1.png', 'sfw-2.png'],
  nsfwImages: ['nsfw-1.jpg', 'nsfw-2.jpg'],
  nsfwImageCredits: [credit, credit],
})

describe('R130 SFW is the default mode', () => {
  it.each([null, 'autre', 42])('anything but "nsfw" in storage means SFW (%j)', (stored) => {
    expect(parseContentMode(stored)).toBe('sfw')
  })

  it('restores NSFW when it was chosen', () => {
    expect(parseContentMode('nsfw')).toBe('nsfw')
  })
})

describe('R132 R133 which image is shown', () => {
  it('SFW shows the sober images, never explicit', () => {
    expect(getImageSource(toy, 'sfw', 1)).toEqual({
      src: 'sfw-2.png',
      isExplicit: false,
      credit: null,
    })
  })

  it('NSFW shows the real photo, explicit (blurred first) and credited', () => {
    expect(getImageSource(toy, 'nsfw', 1)).toEqual({ src: 'nsfw-2.jpg', isExplicit: true, credit })
  })

  it('goodies are the same in both modes', () => {
    const tshirt = { ...toy, category: 'goodies' as const }
    expect(getImageSource(tshirt, 'nsfw')).toEqual(getImageSource(tshirt, 'sfw'))
  })

  it('a favorite snapshot (thumbnail only) stays SFW', () => {
    const snapshot = {
      id: 1,
      title: 'Onde Rosée',
      type: 'Stimulateur',
      category: 'femme',
      thumbnail: 'sfw-1.png',
    } as const
    expect(getImageSource(snapshot, 'nsfw')).toEqual({
      src: 'sfw-1.png',
      isExplicit: false,
      credit: null,
    })
  })

  it('falls back to the SFW image when there is no NSFW photo for that index', () => {
    expect(getImageSource({ ...toy, nsfwImages: [] }, 'nsfw').isExplicit).toBe(false)
  })
})
