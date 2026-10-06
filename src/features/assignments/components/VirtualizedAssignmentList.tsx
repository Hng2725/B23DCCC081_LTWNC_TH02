import type { CSSProperties } from 'react'
import * as ReactWindow from 'react-window'
import type { Assignment, AssignmentId } from '../assignmentTypes'
import { AssignmentCard } from './AssignmentCard'

const reactWindowLib: any = ReactWindow
const FixedSizeListComp =
  reactWindowLib.FixedSizeList ||
  reactWindowLib.default?.FixedSizeList ||
  reactWindowLib.default

function FallbackList(props: any) {
  const RowComponent = typeof props.children === 'function' ? props.children : null
  const renderCount = Math.min(props.itemCount || 0, 30)

  return (
    <div data-testid="virtualized-list-fallback" style={{ height: props.height, overflowY: 'auto' }}>
      {RowComponent &&
        Array.from({ length: renderCount }).map((_, index) => (
          <RowComponent key={index} index={index} style={{ height: props.itemSize }} />
        ))}
    </div>
  )
}

const List: any = typeof FixedSizeListComp === 'function' ? FixedSizeListComp : FallbackList

interface VirtualizedAssignmentListProps {
  assignments: Assignment[]
  onToggle: (id: AssignmentId) => void
  onDelete: (id: AssignmentId) => void
  onPin: (id: AssignmentId) => void
}

const COLUMNS = 4

export function VirtualizedAssignmentList({
  assignments,
  onToggle,
  onDelete,
  onPin,
}: VirtualizedAssignmentListProps) {
  const rowCount = Math.ceil(assignments.length / COLUMNS)

  const Row = ({ index, style }: { index: number; style: CSSProperties }) => {
    const rowAssignments = assignments.slice(index * COLUMNS, (index + 1) * COLUMNS)
    if (rowAssignments.length === 0) return null

    return (
      <div style={{ ...style, paddingBottom: 12, boxSizing: 'border-box' }}>
        <ul className="list">
          {rowAssignments.map((a) => (
            <AssignmentCard key={a.id} assignment={a}>
              <div className="card__info">
                <div className="card__row">
                  <AssignmentCard.Subject />
                  <AssignmentCard.Priority />
                  <AssignmentCard.Status />
                </div>
                <AssignmentCard.Title />
                <AssignmentCard.Deadline />
              </div>
              <AssignmentCard.Actions onToggle={onToggle} onDelete={onDelete} onPin={onPin} />
            </AssignmentCard>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="virtualized-list-container" data-testid="virtualized-list">
      <List height={650} itemCount={rowCount} itemSize={210} width="100%">
        {Row}
      </List>
    </div>
  )
}
