import { BlockchainStatus } from '../project'

export interface IUpdatePledgeApiRequest {
  comment?: string
  transaction_hash?: string
  blockchain_status?: BlockchainStatus
}
