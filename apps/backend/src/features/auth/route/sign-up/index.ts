import { Hono } from 'hono'
import SignUpWithEmailRoute from './email'

const SignUpRoute = new Hono().route('/email', SignUpWithEmailRoute)

export default SignUpRoute
