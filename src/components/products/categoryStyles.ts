import type { Category } from '../../types'

/** Background behind product images and badge text colour, per universe (mockup colours). */
export const CATEGORY_STYLES: Record<Category, { imageBackground: string; badgeText: string }> = {
  femme: { imageBackground: 'bg-femme-soft', badgeText: 'text-femme' },
  homme: { imageBackground: 'bg-homme-soft', badgeText: 'text-homme' },
  goodies: { imageBackground: 'bg-goodies-soft', badgeText: 'text-goodies-ink' },
}
