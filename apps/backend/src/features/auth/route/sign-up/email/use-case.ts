import { Result } from 'true-myth'
import { ulid } from 'ulidx'
import type { AuthUserRepository } from '@/features/auth/repository'
import { hashPassword } from '@/features/auth/utils/password'
import type { Request, Response } from './types'

class SignUpWithEmailUseCase {
  constructor(private authUserRepository: AuthUserRepository) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    const existingUserResult = await this.authUserRepository.findByEmail(
      payload.email
    )
    if (existingUserResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const existingUser = existingUserResult.value
    if (existingUser) {
      return Result.err({
        code: 'ERR_EMAIL_ALREADY_IN_USE'
      })
    }

    const { password, ..._payload } = payload

    const hashedPassword = await hashPassword(password)

    const userCreationResult = await this.authUserRepository.create({
      ..._payload,
      password_hash: hashedPassword,
      role: 'ADMIN',
      id: ulid()
    })

    if (userCreationResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const user = userCreationResult.value

    return Result.ok({
      code: 'SIGN_UP_SUCCESSFUL',
      data: {
        user
      }
    })
  }
}

export default SignUpWithEmailUseCase
