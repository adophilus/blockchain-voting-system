import { Store } from '@tanstack/store'

namespace AuthStore {
  export type VoterUser = {
    role: 'voter'
    id: string
    code: string
    election_id: string
  }
  export type AdminUser = {
    role: 'admin'
    id: string
    email: string
    full_name: string
  }

  export type UnauthenticatedState = { status: 'unauthenticated' }
  export type AuthenticatedState = {
    status: 'authenticated'
    user: VoterUser | AdminUser
    token: string
  }
  export type State = UnauthenticatedState | AuthenticatedState

  export const store = new Store<State>({
    status: 'unauthenticated'
  })

  export const login = (data: Omit<AuthenticatedState, 'status'>) => {
    store.setState({
      ...data,
      status: 'authenticated'
    })
  }

  export const logout = async () => {
    store.setState({ status: 'unauthenticated' })
  }
}

export default AuthStore
