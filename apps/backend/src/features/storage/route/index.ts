import { Hono } from 'hono'
import UploadRoute from './upload'
import GetFileRoute from './get'

const StorageRouter = new Hono()
  .route('/upload', UploadRoute)
  .route('/:id', GetFileRoute)

export default StorageRouter
