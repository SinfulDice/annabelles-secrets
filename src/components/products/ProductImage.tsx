type ProductImageProps = {
  src: string
  title: string
  type: string
  /** Images at the top of a page load first; the others wait until they are scrolled to. */
  priority?: boolean
}

/**
 * The single place that shows a product photo. The alt text describes the product
 * (name and type), which is what matters to someone who can't see the image (R40).
 * The SFW / NSFW choice will be added here only (R133).
 */
export function ProductImage({ src, title, type, priority = false }: ProductImageProps) {
  return (
    <img
      src={src}
      alt={`${title}, ${type.toLowerCase()}`}
      loading={priority ? 'eager' : 'lazy'}
      width={600}
      height={600}
      className="size-full object-cover"
    />
  )
}
