import { AuthUserRepository } from '@/features/auth/repository'
import { hashPassword } from '@/features/auth/utils/password'
import { Container } from '@n8n/di'
import { bootstrap } from '@vs/backend'
import { ulid } from 'ulidx'

await bootstrap()

const adminPayload = {
  id: ulid(),
  email: 'topnotch@futo.edu.ng',
  password_hash: await hashPassword('{%gJ$mbxT+07V:Zi'),
  full_name: 'Admin',
  role: 'ADMIN'
} as const

const authUserRepository = Container.get(AuthUserRepository)

const createAdmin = async (authUserRepository: AuthUserRepository) => {
  const existingUserResult = await authUserRepository.findByEmail(
    adminPayload.email
  )
  if (existingUserResult.isErr) {
    console.log('❌ Failed to check existing user')
    return
  }

  const existingUser = existingUserResult.value
  if (existingUser) {
    console.log('❌ Admin user already exists')
    return
  }

  const res = await authUserRepository.create(adminPayload)

  if (res.isErr) {
    console.log(res.error)
    console.log('❌ Failed to create admin user')
    return
  }

  console.log('✅ Admin user created')
}

await createAdmin(authUserRepository)
