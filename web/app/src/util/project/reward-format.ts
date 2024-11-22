import { IRewardViewModel } from '@app/types'
import { format } from 'date-fns/format'

export const getDelivery = (reward: IRewardViewModel) => {
  const date = new Date(reward.delivery_time * 1000)
  return format(date, 'LLL yyyy')
}

export const getBackers = (reward: IRewardViewModel) => {
  const limit = reward.backer_limit
  const backers = reward.backer_count
  if (limit) {
    return `${backers} of ${limit}`
  }
  return `${backers}`
}
