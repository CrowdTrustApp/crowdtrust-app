import { IPledgeItemViewModel } from '@app/types'
import { LocalStoragePlugin, useModule } from '@samatech/vue-store'

interface ICartItem {
  rewardId: string
  quantity: number
}

interface IProjectCart {
  items: ICartItem[]
}

interface CartState {
  projects: Record<string, IProjectCart>
}

const cartInit = (): CartState => ({
  projects: {},
})

export const cartGetters = (_state: CartState) => ({})

const cartMutations = (cart: CartState) => ({
  resetCart: () => {
    Object.assign(cart, cartInit())
  },
  populateCart: (projectId: string, items: IPledgeItemViewModel[]) => {
    if (Object.keys(cart.projects).length === 0) {
      const project: IProjectCart = { items: [] }
      for (const item of items) {
        project.items.push({ rewardId: item.reward_id, quantity: item.quantity })
      }
    }
  },
  addItem: (projectId: string, rewardId: string, quantity: number) => {
    const project = cart.projects[projectId] ?? { items: [] }
    project.items.push({ rewardId, quantity })
    cart.projects[projectId] = project
  },
  updateQuantity: (projectId: string, rewardId: string, quantity: number) => {
    const project = cart.projects[projectId] ?? { items: [] }
    const index = project.items.findIndex((item) => item.rewardId === rewardId)
    if (index >= 0) {
      project.items[index].quantity = quantity
    }
    cart.projects[projectId] = project
  },
  removeItem: (projectId: string, rewardId: string) => {
    const project = cart.projects[projectId] ?? { items: [] }
    project.items = project.items.filter((item) => item.rewardId !== rewardId)
    cart.projects[projectId] = project
  },
})

export const cartModule = useModule<
  CartState,
  ReturnType<typeof cartGetters>,
  ReturnType<typeof cartMutations>
>({
  name: 'cart',
  version: 3,
  stateInit: cartInit,
  mutations: cartMutations,
  getters: cartGetters,
  plugins: [LocalStoragePlugin],
})

export type CartModule = typeof cartModule
