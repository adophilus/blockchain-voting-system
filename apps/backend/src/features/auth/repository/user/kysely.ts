import { Result } from 'true-myth'
import type { KyselyClient } from '@/features/database/kysely'
import type { Logger } from '@/features/logger'
import type { User } from '@/types'
import type AuthUserRepository from './interface'
import type { AuthUserRepositoryError } from './interface'

class KyselyAuthUserRepository implements AuthUserRepository {
  constructor(
    private client: KyselyClient,
    private logger: Logger
  ) {}

  public async create(
    payload: User.Insertable
  ): Promise<Result<User.Selectable, AuthUserRepositoryError>> {
    try {
      const user = await this.client
        .insertInto('users')
        .values(payload)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(user)
    } catch (err) {
      this.logger.error('failed to create user:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findByEmail(
    email: string
  ): Promise<Result<User.Selectable | null, AuthUserRepositoryError>> {
    try {
      const user = await this.client
        .selectFrom('users')
        .selectAll()
        .where('email', '=', email)
        .executeTakeFirst()
      return Result.ok(user ?? null)
    } catch (err) {
      this.logger.error('failed to find user by email:', err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async findById(
    id: string
  ): Promise<Result<User.Selectable | null, AuthUserRepositoryError>> {
    try {
      const user = await this.client
        .selectFrom('users')
        .selectAll()
        .where('id', '=', id)
        .executeTakeFirst()
      return Result.ok(user ?? null)
    } catch (err) {
      this.logger.error('failed to find user by id:', id, err)
      return Result.err('ERR_UNEXPECTED')
    }
  }

  public async updateById(
    id: string,
    payload: Omit<User.Updateable, 'id' | 'referral_code' | 'updated_at'>
  ): Promise<Result<User.Selectable, AuthUserRepositoryError>> {
    try {
      const user = await this.client
        .updateTable('users')
        .set(
          Object.assign(payload, {
            updated_at: new Date().toISOString()
          })
        )
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirstOrThrow()
      return Result.ok(user)
    } catch (err) {
      this.logger.error(
        'failed to update user by id with payload',
        id,
        payload,
        err
      )
      return Result.err('ERR_UNEXPECTED')
    }
  }
}

export default KyselyAuthUserRepository
