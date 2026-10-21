export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

/** Status 0 is used when no HTTP response arrived at all (offline, DNS, CORS…). */
export const NETWORK_ERROR_STATUS = 0

function messageForStatus(status: number): string {
  if (status === 404) return 'La ressource demandée est introuvable (erreur 404).'
  if (status >= 500) return `Le serveur rencontre un problème (erreur ${status}).`
  return `La requête a échoué (erreur ${status}).`
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

type RequestOptions = {
  method?: HttpMethod
  /** Sent as JSON when present. */
  body?: unknown
  /** From an AbortController, to cancel the request (e.g. when a component unmounts). */
  signal?: AbortSignal
}

/** The only place that calls fetch: checks response.ok and turns failures into HttpError. */
export async function httpRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal } = options
  const hasBody = body !== undefined
  let response: Response

  try {
    response = await fetch(url, {
      method,
      signal,
      headers: hasBody ? { 'Content-Type': 'application/json' } : undefined,
      body: hasBody ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    // A cancelled request is not a failure to show: let the caller ignore it.
    if (isAbortError(error)) throw error
    throw new HttpError(
      NETWORK_ERROR_STATUS,
      'Impossible de joindre le serveur. Vérifiez votre connexion internet.',
    )
  }

  if (!response.ok) {
    throw new HttpError(response.status, messageForStatus(response.status))
  }
  return (await response.json()) as T
}
