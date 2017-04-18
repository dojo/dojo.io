import * as archiver from 'archiver';
import { createWriteStream, readdirSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { logger } from '../log';

interface FixedArchiver extends archiver.Archiver {
	pointer(): number;
}

/**
 * archive tutorials so they can be downloaded via the CLI tool
 *
 * @param tutorialRoot the root tutorial directory
 * @param targetDirectory where the archives will be placed
 * @return {Promise<void>}
 */
export default async function archiveTutorials(tutorialRoot: string, targetDirectory: string) {
	const tutorialDirectories = readdirSync(tutorialRoot).filter(function (file) {
		const stat = statSync(join(tutorialRoot, file));
		return stat.isDirectory();
	});

	for (let tutorialDirectory of tutorialDirectories) {
		const examplesRoot = join(tutorialRoot, tutorialDirectory, 'demo');
		if (existsSync(examplesRoot)) {
			for (let directory of readdirSync(examplesRoot)) {
				const exampleDirectory = join(examplesRoot, directory);
				const tutorialName = tutorialDirectory.substring(Math.max(0, join(tutorialDirectory, '..').length - 1));
				const archivePath = join(targetDirectory, `${ tutorialName }-${ directory }.zip`);
				const internalDestination = join(tutorialName, directory);
				await archiveTutorial(exampleDirectory, archivePath, internalDestination);
				logger.info(`archived tutorial ${ tutorialName } ${ directory } to ${ targetDirectory }`);
			}
		}
	}
}

/**
 * Archive a directory
 *
 * @param directory
 * @param targetFile
 * @param internal
 * @return {Promise<Promise<T>|Promise>}
 */
export function archiveTutorial(directory: string, targetFile: string, internal: string): Promise<any> {
	return new Promise(function (resolve, reject) {
		const archive: FixedArchiver = <FixedArchiver> archiver('zip', {
			store: true
		});
		const output = createWriteStream(targetFile);

		output.on('close', function () {
			resolve({
				size: archive.pointer()
			});
		});

		archive.on('error', function (error: Error) {
			reject(error);
		});

		archive.pipe(output);
		archive.directory(directory, internal);
		archive.finalize();
	});
}
