import { Result } from 'true-myth'
import type { User } from '@/types'
import type { Response } from './types'

class GetUserProfileUseCase {
  async execute(
    user: User.Selectable
  ): Promise<Result<Response.Success, Response.Error>> {
    return Result.ok({ code: 'USER_PROFILE', data: user })
  }
}

export default GetUserProfileUseCase
