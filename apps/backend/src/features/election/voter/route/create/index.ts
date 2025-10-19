import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import { GenerateVotersUseCase } from './use-case'
import middleware from './middleware'
import { Container } from '@n8n/di'

const GenerateVotersRoute = new Hono().post('/', ...middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const body = c.req.valid('json')
  const params = c.req.valid('param')
  const useCase = Container.get(GenerateVotersUseCase)
  const result = await useCase.execute(body, params.electionId)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.CREATED
  }

  return c.json(response, statusCode)
})

export default GenerateVotersRoute