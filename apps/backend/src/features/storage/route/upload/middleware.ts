import { zValidator } from '@/features/http'
import { z } from 'zod'

export default zValidator(
  'form',
  z
    .object({ files: z.array(z.instanceof(File)).or(z.instanceof(File)) })
    .transform((data) => {
      if (!Array.isArray(data.files)) {
        return { files: [data.files] }
      }
      return { files: data.files }
    })
)
