import { useState } from 'react'
import type { Product } from '../../types'
import { CATEGORY_STYLES } from './categoryStyles'
import { ProductImage } from './ProductImage'

type ProductGalleryProps = {
  product: Product
}

/** Big image + thumbnails. Which image is shown only matters here, so it is local state. */
export function ProductGallery({ product }: ProductGalleryProps) {
  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const [selectedIndex, setSelectedIndex] = useState(0)
  // A created product may have fewer images: never point past the end of the list.
  const shownIndex = Math.min(selectedIndex, images.length - 1)
  const background = CATEGORY_STYLES[product.category].imageBackground

  return (
    <div className="flex flex-col gap-3">
      <div className={`aspect-square overflow-hidden rounded-panel ${background}`}>
        <ProductImage
          src={images[shownIndex] ?? product.thumbnail}
          title={product.title}
          type={product.type}
          priority
        />
      </div>
      {images.length > 1 && (
        <ul className="flex gap-3">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-pressed={index === shownIndex}
                aria-label={`Voir l'image ${index + 1} sur ${images.length}`}
                className={`block size-20 overflow-hidden rounded-field border-2 sm:size-24 ${background} ${index === shownIndex ? 'border-femme' : 'border-transparent'}`}
              >
                {/* The button label describes it: the thumbnail itself is decorative. */}
                <img src={image} alt="" loading="lazy" className="size-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
