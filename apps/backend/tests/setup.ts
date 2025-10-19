import { Container } from '@n8n/di'
import { NO_MIGRATIONS } from 'kysely'
import { KyselyClient } from '@/features/database/kysely'
import { createKyselyMigrator } from '@/features/database/kysely/migrator'
import { Logger } from '@/features/logger'
import { bootstrap, initTestCache } from './utils'

await bootstrap()

const migrationFolder = new URL('../migrations', import.meta.url).pathname
const kyselyClient = Container.get(KyselyClient)
const logger = Container.get(Logger)

const kyselyMigrator = createKyselyMigrator(kyselyClient, migrationFolder)

const migrationDownResult = await kyselyMigrator.migrateTo(NO_MIGRATIONS)
if (migrationDownResult.error) {
  logger.error('Failed to run down migrations', migrationDownResult.error)
  throw migrationDownResult.error
}

const migrationUpResult = await kyselyMigrator.migrateToLatest()
if (migrationUpResult.error) {
  logger.error('Failed to run up migrations', migrationUpResult.error)
  throw migrationUpResult.error
}

await initTestCache()

console.log('✅ Setup complete')
