import { Request } from './types'
import { zValidator } from '@/features/http';

export default zValidator('json', Request.body)