import { SqliteDialect } from 'kysely'
import Database from 'better-sqlite3'
import { config } from './src/features/config'
import { defineConfig } from 'kysely-ctl'

const getCreateKyselySqliteClientOptions = () => {
  const database = new Database(config.db.url)

  const dialect = new SqliteDialect({
    database
  })

  return { dialect }
}

export default defineConfig(getCreateKyselySqliteClientOptions())
