import { useState } from 'react'
import type { Product } from '../../types'
import { sfwImages } from '../../utils/productImages'
import { CATEGORY_STYLES } from './categoryStyles'
import { ProductImage } from './ProductImage'

type ProductGalleryProps = {
  product: Product
}

/** Big image + thumbnails. Which image is shown only matters here, so it is local state. */
export function ProductGallery({ product }: ProductGalleryProps) {
  // The SFW list gives the number of pictures; ProductImage picks SFW or NSFW for each one.
  const images = sfwImages(product)
  const [selectedIndex, setSelectedIndex] = useState(0)
  // A created product may have fewer images: never point past the end of the list.
  const shownIndex = Math.min(selectedIndex, images.length - 1)
  const background = CATEGORY_STYLES[product.category].imageBackground

  return (
    <div className="flex flex-col gap-3">
      <div className={`aspect-square overflow-hidden rounded-panel ${background}`}>
        <ProductImage subject={product} index={shownIndex} priority showCredit />
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
                {/* The button label describes it; in NSFW mode the thumbnail is blurred too. */}
                <span aria-hidden="true" className="block size-full">
                  <ProductImage subject={product} index={index} compact />
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
