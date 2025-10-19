import { Hono } from 'hono'
import SignInWithEmailRoute from './email'
import SignInWithVoterCodeRoute from './voters'

const SignInRoute = new Hono()
  .route('/email', SignInWithEmailRoute)
  .route('/voter-code', SignInWithVoterCodeRoute)

export default SignInRoute
