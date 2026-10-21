import { useRef, type KeyboardEvent } from 'react'
import { tabIds } from './tabIds'

type TabsProps<T extends string> = {
  /** Read by screen readers to name the group of tabs. */
  label: string
  tabs: { id: T; label: string }[]
  selected: T
  onSelect: (id: T) => void
  /** Prefix of the ids linking each tab to its panel (see tabIds). */
  idPrefix: string
}

/**
 * Accessible tabs (R105), following the WAI-ARIA pattern: only the selected tab is in the
 * Tab order; the arrow keys (and Home / End) move between tabs.
 */
export function Tabs<T extends string>({
  label,
  tabs,
  selected,
  onSelect,
  idPrefix,
}: TabsProps<T>) {
  // One ref per tab button, to move the focus with the keyboard.
  const buttonsRef = useRef(new Map<T, HTMLButtonElement>())

  function select(index: number) {
    const tab = tabs[(index + tabs.length) % tabs.length]
    if (!tab) return
    onSelect(tab.id)
    buttonsRef.current.get(tab.id)?.focus()
  }

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: tabs.length - 1,
    }
    const target = moves[event.key]
    if (target === undefined) return
    event.preventDefault()
    select(target)
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      className="grid grid-cols-2 gap-1 rounded-field border border-line bg-page p-1"
    >
      {tabs.map((tab, index) => {
        const isSelected = tab.id === selected
        const ids = tabIds(idPrefix, tab.id)
        return (
          <button
            key={tab.id}
            ref={(element) => {
              if (element) buttonsRef.current.set(tab.id, element)
            }}
            type="button"
            role="tab"
            id={ids.tab}
            aria-selected={isSelected}
            aria-controls={ids.panel}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`min-h-11 rounded-[10px] text-sm ${isSelected ? 'bg-surface font-semibold shadow-sm' : 'text-ink-muted'}`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
