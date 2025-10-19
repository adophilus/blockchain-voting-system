import { Kysely } from 'kysely'
import type { KyselyDatabaseTables } from './tables'

export class KyselyClient extends Kysely<KyselyDatabaseTables> {}
