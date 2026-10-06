import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useDebounce } from '../../hooks/useDebounce'
import { setFilter, type FilterStatus } from '../filter/filterSlice'
import {
  addAssignment,
  bulkAddAssignments,
  deleteAssignment,
  fetchAssignments,
  generateMockAssignments,
  resetAssignments,
  selectAllAssignments,
  selectAssignmentsError,
  selectAssignmentsStatus,
  selectFilterCounts,
  selectFilteredAssignments,
  selectFilterStatus,
  toggleAssignment,
} from './assignmentsSlice'
import type { AssignmentId, NewAssignment } from './assignmentTypes'
import { usePinStore } from './usePinStore'

export function useAssignments() {
  const dispatch = useAppDispatch()
  const rawFilteredAssignments = useAppSelector(selectFilteredAssignments)
  const allItems = useAppSelector(selectAllAssignments)
  const status = useAppSelector(selectAssignmentsStatus)
  const error = useAppSelector(selectAssignmentsError)
  const filter = useAppSelector(selectFilterStatus)
  const counts = useAppSelector(selectFilterCounts)

  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const pinnedIds = usePinStore((state) => state.pinnedIds)
  const togglePinStore = usePinStore((state) => state.togglePin)

  const isStressTestActive = allItems.length >= 1000

  useEffect(() => {
    dispatch(fetchAssignments())
  }, [dispatch])

  // useMemo cho phần lọc theo từ khoá (đã được debounce 300ms) và ghim bài tập lên đầu
  const assignments = useMemo(() => {
    let list = rawFilteredAssignments

    if (debouncedSearchQuery.trim()) {
      const q = debouncedSearchQuery.toLowerCase().trim()
      list = list.filter(
        (item) => item.title.toLowerCase().includes(q) || item.subject.toLowerCase().includes(q),
      )
    }

    // Ghim bài tập quan trọng lên đầu danh sách
    return [...list].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id)
      const bPinned = pinnedIds.includes(b.id)
      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1
      return 0
    })
  }, [rawFilteredAssignments, debouncedSearchQuery, pinnedIds])

  const add = useCallback((data: NewAssignment) => dispatch(addAssignment(data)), [dispatch])
  const toggle = useCallback((id: AssignmentId) => dispatch(toggleAssignment(id)), [dispatch])
  const remove = useCallback((id: AssignmentId) => dispatch(deleteAssignment(id)), [dispatch])
  const changeFilter = useCallback((value: FilterStatus) => dispatch(setFilter(value)), [dispatch])
  const pin = useCallback((id: AssignmentId) => togglePinStore(id), [togglePinStore])

  const createStressTestData = useCallback(() => {
    const mockData = generateMockAssignments(10000)
    dispatch(bulkAddAssignments(mockData))
  }, [dispatch])

  const resetStressTestData = useCallback(() => {
    dispatch(resetAssignments())
    dispatch(fetchAssignments())
  }, [dispatch])

  const toggleStressTest = useCallback(() => {
    if (isStressTestActive) {
      resetStressTestData()
    } else {
      createStressTestData()
    }
  }, [isStressTestActive, createStressTestData, resetStressTestData])

  return {
    assignments,
    allItems,
    status,
    error,
    filter,
    counts,
    searchQuery,
    setSearchQuery,
    isStressTestActive,
    add,
    toggle,
    remove,
    changeFilter,
    pin,
    createStressTestData,
    resetStressTestData,
    toggleStressTest,
  }
}
