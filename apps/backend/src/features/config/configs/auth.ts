import { env } from '../env'

const expiry =
  env.NODE_ENV === 'production'
    ? 3600
    : env.NODE_ENV === 'staging'
      ? 3600
      : env.NODE_ENV === 'development'
        ? 3600
        : 1

const AuthConfig = {
  token: {
    secret: env.AUTH_TOKEN_SECRET,
    access: {
      expiry: 60 // 1 hour
    },
    refresh: {
      expiry: 60 * 24 * 30 // 30 days
    },
    signup: {
      expiry
    },
    signin: {
      expiry
    }
  }
}

export default AuthConfig
