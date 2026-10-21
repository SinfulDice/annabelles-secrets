import type { AdMessage } from '../types'

/** Parody of dating-site ads (mockup 09). Text only, no image, no real link (R120). */
export const AD_MESSAGES: AdMessage[] = [
  {
    title: 'MILF près de chez vous',
    subtitle: 'Elles sont à {n} km de {ville} et cherchent de la compagnie ce soir.',
    cta: 'Voir les profils',
    badge: '{n} km',
  },
  {
    title: 'Femmes hot dans ta région',
    subtitle: "{n} nouvelles inscrites près de {ville} aujourd'hui.",
    cta: 'Je veux les voir',
    badge: '{n}',
  },
  {
    title: 'Célibataires matures à {n} km',
    subtitle: "Clique vite, avant qu'elles changent d'avis.",
    cta: 'Découvrir',
    badge: '{n} km',
  },
  {
    title: "Couguars en manque d'aventure",
    subtitle: 'Inscription gratuite, discrétion assurée à {ville}.',
    cta: "S'inscrire",
    badge: '100 %',
  },
  {
    title: 'Ton voisin a déjà trouvé',
    subtitle: '{n} rencontres ce mois-ci dans ta rue. Et toi ?',
    cta: 'Moi aussi',
    badge: '{n}',
  },
  {
    title: 'Papas célibataires à {ville}',
    subtitle: 'Ils aiment le barbecue et les longues discussions.',
    cta: 'Les rencontrer',
    badge: '{n} km',
  },
  {
    title: 'Vous êtes notre 1 000 000e visiteur !',
    subtitle: 'Réclamez votre canapé connecté avant minuit.',
    cta: 'Réclamer',
    badge: 'Gagné',
  },
  {
    title: 'Augmentez votre… confiance en vous',
    subtitle: 'La méthode que les coachs détestent.',
    cta: 'En savoir plus',
    badge: '+200 %',
  },
]

/** {n} is a whole number in this range, like real ads that "know" where you are. */
export const AD_NUMBER_MIN = 3
export const AD_NUMBER_MAX = 27

export const AD_INTERVAL_MS = 8000
/** The pop-up shows once per session, this long after arriving (R123). */
export const AD_POPUP_DELAY_MS = 20_000
/** Seconds before the pop-up can be closed. */
export const AD_POPUP_CLOSE_DELAY_S = 3
