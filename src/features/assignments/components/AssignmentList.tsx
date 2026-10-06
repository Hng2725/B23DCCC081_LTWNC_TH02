import type { AsyncStatus } from '../../../types/common'
import type { Assignment, AssignmentId } from '../assignmentTypes'
import { AssignmentCard } from './AssignmentCard'
import { VirtualizedAssignmentList } from './VirtualizedAssignmentList'

interface AssignmentListProps {
  assignments: Assignment[]
  status: AsyncStatus
  error: string | null
  onToggle: (id: AssignmentId) => void
  onDelete: (id: AssignmentId) => void
  onPin: (id: AssignmentId) => void
  isVirtualized?: boolean
}

export function AssignmentList({
  assignments,
  status,
  error,
  onToggle,
  onDelete,
  onPin,
  isVirtualized = false,
}: AssignmentListProps) {
  if (status === 'idle' || status === 'loading') return <p className="message">Đang tải...</p>
  if (status === 'failed') return <p className="message text-danger">{error}</p>
  if (assignments.length === 0) return <p className="message">Không có bài tập nào.</p>

  if (isVirtualized || assignments.length >= 100) {
    return (
      <VirtualizedAssignmentList
        assignments={assignments}
        onToggle={onToggle}
        onDelete={onDelete}
        onPin={onPin}
      />
    )
  }

  return (
    <ul className="list">
      {assignments.map((a) => (
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
  )
}
