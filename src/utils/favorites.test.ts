import { describe, expect, it } from 'vitest'
import { makeProduct } from '../test/makeProduct'
import { addFavorite, parseFavorites, removeFavorite, toFavoriteSnapshot } from './favorites'

const onde = toFavoriteSnapshot(makeProduct({ id: 1, title: 'Onde Rosée' }))
const orbite = toFavoriteSnapshot(makeProduct({ id: 2, title: 'Orbite', category: 'homme' }))

describe('R60 a favorite is never saved twice', () => {
  it('adds a new favorite at the end', () => {
    expect(addFavorite([onde], orbite)).toEqual([onde, orbite])
  })

  it('adding the same id again changes nothing', () => {
    const favorites = [onde]
    expect(addFavorite(favorites, { ...onde })).toBe(favorites)
  })

  it('removes a favorite by id', () => {
    expect(removeFavorite([onde, orbite], 1)).toEqual([orbite])
  })
})

describe('R61 restoring favorites never crashes', () => {
  it('restores a valid saved list', () => {
    expect(parseFavorites([onde, orbite])).toEqual([onde, orbite])
  })

  it.each([null, 'texte', 42, { id: 1 }])('gives an empty list for %j', (stored) => {
    expect(parseFavorites(stored)).toEqual([])
  })

  it('drops invalid items and duplicated ids', () => {
    const stored = [onde, { id: 'abc' }, { ...onde }, orbite, { ...orbite, category: 'robots' }]
    expect(parseFavorites(stored)).toEqual([onde, orbite])
  })
})

describe('R62 the snapshot keeps only what the favorites page needs', () => {
  it('copies the 7 display fields', () => {
    expect(Object.keys(onde).sort()).toEqual(
      ['category', 'id', 'price', 'rating', 'thumbnail', 'title', 'type'].sort(),
    )
  })
})
