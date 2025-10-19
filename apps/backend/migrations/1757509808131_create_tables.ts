import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('elections')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('start_timestamp', 'text', (col) => col.notNull())
    .addColumn('end_timestamp', 'text', (col) => col.notNull())
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'text')
    .execute()

  await db.schema
    .createTable('positions')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('election_id', 'text', (col) =>
      col.references('elections.id').onDelete('cascade').notNull()
    )
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'text')
    .execute()

  await db.schema
    .createTable('candidates')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('position_id', 'text', (col) =>
      col.references('positions.id').onDelete('cascade').notNull()
    )
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('bio', 'text')
    .addColumn('image', 'text')
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'text')
    .execute()

  await db.schema
    .createTable('voters')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('election_id', 'text', (col) =>
      col.references('elections.id').onDelete('cascade').notNull()
    )
    .addColumn('status', 'text', (col) => col.notNull())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('voted_at', 'text')
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'text')
    .addUniqueConstraint('unique_voter_per_election', ['election_id', 'code'])
    .execute()

  await db.schema
    .createTable('votes')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('election_id', 'text', (col) =>
      col.references('elections.id').onDelete('cascade').notNull()
    )
    .addColumn('position_id', 'text', (col) =>
      col.references('positions.id').onDelete('cascade').notNull()
    )
    .addColumn('candidate_id', 'text', (col) =>
      col.references('candidates.id').onDelete('cascade').notNull()
    )
    .addColumn('voter_id', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addUniqueConstraint('unique_voter_per_position', [
      'position_id',
      'voter_id'
    ])
    .execute()

  await db.schema
    .createTable('users')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('full_name', 'text', (col) => col.notNull())
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('password_hash', 'text', (col) => col.notNull())
    .addColumn('role', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()

  await db.schema
    .createTable('files')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('original_name', 'text', (col) => col.notNull())
    .addColumn('file_data', 'blob', (col) => col.notNull())
    .addColumn('mime_type', 'text', (col) => col.notNull())
    .addColumn('created_at', 'text', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('files').execute()
  await db.schema.dropTable('users').execute()
  await db.schema.dropTable('votes').execute()
  await db.schema.dropTable('voters').execute()
  await db.schema.dropTable('candidates').execute()
  await db.schema.dropTable('positions').execute()
  await db.schema.dropTable('elections').execute()
}
