import { useEffect, useRef, useState } from 'react'
import { AD_INTERVAL_MS } from '../constants/ads'
import { drawAd } from '../utils/fillAdTemplate'

/**
 * A parody ad that changes every 8 s, never twice the same in a row (R122).
 *
 * Why a ref for the previous index? The interval callback is created ONCE (the effect only
 * re-runs if intervalMs changes). If it read `ad` from the state, it would always see the
 * first ad (a "stale closure") and could repeat the current message. A ref is a box shared by
 * every render: the callback always reads the latest index, and updating it re-renders nothing.
 */
export function useRandomAd(intervalMs = AD_INTERVAL_MS) {
  const [ad, setAd] = useState(() => drawAd(null))
  const previousIndexRef = useRef(ad.index)

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = drawAd(previousIndexRef.current)
      previousIndexRef.current = next.index
      setAd(next)
    }, intervalMs)
    // Without this cleanup, every visit to a page with an ad would add one more interval,
    // still running (and updating a removed component) after leaving the page.
    return () => window.clearInterval(timer)
  }, [intervalMs])

  return ad
}
