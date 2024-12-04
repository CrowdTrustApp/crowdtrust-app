import { authModule } from './auth-store'
import { cartModule } from './cart-store'
import { miscModule } from './misc-store'
import { userModule } from './user-store'

declare global {
  interface Window {
    store: WebStore
  }
}

export interface WebStore {
  misc: typeof miscModule
  auth: typeof authModule
  user: typeof userModule
  cart: typeof cartModule
}

export const store: WebStore = {
  misc: miscModule,
  auth: authModule,
  user: userModule,
  cart: cartModule,
}

// Attach to window for debugging purposes
window.store = store
