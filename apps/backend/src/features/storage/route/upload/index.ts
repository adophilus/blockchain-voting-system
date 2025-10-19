import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import type { Response } from './types'
import { UploadUseCase } from './use-case'
import middleware from './middleware'
import { Container } from '@n8n/di'

const UploadRoute = new Hono().post('/', middleware, async (c) => {
  let response: Response.Response
  let statusCode: StatusCodes

  const body = c.req.valid('form')
  const useCase = Container.get(UploadUseCase)
  const result = await useCase.execute({ files: body.files as File[] })

  if (result.isErr) {
    response = result.error
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  } else {
    response = result.value
    statusCode = StatusCodes.CREATED
  }

  return c.json(response, statusCode)
})

export default UploadRoute
