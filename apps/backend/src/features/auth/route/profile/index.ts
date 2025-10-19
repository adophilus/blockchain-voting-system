import { Container } from '@n8n/di'
import { Hono } from 'hono'
import AuthMiddleware from '@/features/auth/middleware'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import GetUserProfileUseCase from './use-case'

const GetUserProfileRoute = new Hono().get(
  '/',
  AuthMiddleware.middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const user = c.get('user')

    const useCase = Container.get(GetUserProfileUseCase)
    const profileResult = await useCase.execute(user)

    if (profileResult.isErr) {
      response = profileResult.error
      statusCode = 500
    } else {
      response = profileResult.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)

export default GetUserProfileRoute
