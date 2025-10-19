import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import SignInWithEmailUseCase from './use-case'

const SignInWithEmailRoute = new Hono().post(
  '/',
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')

    const useCase = Container.get(SignInWithEmailUseCase)
    const result = await useCase.execute(payload)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_USER_NOT_FOUND': {
          response = result.error
          statusCode = StatusCodes.NOT_FOUND
          break
        }
        case 'ERR_INVALID_CREDENTIALS': {
          response = result.error
          statusCode = StatusCodes.UNAUTHORIZED
          break
        }
        case 'ERR_USER_NOT_REGISTERED_WITH_PASSWORD': {
          response = result.error
          statusCode = StatusCodes.UNAUTHORIZED
          break
        }
        default: {
          response = result.error
          statusCode = StatusCodes.INTERNAL_SERVER_ERROR
          break
        }
      }
    } else {
      response = result.value
      statusCode = StatusCodes.OK
    }

    return c.json(response, statusCode)
  }
)

export default SignInWithEmailRoute