import { env } from '../env'

const DatabaseConfig = {
  url: env.DATABASE_URL,
  test: {
    url: 'sqlite://./storage/db.sqlite'
  }
}

export default DatabaseConfig
