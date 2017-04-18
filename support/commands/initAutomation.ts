import { logger } from '../log';
import GitHub, { AuthResponse } from '../util/GitHub';
import { existsSync, createReadStream, createWriteStream } from 'fs';
import { createDeployKey, encryptData, decryptData } from '../util/crypto';
import Travis from '../util/Travis';
import { equal } from '../util/streams';
import * as env from '../util/environment';

export default async function setupAutomation(
	repo: GitHub,
	deployKeyFile = env.keyFile(),
	encryptedKeyFile = env.encryptedKeyFile(deployKeyFile)
) {
	let auth: AuthResponse = null;

	async function setup() {
		logger.info(`Setting up auto publish for ${ repo.toString() }`);
		if (existsSync(deployKeyFile)) {
			throw new Error('Deploy key already exists');
		}
		logger.info('Creating a deployment key');
		const keys = await createDeployKey(deployKeyFile);

		logger.info('Encrypting deployment key');
		const enc = encryptData(createReadStream(keys.privateKey));
		await new Promise(function (resolve) {
			enc.encrypted.pipe(createWriteStream(encryptedKeyFile))
				.on('close', function () {
					resolve();
				});
		});

		logger.info('Creating a temporary authorization token in GitHub for Travis');
		auth = await repo.createAuthorizationToken('temporary token for travis cli');
		const travis = new Travis();
		logger.info('Authenticating with Travis');
		await travis.authenticate(auth.token);
		logger.debug('Fetching Travis repository information');
		const travisRepo = await travis.fetchRepository(repo.toString());

		logger.info('Registering environment variables');
		await travisRepo.setEnvironmentVariables(
			{ name: env.decryptKeyName(), value: enc.key, isPublic: false },
			{ name: env.decryptIvName(), value: enc.iv, isPublic: false }
		);

		logger.info(`Confirm decrypt deploy key`);
		await equal(decryptData(createReadStream(encryptedKeyFile), enc.key, enc.iv), createReadStream(keys.privateKey));

		logger.info('Adding deployment key to GitHub');
		await repo.addDeployKey(keys.publicKey, 'Auto-created Travis Deploy Key', false);

		logger.info('');
		logger.info(`A new encrypted deploy key has been created at ${ encryptedKeyFile }.`);
		logger.info(`Please commit this to your GitHub repository. The unencrypted keys "${ keys.publicKey }"`);
		logger.info(`and "${ keys.privateKey }" may be deleted.`);
		logger.info(`Variables to decrypt this key have been added to your Travis repository with the name`);
		logger.info(`"${ env.decryptKeyName() } and ${ env.decryptIvName() }.`);
		logger.info('To begin publishing this site please add the DEPLOY_DOCS environment variable to Travis');
		logger.info('and set its value to "publish"');

		return {
			decipher: {
				key: enc.key,
				iv: enc.iv
			},
			keys: {
				encryptedKey: encryptedKeyFile,
				publicKey: keys.publicKey,
				privateKey: keys.privateKey
			}
		};
	}

	async function cleanup() {
		if (repo && auth) {
			logger.info('Removing temporary authorization token from GitHub');
			await repo.removeAuthorizationToken(auth.id);
		}
	}

	const promise = setup();
	return promise.then(cleanup, cleanup).then(() => promise);
}
