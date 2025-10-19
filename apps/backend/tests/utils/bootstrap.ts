import 'reflect-metadata'

import { Container } from '@n8n/di'
import { HonoApp } from '@/features/app'
import {
  AuthTokenRepository,
  AuthUserRepository,
  KyselyAuthTokenRepository,
  KyselyAuthUserRepository
} from '@/features/auth/repository'
import { config } from '@/features/config'
import { KyselyClient } from '@/features/database/kysely'
import { createKyselySqliteTestClient } from '@/features/database/kysely/sqlite'
import { Logger } from '@/features/logger'
import { Mailer, MockMailer } from '@/features/mailer'
import { MockStorageService, StorageService } from '@/features/storage/service'

export const bootstrap = async () => {
  // Logger
  const logger = new Logger({ name: 'App' })

  // Database
  const kyselyClient = await createKyselySqliteTestClient()

  // Storage DI
  const storageService = new MockStorageService()

  // Mailer DI
  const mailer = new MockMailer()

  // Auth DI
  const authUserRepository = new KyselyAuthUserRepository(kyselyClient, logger)
  const authTokenRepository = new KyselyAuthTokenRepository(
    kyselyClient,
    logger
  )

  const app = new HonoApp(logger)

  // Logger DI
  Container.set(Logger, logger)

  // Database DI
  Container.set(KyselyClient, kyselyClient)

  // Storage DI
  Container.set(StorageService, storageService)

  // Mailer DI
  Container.set(Mailer, mailer)

  // Auth DI
  Container.set(AuthUserRepository, authUserRepository)
  Container.set(AuthTokenRepository, authTokenRepository)

  return { app, logger, config }
}

const { app: appClass, logger } = await bootstrap()

const app = appClass.create()

export { app, logger }
