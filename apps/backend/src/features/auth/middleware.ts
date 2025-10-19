import type { types } from '@blockchain-voting-system/api'
import { Container } from '@n8n/di'
import type { MiddlewareHandler } from 'hono'
import { StatusCodes } from '@/features/http'
import type { User } from '@/types'
import { AuthUserRepository } from './repository'
import { verifyToken } from './utils/token'

export type Response =
  | types.components['schemas']['Api.UnauthorizedError']
  | types.components['schemas']['Api.UnexpectedError']

namespace AuthMiddleware {
  export const middleware: MiddlewareHandler<{
    Variables: {
      user: User.Selectable
    }
  }> = async (c, next) => {
    let response: Response

    const authHeader = c.req.header('authorization')
    if (!authHeader) {
      response = {
        code: 'ERR_UNAUTHORIZED'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    const [, accessToken] = authHeader.split(' ')
    if (!accessToken) {
      response = {
        code: 'ERR_UNAUTHORIZED'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    const tokenVerificationResult = await verifyToken(accessToken)
    if (tokenVerificationResult.isErr) {
      response = {
        code: 'ERR_UNAUTHORIZED'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    const authUserRepository = Container.get(AuthUserRepository)
    const findUserResult = await authUserRepository.findById(
      tokenVerificationResult.value.user_id
    )
    if (findUserResult.isErr) {
      response = {
        code: 'ERR_UNEXPECTED'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    const user = findUserResult.value

    if (!user) {
      response = {
        code: 'ERR_UNAUTHORIZED'
      }
      return c.json(response, StatusCodes.UNAUTHORIZED)
    }

    c.set('user', user)

    await next()
  }
}

export default AuthMiddleware
