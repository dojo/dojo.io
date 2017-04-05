import { promiseExec } from '../../util/process';
import { existsSync } from 'fs';

export default async function decryptDeployKey(encryptedKeyPath: string = 'deploy_key.enc', keyOut: string = 'deploy_key'): Promise<any> {
	const keyTag: string = process.env.ENCRYPTED_CODE;
	const canDecrypt = process.env[`encrypted_${ keyTag }_key`] && process.env[`encrypted_${ keyTag }_iv`];

	if (existsSync(keyOut)) {
		console.log(`Deployment key "${ keyOut }" already exists. SKIPPING!`);
		return;
	}

	if (!canDecrypt) {
		console.log('Missing credentials to decrypt deployment key. SKIPPING!');
		return;
	}

	if (!existsSync(encryptedKeyPath)) {
		console.log(`key "${ encryptedKeyPath } is missing. SKIPPING!`);
		return;
	}

	const command = `openssl aes-256-cbc -K $encrypted_${ keyTag }_key -iv $encrypted_${ keyTag }_iv -in ${ encryptedKeyPath } -out ${ keyOut } -d`;
	return promiseExec(command, { silent: true });
}
