import type { Insertable, Selectable, Updateable } from 'kysely'
import type { KyselyDatabaseTables } from './features/database/kysely'
import type { types } from '@blockchain-voting-system/api'

type ApiCompatibility<T> = T
type KSelectable<T> = Selectable<T>
type KInsertable<T> = Insertable<T>
type KUpdateable<T> = Updateable<T>

type GenerateTypes<T> = {
  Selectable: ApiCompatibility<KSelectable<T>>
  Insertable: ApiCompatibility<KInsertable<T>>
  Updateable: ApiCompatibility<KUpdateable<T>>
}

export namespace User {
  type T = GenerateTypes<KyselyDatabaseTables['users']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Election {
  type T = GenerateTypes<KyselyDatabaseTables['elections']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Position {
  type T = GenerateTypes<KyselyDatabaseTables['positions']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Candidate {
  type T = GenerateTypes<KyselyDatabaseTables['candidates']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Voter {
  type T = GenerateTypes<KyselyDatabaseTables['voters']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace Vote {
  type T = GenerateTypes<KyselyDatabaseTables['votes']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export namespace File {
  type T = GenerateTypes<KyselyDatabaseTables['files']>
  export type Selectable = T['Selectable']
  export type Insertable = T['Insertable']
  export type Updateable = T['Updateable']
}

export type MediaDescription =
  types.components['schemas']['Api.MediaDescription']
