import { IProjectViewModel } from '@app/types'

export const getProgress = (project: IProjectViewModel | undefined) => {
  if (!project) return 0
  const pledged = BigInt(project.total_pledged)
  const goal = BigInt(project.funding_goal)
  return Math.min(Number(pledged / goal) * 100)
}
