import { zValidator } from '@/features/http'
import { Request } from './types'

const middleware = zValidator('param', Request.params)

export default middleware