import { CATEGORY_LABELS } from '../../constants/config'
import type { CategoryFilter } from '../../types'
import { SegmentedControl } from '../ui/SegmentedControl'

const OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'femme', label: CATEGORY_LABELS.femme },
  { value: 'homme', label: CATEGORY_LABELS.homme },
  { value: 'goodies', label: CATEGORY_LABELS.goodies },
]

type CategoryPickerProps = {
  value: CategoryFilter
  onChange: (category: CategoryFilter) => void
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  return (
    <SegmentedControl
      legend="Catégorie"
      name="category-filter"
      value={value}
      options={OPTIONS}
      onChange={onChange}
    />
  )
}
