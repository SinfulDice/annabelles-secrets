import { Link } from 'react-router'
import { SHOP_PATH } from '../../constants/navigation'
import { useSelectCategory } from '../../hooks/useSelectCategory'
import { buttonClasses } from '../ui/buttonClasses'

type HeroSectionProps = {
  /** null while the products are loading. */
  productCount: number | null
}

export function HeroSection({ productCount }: HeroSectionProps) {
  const selectCategory = useSelectCategory()

  return (
    <section className="grid items-center gap-10 md:grid-cols-2">
      <div className="flex flex-col items-start gap-5">
        <p className="rounded-full bg-femme-soft px-3 py-1 text-xs font-semibold text-femme">
          Livraison discrète offerte dès 49 €
        </p>
        <h1 className="text-5xl leading-[1.05] font-bold sm:text-6xl">
          Le plaisir, sans tabou ni compromis.
        </h1>
        <p className="max-w-md text-lg text-ink-muted">
          Des objets de bien-être intime choisis pour leur qualité : silicone de grade médical,
          design soigné et emballage parfaitement neutre.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={SHOP_PATH}
            onClick={() => selectCategory('all')}
            className={buttonClasses('primary')}
          >
            Découvrir la boutique
          </Link>
          <Link to="/favoris" className={buttonClasses('secondary')}>
            Voir mes favoris
          </Link>
        </div>
      </div>

      {/* Decorative shapes from the mockup: hidden from screen readers. */}
      <div aria-hidden="true" className="grid grid-cols-2 gap-4">
        <div className="row-span-2 grid aspect-[3/5] place-items-center rounded-panel bg-femme-soft">
          <span className="h-1/2 w-1/4 rotate-[-20deg] rounded-full bg-femme/60" />
        </div>
        <div className="grid aspect-square place-items-center rounded-panel bg-homme-soft">
          <span className="size-1/2 rounded-full border-[14px] border-homme/60" />
        </div>
        <div className="flex flex-col justify-end rounded-panel bg-ink p-5 text-on-accent dark:border dark:border-line dark:bg-surface dark:text-ink">
          <p className="font-display text-4xl font-bold">{productCount ?? '…'}</p>
          <p className="text-sm text-on-accent/80 dark:text-ink-muted">
            produits sélectionnés, testés et notés
          </p>
        </div>
      </div>
    </section>
  )
}
