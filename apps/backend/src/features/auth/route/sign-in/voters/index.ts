import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import SignInWithVoterCodeUseCase from './use-case'

const SignInWithVoterRoute = new Hono().post(
  '/',
  middleware,
  async (c) => {
    let response: Response.Response
    let statusCode: StatusCodes

    const payload = c.req.valid('json')

    const useCase = Container.get(SignInWithVoterCodeUseCase)
    const result = await useCase.execute(payload)

    if (result.isErr) {
      switch (result.error.code) {
        case 'ERR_VOTER_NOT_FOUND':
        case 'ERR_ELECTION_NOT_FOUND': {
          response = result.error
          statusCode = StatusCodes.NOT_FOUND
          break
        }
        case 'ERR_ELECTION_NOT_ACTIVE':
        case 'ERR_VOTER_ALREADY_VOTED': {
          response = result.error
          statusCode = StatusCodes.BAD_REQUEST
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

export default SignInWithVoterRoute