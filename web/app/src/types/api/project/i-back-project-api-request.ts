export interface IPledgeItemDto {
  reward_id: string
  quantity: number
}

export interface IBackProjectApiRequest {
  rewards: IPledgeItemDto[]
}
