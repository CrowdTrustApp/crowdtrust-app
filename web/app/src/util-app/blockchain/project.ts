import { Contract, TransactionResponse } from '@samatech/vue3-eth'
import { chainData } from './chain-data'
import { useEth } from './use-eth'
import { IProjectViewModel } from '@app/types'
import { CROWDTRUST_ABI } from './crowdtrust-abi'

const { getSignerOrConnect } = useEth()

export const submitProject = async (
  project: IProjectViewModel,
): Promise<TransactionResponse | undefined> => {
  const address = chainData.value?.contract
  if (!address) {
    throw 'Project contract unavailable.'
  }
  try {
    const signer = await getSignerOrConnect()

    if (!chainData.value || !signer) {
      throw 'Please connect (or reconnect) your wallet.'
    }
    const contract = new Contract(address, CROWDTRUST_ABI, signer)

    const end = project.start_time + project.duration
    return await contract.createProject(
      project.name,
      project.start_time,
      end,
      project.funding_goal,
    )
  } catch (e) {
    console.log('Approve fail: ', e)
    throw 'Failed to create project, please try again.'
  }
}
