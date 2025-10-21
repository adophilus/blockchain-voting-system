// @ts-nocheck
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { Logger } from '@/features/logger'

export class EncryptionUtil {
  private algorithm = 'aes-256-gcm'
  
  constructor(
    private logger: Logger,
    private encryptionKey: string
  ) {
    // Validate encryption key length
    if (encryptionKey.length !== 64) {
      throw new Error('Encryption key must be 64 characters (32 bytes hex encoded)')
    }
  }

  /**
   * Encrypts a private key
   * @param privateKey The private key to encrypt
   * @returns Encrypted private key with IV and auth tag
   */
  encryptPrivateKey(privateKey: string): string {
    try {
      // Generate a random IV
      const iv = randomBytes(16)
      
      // Create cipher
      const cipher = createCipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        iv
      )
      
      // Encrypt the private key
      let encrypted = cipher.update(privateKey, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      // Get the authentication tag
      const authTag = cipher.getAuthTag()
      
      // Combine IV, auth tag, and encrypted data
      const result = iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
      
      this.logger.info('Successfully encrypted private key')
      return result
    } catch (error) {
      this.logger.error('Failed to encrypt private key:', error)
      throw error
    }
  }

  /**
   * Decrypts a private key
   * @param encryptedPrivateKey The encrypted private key with IV and auth tag
   * @returns Decrypted private key
   */
  decryptPrivateKey(encryptedPrivateKey: string): string {
    try {
      // Split the encrypted data into components
      const parts = encryptedPrivateKey.split(':')
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted private key format')
      }
      
      const [ivHex, authTagHex, encryptedHex] = parts
      
      // Convert hex strings back to buffers
      const iv = Buffer.from(ivHex, 'hex')
      const authTag = Buffer.from(authTagHex, 'hex')
      const encrypted = Buffer.from(encryptedHex, 'hex')
      
      // Create decipher
      const decipher = createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        iv
      )
      
      // Set the authentication tag
      decipher.setAuthTag(authTag)
      
      // Decrypt the private key
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      this.logger.info('Successfully decrypted private key')
      return decrypted
    } catch (error) {
      this.logger.error('Failed to decrypt private key:', error)
      throw error
    }
  }

  /**
   * Generates a new encryption key
   * @returns A new 32-byte hex-encoded encryption key
   */
  static generateEncryptionKey(): string {
    return randomBytes(32).toString('hex')
  }
}
