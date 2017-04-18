import { decryptData } from '../util/crypto';
import * as env from '../util/environment';
import { existsSync, createWriteStream, createReadStream } from 'fs';

/**
 * decrypts a deployment key
 *
 * @return if decryption was carried out
 */
export default async function decryptDeployKey(
	encryptedFile: string = env.encryptedKeyFile(),
	key: string = process.env[env.decryptKeyName()],
	iv: string = process.env[env.decryptIvName()],
	decryptedFile: string = env.keyFile()
): Promise<boolean> {
	if (!existsSync(encryptedFile) || existsSync(decryptedFile) || !key || !iv) {
		return false;
	}

	return new Promise<boolean>(function (resolve, reject) {
		const source = createReadStream(encryptedFile);
		const target = createWriteStream(decryptedFile);

		decryptData(source, key, iv)
			.pipe(target)
			.on('error', function (error: Error) {
				reject(error);
			}).on('close', function () {
				resolve(true);
			});
	});
};
