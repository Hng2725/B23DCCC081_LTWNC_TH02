import { fetchAssignmentsAPI } from '../../features/assignments/assignmentsAPI'

describe('Unit Tests: assignmentsAPI', () => {
  it('fetchAssignmentsAPI returns a list of sample assignments', async () => {
    const response = await fetchAssignmentsAPI()
    expect(response.message).toBe('OK')
    expect(Array.isArray(response.data)).toBe(true)
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data[0]).toHaveProperty('subject')
    expect(response.data[0]).toHaveProperty('title')
  })
})
