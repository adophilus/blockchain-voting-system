import { Hono } from 'hono'
import GenerateVotersRoute from './create'
import ListVotersRoute from './list'
import SubmitVoteRoute from './submit'

export const VoterRouter = new Hono()
  .route('/', GenerateVotersRoute)
  .route('/', ListVotersRoute)
  .route('/', SubmitVoteRoute)

export default VoterRouter
