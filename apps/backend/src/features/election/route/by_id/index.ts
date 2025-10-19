import { Hono } from 'hono'
import GetElectionByIdRoute from './get'
import PositionRouter from '../../position/route'
import CandidateRouter from '../../candidate/route'
import VoterRouter from '../../voter/route'
import EndElectionRoute from './end'
import GetElectionResultsRoute from '../results'
import DeleteElectionRoute from './delete'

const ElectionByIdRouter = new Hono()
  .route('/positions', PositionRouter)
  .route('/candidates', CandidateRouter)
  .route('/voters', VoterRouter)
  .route('/end', EndElectionRoute)
  .route('/results', GetElectionResultsRoute)
  .route('/', DeleteElectionRoute)
  .route('/', GetElectionByIdRoute)

export default ElectionByIdRouter
