import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('voters')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .addColumn('profile_photo', 'text')
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('address', 'text', (col) => col.notNull())
    .addColumn('private_key', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'text')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('voters').execute()
}
