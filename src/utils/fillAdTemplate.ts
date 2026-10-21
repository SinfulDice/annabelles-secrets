import { AD_MESSAGES, AD_NUMBER_MAX, AD_NUMBER_MIN } from '../constants/ads'
import { CITIES } from '../constants/cities'
import type { AdMessage, ResolvedAd } from '../types'
import { randomInt } from './seededRandom'

type TemplateValues = {
  ville: string
  n: number
}

/** "Elles sont à {n} km de {ville}" → "Elles sont à 3 km de Paris" (R121). */
export function fillAdTemplate(text: string, values: TemplateValues): string {
  return text.replaceAll('{ville}', values.ville).replaceAll('{n}', String(values.n))
}

/**
 * Index of the next message, never the same as the previous one (R122): we draw among the
 * other messages only, so no "try again" loop is needed.
 */
export function pickNextAdIndex(
  count: number,
  previousIndex: number | null,
  random: () => number,
): number {
  if (previousIndex === null || count < 2) return randomInt(random, 0, count - 1)
  const offset = randomInt(random, 1, count - 1)
  return (previousIndex + offset) % count
}

/** Draws a message and fills its 4 texts with the SAME city and number. */
export function drawAd(
  previousIndex: number | null,
  random: () => number = Math.random,
  messages: AdMessage[] = AD_MESSAGES,
): ResolvedAd {
  const index = pickNextAdIndex(messages.length, previousIndex, random)
  const message = messages[index]
  if (!message) throw new Error('La liste des publicités est vide.')
  const values = {
    ville: CITIES[randomInt(random, 0, CITIES.length - 1)] ?? 'Paris',
    n: randomInt(random, AD_NUMBER_MIN, AD_NUMBER_MAX),
  }
  return {
    index,
    title: fillAdTemplate(message.title, values),
    subtitle: fillAdTemplate(message.subtitle, values),
    cta: message.cta,
    badge: fillAdTemplate(message.badge, values),
  }
}
