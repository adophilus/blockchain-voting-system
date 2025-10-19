import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { FileMigrationProvider, Migrator } from 'kysely'
import type { KyselyClient } from './interface'

export const createKyselyMigrator = (
  client: KyselyClient,
  folder: string
): Migrator =>
  new Migrator({
    db: client,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: folder
    })
  })

export default Migrator
