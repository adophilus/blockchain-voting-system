import { hash, compare } from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hashes a password using bcrypt
 * @param password The plain text password to hash
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await hash(password, SALT_ROUNDS)
}

/**
 * Compares a plain text password with a hashed password
 * @param password The plain text password
 * @param hashedPassword The hashed password to compare against
 * @returns True if the passwords match, false otherwise
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await compare(password, hashedPassword)
}