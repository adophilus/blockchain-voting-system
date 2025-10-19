import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import { GetPlatformElectionMetricsUseCase } from './use-case'
import { Container } from '@n8n/di'

const GetPlatformElectionMetricsRoute = new Hono().get('/', async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const useCase = Container.get(GetPlatformElectionMetricsUseCase)
  const result = await useCase.execute()

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default GetPlatformElectionMetricsRoute
