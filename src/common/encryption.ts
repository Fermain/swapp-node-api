import { createCipheriv, randomBytes, createDecipheriv } from 'crypto';

/**
 * Class to Encrypt and decrypt values using aes-256-cbc and Initialization Vector.
 */
export class AESEncryption {
    private readonly encryption_key: string;
    /**
     * Specify your encryption key
     * @param {string} encryption_key - The key used to encrypt and decrypt a value (must be 32 characters)
     */
    constructor(encryption_key: string) {
        if (encryption_key.length > 32) {
            throw new Error('Encryption key is too long, must be 32 characters or less');
        }
        this.encryption_key = encryption_key
    }
    /**
     * Encrypt a value.
     * @param {string} text - The value to encrypt
     * @return {string} The encrypted value.
     */
    public encrypt(text: string): string {
        const iv = randomBytes(16); // For AES
        const cipher = createCipheriv('aes-256-cbc', Buffer.from(this.encryption_key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    /**
     * Decrypt a value.
     * @param {string} text - The value to decrypt
     * @return {string} The decrypted value.
     */
    public decrypt(text: string): string {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts[1], 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this.encryption_key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
