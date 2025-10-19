import { zValidator } from '@/features/http'
import { Request } from './types'

const middleware = zValidator('json', Request.body)

export default middleware