import { zValidator } from '@/features/http'
import { Request } from './types'

const middleware = zValidator('query', Request.query)

export default middleware
