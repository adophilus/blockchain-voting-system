import { Hono } from 'hono'
import ListElectionsRoute from './list'
import CreateElectionRoute from './create'
import GetPlatformElectionMetricsRoute from './metrics'
import ElectionByIdRouter from './by_id'

const ElectionRouter = new Hono()
  .route('/', ListElectionsRoute)
  .route('/', CreateElectionRoute)
  .route('/metrics', GetPlatformElectionMetricsRoute)
  .route('/:electionId', ElectionByIdRouter)

export default ElectionRouter
