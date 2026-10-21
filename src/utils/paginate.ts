export type Page<T> = {
  pageItems: T[]
  /** The requested page, brought back between 1 and totalPages. */
  currentPage: number
  /** At least 1, even for an empty list, so "Page 1 sur 1" stays meaningful. */
  totalPages: number
}

export function paginate<T>(items: T[], requestedPage: number, pageSize: number): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages)
  const start = (currentPage - 1) * pageSize
  return {
    pageItems: items.slice(start, start + pageSize),
    currentPage,
    totalPages,
  }
}
