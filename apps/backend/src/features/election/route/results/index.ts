import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import { GetElectionResultsUseCase } from './use-case'
import middleware from './middleware'
import { Container } from '@n8n/di'

const GetElectionResultsRoute = new Hono().get('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const params = c.req.valid('param')
  const useCase = Container.get(GetElectionResultsUseCase)
  const result = await useCase.execute(params)

  if (result.isErr) {
    response = result.error
    if (response.code === 'ERR_ELECTION_NOT_FOUND') {
      statusCode = StatusCodes.NOT_FOUND
    } else {
      statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default GetElectionResultsRoute
