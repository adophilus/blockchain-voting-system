import { Hono } from 'hono'
import GetUserProfileRoute from './profile'
import SignInRoute from './sign-in'
import SignUpRoute from './sign-up'

const AuthRouter = new Hono()
  .route('/sign-in', SignInRoute)
  .route('/sign-up', SignUpRoute)
  .route('/profile', GetUserProfileRoute)

export default AuthRouter
