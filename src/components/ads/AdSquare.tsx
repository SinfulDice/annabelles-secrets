import { useAds } from '../../contexts/AdsContext'
import { useAgeGate } from '../../contexts/AgeGateContext'
import { useRandomAd } from '../../hooks/useRandomAd'
import { AdCaption, AdCloseButton, AdCtaButton, AdTag, adBoxClasses } from './AdParts'

function SquareContent({ onClose }: { onClose: () => void }) {
  const ad = useRandomAd()

  return (
    <aside aria-label="Publicité parodique">
      <div className={`${adBoxClasses} flex min-h-72 flex-col items-start gap-4`}>
        <div className="flex w-full items-center justify-between">
          <AdTag />
          <AdCloseButton onClose={onClose} />
        </div>
        <p className="font-display text-3xl leading-tight font-bold text-ad-title">{ad.title}</p>
        <p className="text-lg">{ad.subtitle}</p>
        <AdCtaButton label={ad.cta} />
      </div>
      <AdCaption />
    </aside>
  )
}

/** Square ad of the product page (R123). */
export function AdSquare() {
  const { isAgeConfirmed } = useAgeGate()
  const { isDismissed, dismiss } = useAds()
  if (!isAgeConfirmed || isDismissed('square')) return null
  return <SquareContent onClose={() => dismiss('square')} />
}
