import { sql, SqliteDialect } from 'kysely'
import Database from 'better-sqlite3'
import { config } from '@/features/config'
import { KyselyClient } from '../interface'
import { SerializePlugin } from 'kysely-plugin-serialize'

export const getCreateKyselySqliteClientOptions = () => {
  const database = new Database(config.db.url)

  const dialect = new SqliteDialect({
    database
  })

  return { dialect, plugins: [new SerializePlugin()] }
}

export const createKyselySqliteClient = async (): Promise<KyselyClient> => {
  const client = new KyselyClient(getCreateKyselySqliteClientOptions())

  await sql`PRAGMA journal_mode=WAL;`.execute(client)
  await sql`PRAGMA foreign_keys = ON;`.execute(client)

  return client
}
