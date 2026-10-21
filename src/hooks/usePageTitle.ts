import { useEffect } from 'react'
import { SITE_NAME } from '../constants/config'

/** The browser tab title lives outside React: an effect keeps it in sync (R7). */
export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} – ${SITE_NAME}`
  }, [pageTitle])
}
