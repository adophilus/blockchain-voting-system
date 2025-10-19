import type { ColumnType } from 'kysely'

type MediaDescription = {
  source: 'sqlite'
  id: string
}

type TimestampModel = {
  created_at: ColumnType<string, never, never>
  updated_at: ColumnType<string | null, never, string>
}

type UsersTable = TimestampModel & {
  id: string
  full_name: string
  email: string
  password_hash: string
  role: 'ADMIN' | 'USER'
}

type TokensTable = TimestampModel & {
  id: string
  user_id: string
  purpose: string
  token: string
  expires_at: string
  used_at: string | null
}

type ElectionsTable = TimestampModel & {
  id: string
  title: string
  description: string | null
  start_timestamp: string
  end_timestamp: string
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED'
}

type PositionsTable = TimestampModel & {
  id: string
  title: string
  description: string | null
  election_id: string
}

type CandidatesTable = TimestampModel & {
  id: string
  name: string
  bio: string | null
  image: MediaDescription | null
  position_id: string
}

type VotersTable = TimestampModel & {
  id: string
  election_id: string
  code: string
} & (
    | {
        status: 'NOT_VOTED'
        voted_at: null
      }
    | { status: 'VOTED'; voted_at: string }
  )

type VotesTable = {
  id: string
  election_id: string
  position_id: string
  candidate_id: string
  voter_id: string
  created_at: ColumnType<string, never, never>
}

type FilesTable = TimestampModel & {
  id: string
  original_name: string
  file_data: Buffer
  mime_type: string
}

export type KyselyDatabaseTables = {
  users: UsersTable
  tokens: TokensTable
  elections: ElectionsTable
  positions: PositionsTable
  candidates: CandidatesTable
  voters: VotersTable
  votes: VotesTable
  files: FilesTable
}
