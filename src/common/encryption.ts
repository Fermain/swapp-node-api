import {createCipheriv, createDecipheriv, randomBytes} from 'crypto';
import envSchema from "env-schema";

const schema = {
    type: 'object',
    required: ['AES_ENCRYPTION_KEY'],
    properties: {
        AES_ENCRYPTION_KEY: { type: 'string' }
    }
};
const config = envSchema({
    schema: schema,
    dotenv: true
});
/**
 * Class to Encrypt and decrypt values using aes-256-cbc and Initialization Vector.
 */
export class AESEncryption {
    private static readonly encryption_key: string = config.AES_ENCRYPTION_KEY; // must be 32 characters

    /**
     * Encrypt a value.
     * @param {string} text - The value to encrypt
     * @return {string} The encrypted value.
     */
    public static encrypt(text: string): string {
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
    public static decrypt(text: string): string {
        const textParts = text.split(':');
        // @ts-ignore
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = createDecipheriv('aes-256-cbc', Buffer.from(this.encryption_key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}
