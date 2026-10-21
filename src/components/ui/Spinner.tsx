/** Decorative: the text next to it ("Chargement…") is what screen readers announce. */
export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  )
}
