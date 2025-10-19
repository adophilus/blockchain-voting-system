import { Hono } from 'hono'
import type { Response } from './types'
import { SubmitVoteUseCase } from './use-case'
import { StatusCodes } from '@/features/http'
import { Container } from '@n8n/di'
import middleware from './middleware'

const SubmitVoteRoute = new Hono().post('/submit', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const body = c.req.valid('json')

  const useCase = Container.get(SubmitVoteUseCase)
  const result = await useCase.execute(body)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default SubmitVoteRoute
