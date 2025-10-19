import { SqliteDialect } from 'kysely'
import Database from 'better-sqlite3'
import { config } from '@/features/config'
import { KyselyClient } from '../interface'

export const createKyselySqliteTestClient = async (): Promise<KyselyClient> => {
  const database = new Database(config.db.test.url)

  const dialect = new SqliteDialect({
    database
  })

  return new KyselyClient({
    dialect
  })
}
