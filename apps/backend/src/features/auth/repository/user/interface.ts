import type { Result } from 'true-myth'
import type { User } from '@/types'

export type AuthUserRepositoryError = 'ERR_UNEXPECTED'

abstract class AuthUserRepository {
  public abstract create(
    payload: User.Insertable
  ): Promise<Result<User.Selectable, AuthUserRepositoryError>>

  public abstract findByEmail(
    email: string
  ): Promise<Result<User.Selectable | null, AuthUserRepositoryError>>

  public abstract findById(
    id: string
  ): Promise<Result<User.Selectable | null, AuthUserRepositoryError>>

  public abstract updateById(
    id: string,
    payload: Omit<User.Updateable, 'id' | 'referral_code' | 'updated_at'>
  ): Promise<Result<User.Selectable, AuthUserRepositoryError>>
}

export default AuthUserRepository
