import { Hono } from 'hono'
import CreatePositionRoute from './create'

const PositionRouter = new Hono()

PositionRouter.route('/', CreatePositionRoute)

export default PositionRouter