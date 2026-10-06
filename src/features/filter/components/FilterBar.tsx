import { isFilterStatus } from '../../../utils/typeGuards'
import { FILTER_LABELS, type FilterStatus } from '../filterSlice'

interface FilterBarProps {
  current: FilterStatus
  counts: Record<FilterStatus, number>
  onChange: (value: FilterStatus) => void
  searchQuery?: string
  onSearchChange?: (value: string) => void
}

const FILTER_OPTIONS = Object.keys(FILTER_LABELS).filter(isFilterStatus)

export function FilterBar({ current, counts, onChange, searchQuery = '', onSearchChange }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <input
          type="search"
          className="search-input"
          placeholder="🔍 Tìm kiếm theo tên bài tập hoặc môn học..."
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          aria-label="Tìm kiếm bài tập"
        />
      </div>

      <div className="filter">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={option === current ? 'active' : ''}
            onClick={() => onChange(option)}
          >
            {FILTER_LABELS[option]} ({counts[option]})
          </button>
        ))}
      </div>
    </div>
  )
}
