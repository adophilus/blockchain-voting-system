import { Hono } from 'hono'
import type { Response } from './types'
import { EndElectionUseCase } from './use-case'
import { StatusCodes } from 'http-status-codes'
import { Container } from '@n8n/di'
import middleware from './middleware'

const EndElectionRoute = new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const { electionId } = c.req.valid('param')

  const useCase = Container.get(EndElectionUseCase)
  const result = await useCase.execute(electionId)

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.OK
  }

  return c.json(response, statusCode)
})

export default EndElectionRoute
