import { afterEach, describe, expect, it, vi } from 'vitest'
import { HttpError, NETWORK_ERROR_STATUS, httpRequest } from './http'

// fetch is replaced by a fake (a "mock") so the tests never touch the network.
function mockFetch(implementation: () => Promise<Response>) {
  const fakeFetch = vi.fn(implementation)
  vi.stubGlobal('fetch', fakeFetch)
  return fakeFetch
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('R12 httpRequest checks response.ok', () => {
  it('returns the JSON body when the response is ok', async () => {
    mockFetch(() => Promise.resolve(Response.json({ id: 7 })))
    await expect(httpRequest<{ id: number }>('https://api.test')).resolves.toEqual({ id: 7 })
  })

  it('throws an HttpError with the status and a French message on 500', async () => {
    mockFetch(() => Promise.resolve(new Response('oops', { status: 500 })))
    const error = await httpRequest('https://api.test').catch((caught: unknown) => caught)
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 500 })
    expect((error as HttpError).message).toContain('erreur 500')
  })

  it('turns a network failure into an HttpError with status 0', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')))
    await expect(httpRequest('https://api.test')).rejects.toMatchObject({
      status: NETWORK_ERROR_STATUS,
    })
  })

  it('sends a body as JSON with the Content-Type header', async () => {
    const fakeFetch = mockFetch(() => Promise.resolve(Response.json({ id: 195 })))
    await httpRequest('https://api.test', { method: 'POST', body: { title: 'Écume' } })
    expect(fakeFetch).toHaveBeenCalledWith('https://api.test', {
      method: 'POST',
      signal: undefined,
      headers: { 'Content-Type': 'application/json' },
      body: '{"title":"Écume"}',
    })
  })
})

describe('R13 a cancelled request is not turned into an error message', () => {
  it('lets the AbortError through unchanged', async () => {
    mockFetch(() => Promise.reject(new DOMException('Aborted', 'AbortError')))
    await expect(httpRequest('https://api.test')).rejects.toMatchObject({ name: 'AbortError' })
  })
})
