import { Spinner } from './Spinner'

type PageLoadingProps = {
  label: string
}

export function PageLoading({ label }: PageLoadingProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p role="status" className="flex items-center gap-2 font-semibold">
        <Spinner />
        {label}
      </p>
    </div>
  )
}
