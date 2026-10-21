import type { Category } from '../types'

export const COMMITMENTS = [
  { title: 'Colis 100 % neutre', text: 'Aucune mention de la boutique sur le carton.' },
  { title: 'Silicone médical', text: 'Matériaux sans phtalates, hypoallergéniques.' },
  { title: 'Paiement discret', text: 'Libellé neutre sur votre relevé.' },
  { title: 'Garantie 2 ans', text: 'Échange simple en cas de défaut.' },
]

export const UNIVERSE_TILES: { category: Category; description: string; classes: string }[] = [
  {
    category: 'femme',
    description: 'Stimulateurs, vibromasseurs, boules de geisha…',
    classes: 'bg-femme text-white',
  },
  {
    category: 'homme',
    description: 'Masturbateurs, anneaux, stimulateurs prostatiques…',
    classes: 'bg-homme text-white',
  },
  {
    category: 'goodies',
    description: 'T-shirt, stickers, mug, tote bag, casquette',
    classes: 'bg-goodies-soft text-goodies-ink',
  },
]

export const TOP_RATED_COUNT = 4
