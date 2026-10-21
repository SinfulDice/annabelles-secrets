import { useAds } from '../../contexts/AdsContext'
import { useAgeGate } from '../../contexts/AgeGateContext'
import { useRandomAd } from '../../hooks/useRandomAd'
import { AdCaption, AdCloseButton, AdCtaButton, AdTag, adBoxClasses } from './AdParts'

function BannerContent({ onClose }: { onClose: () => void }) {
  const ad = useRandomAd()

  return (
    // No aria-live: screen readers must not announce a new ad every 8 seconds (R125).
    <aside aria-label="Publicité parodique">
      <div
        className={`${adBoxClasses} flex min-h-44 flex-wrap items-center gap-5 sm:flex-nowrap sm:gap-7`}
      >
        <div className="flex items-center gap-4 sm:flex-col">
          <AdTag />
          <span
            aria-hidden="true"
            className="grid size-20 shrink-0 place-items-center rounded-full bg-ad-border text-center text-lg font-bold text-white sm:size-24 sm:text-xl"
          >
            {ad.badge}
          </span>
        </div>
        <div className="min-w-0 flex-1 basis-56">
          <p className="font-display text-2xl leading-tight font-bold text-ad-title sm:text-4xl">
            {ad.title}
          </p>
          <p className="mt-2 text-base sm:text-lg">{ad.subtitle}</p>
        </div>
        <AdCtaButton label={ad.cta} />
        <AdCloseButton onClose={onClose} />
      </div>
      <AdCaption />
    </aside>
  )
}

/** Wide ad of the home page and the shop (R123). */
export function AdBanner() {
  const { isAgeConfirmed } = useAgeGate()
  const { isDismissed, dismiss } = useAds()
  // R125: never before the age check; R124: hidden once closed, until the next reload.
  if (!isAgeConfirmed || isDismissed('banner')) return null
  return <BannerContent onClose={() => dismiss('banner')} />
}
