import { Hono } from 'hono'
import CreateCandidateRoute from './create'

const CandidateRouter = new Hono().route('/', CreateCandidateRoute)

export default CandidateRouter
