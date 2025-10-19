import { Hono } from 'hono'
import { StatusCodes } from '@/features/http'
import { GetFileUseCase } from './use-case'
import middleware from './middleware'
import { Container } from '@n8n/di'
import { Readable } from 'node:stream'

const GetFileRoute = new Hono().get('/', middleware, async (c) => {
  const params = c.req.valid('param')
  const useCase = Container.get(GetFileUseCase)
  const result = await useCase.execute(params)

  if (result.isErr) {
    return c.json({ code: result.error }, StatusCodes.NOT_FOUND)
  }

  const file = result.value

  c.header('Content-Type', file.mime_type)

  const stream = Readable.toWeb(Readable.from(file.file_data)) as ReadableStream

  return c.body(stream)
})

export default GetFileRoute
