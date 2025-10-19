import { Result } from 'true-myth'
import type { AuthUserRepository } from '@/features/auth/repository'
import { comparePassword } from '@/features/auth/utils/password'
import { generateTokens } from '@/features/auth/utils/token'
import type { Request, Response } from './types'

class SignInWithEmailUseCase {
  constructor(private authUserRepository: AuthUserRepository) {}

  async execute(
    payload: Request.Body
  ): Promise<Result<Response.Success, Response.Error>> {
    // Find user by email
    const userResult = await this.authUserRepository.findByEmail(payload.email)
    if (userResult.isErr) {
      return Result.err({
        code: 'ERR_UNEXPECTED'
      })
    }

    const user = userResult.value
    if (!user) {
      return Result.err({
        code: 'ERR_USER_NOT_FOUND'
      })
    }

    // Check if user has a password_hash (was registered with email/password)
    if (!user.password_hash) {
      return Result.err({
        code: 'ERR_USER_NOT_REGISTERED_WITH_PASSWORD'
      })
    }

    // Verify password
    const isPasswordValid = await comparePassword(
      payload.password,
      user.password_hash
    )

    if (!isPasswordValid) {
      return Result.err({
        code: 'ERR_INVALID_CREDENTIALS'
      })
    }

    // Generate tokens
    const tokens = await generateTokens(user.id)

    return Result.ok({
      code: 'SIGN_IN_SUCCESSFUL',
      data: {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name
        },
        tokens
      }
    })
  }
}

export default SignInWithEmailUseCase
