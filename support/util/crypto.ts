import * as crypto from 'crypto';
import { Cipher, Decipher } from 'crypto';
import { exec, promisify } from './process';
import ReadableStream = NodeJS.ReadableStream;

export interface EncryptResult {
	encrypted: Cipher;
	iv: string;
	key: string;
}

export interface KeyPairFiles {
	publicKey: string;
	privateKey: string;
}

function randomUtf8(bytes: number): string {
	return crypto.randomBytes(bytes).toString('hex').slice(0, bytes);
}

export async function createDeployKey(deployKeyFile: string = 'deploy_key', keyComment: string = 'Automated Travis Deploy Key'): Promise<KeyPairFiles> {
	const command = `ssh-keygen -t rsa -b 4096 -C "${ keyComment }" -f ${ deployKeyFile } -N ""`;
	const proc = exec(command, { silent: false });
	await promisify(proc);
	return {
		publicKey: `${ deployKeyFile }.pub`,
		privateKey: deployKeyFile
	};
}

export function decryptData(data: ReadableStream, key: string, iv: string): Decipher {
	const decipher = crypto.createDecipheriv('AES-256-CBC', key, iv);
	return data.pipe(decipher);
}

export function encryptData(data: ReadableStream, key = randomUtf8(32), iv = randomUtf8(16)): EncryptResult {
	const cipher = crypto.createCipheriv('AES-256-CBC', key, iv);

	return {
		encrypted: data.pipe(cipher),
		iv,
		key
	};
}
