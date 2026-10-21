import { buttonClasses } from '../ui/buttonClasses'
import { StateMessage } from '../ui/StateMessage'

type ProductsErrorProps = {
  message: string
  onRetry: () => void
}

/** Shown when loading fails: a clear message and a way to try again (R42). */
export function ProductsError({ message, onRetry }: ProductsErrorProps) {
  return (
    <StateMessage
      tone="error"
      title="Impossible de charger les produits"
      action={
        <button type="button" onClick={onRetry} className={buttonClasses('primary')}>
          Réessayer
        </button>
      }
    >
      <p>{message}</p>
    </StateMessage>
  )
}
