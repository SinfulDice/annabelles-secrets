import { useState } from 'react'
import { useContentMode } from '../../contexts/ContentModeContext'
import type { ImageCredit, ImageSubject } from '../../types'
import { getImageSource, sfwImages } from '../../utils/productImages'
import { EyeOffIcon } from '../ui/icons'

type ProductImageProps = {
  subject: ImageSubject
  /** Which picture of the product (gallery). */
  index?: number
  /** Images at the top of a page load first; the others wait until they are scrolled to. */
  priority?: boolean
  /** Small thumbnail: blurred like the others, but without buttons. */
  compact?: boolean
  /** Shows « Photo : … sur Unsplash » under a revealed NSFW photo (product page). */
  showCredit?: boolean
}

const overlayButton =
  'z-10 min-h-11 rounded-full border border-white/60 bg-black/40 px-4 text-sm font-semibold text-white hover:bg-black/60'

function BlurredOverlay({ title, onReveal }: { title: string; onReveal: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-nsfw-backdrop/50 p-3 text-center text-white">
      {/* Small cards (2 columns on mobile) only have room for the button. */}
      <EyeOffIcon className="hidden size-7 sm:block" />
      <p className="hidden text-sm font-semibold sm:block">Contenu adulte</p>
      <button
        type="button"
        onClick={onReveal}
        aria-label={`Afficher l'image de ${title}`}
        className={`relative ${overlayButton}`}
      >
        <span className="sm:hidden">Afficher</span>
        <span className="hidden sm:inline">Afficher l&apos;image</span>
      </button>
    </div>
  )
}

function Credit({ credit }: { credit: ImageCredit }) {
  return (
    <p className="absolute bottom-2 left-2 z-10 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
      Photo :{' '}
      <a href={credit.page} target="_blank" rel="noreferrer" className="underline">
        {credit.photographer}
      </a>{' '}
      sur Unsplash
    </p>
  )
}

/**
 * The single place that shows a product photo, and the only one that knows the SFW / NSFW
 * mode (R133). The alt text stays descriptive and neutral in both modes (R132).
 */
export function ProductImage(props: ProductImageProps) {
  const { subject, index = 0, priority = false, compact = false, showCredit = false } = props
  const { mode, isRevealed, reveal, hide } = useContentMode()
  const source = getImageSource(subject, mode, index)
  // If a photo fails to load, fall back to the SFW visual (R133). Storing the failed address
  // (not a boolean) means a new image gets its own chance without resetting anything.
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const hasFailed = failedSrc === source.src

  const src = hasFailed ? (sfwImages(subject)[index] ?? subject.thumbnail) : source.src
  const isExplicit = source.isExplicit && !hasFailed
  const isBlurred = isExplicit && !isRevealed(subject.id)

  return (
    <div className={`relative size-full ${isExplicit ? 'bg-nsfw-backdrop' : ''}`}>
      <img
        src={src}
        alt={`${subject.title}, ${subject.type.toLowerCase()}`}
        loading={priority ? 'eager' : 'lazy'}
        width={600}
        height={600}
        onError={() => setFailedSrc(source.src)}
        className={`size-full object-cover ${isBlurred ? 'scale-110 blur-2xl' : ''} ${isExplicit ? '' : 'dark:brightness-75'}`}
      />
      {isBlurred && !compact && (
        <BlurredOverlay title={subject.title} onReveal={() => reveal(subject.id)} />
      )}
      {isExplicit && !isBlurred && !compact && (
        <>
          <button
            type="button"
            onClick={() => hide(subject.id)}
            aria-label={`Masquer l'image de ${subject.title}`}
            className={`absolute right-2 bottom-2 ${overlayButton}`}
          >
            Masquer
          </button>
          {showCredit && source.credit && <Credit credit={source.credit} />}
        </>
      )}
    </div>
  )
}
