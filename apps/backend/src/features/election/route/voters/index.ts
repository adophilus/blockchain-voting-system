import { Container } from '@n8n/di'
import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import middleware from './middleware'
import type { Response } from './types'
import GenerateVotersUseCase from './use-case'

const GenerateVotersRoute = new Hono().post('/', ...middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const payload = c.req.valid('json')
  const { electionId } = c.req.valid('param')

  const useCase = Container.get(GenerateVotersUseCase)
  const result = await useCase.execute(electionId, payload)

  if (result.isErr) {
    switch (result.error.code) {
      case 'ERR_ELECTION_NOT_FOUND': {
        response = result.error
        statusCode = StatusCodes.NOT_FOUND
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
})

export default GenerateVotersRoute

