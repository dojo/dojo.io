import { readdirSync,
	statSync,
	existsSync } from 'fs';

import { platform } from 'os';

import { join } from 'path';
import { logger } from '../log';
import { execSync } from 'child_process';

/**
 * archive tutorials so they can be downloaded via the CLI tool
 *
 * @param tutorialRoot the root tutorial directory
 * @param targetDirectory where the archives will be placed
 * @return {Promise<void>}
 */
export default async function exportTutorialProjects(tutorialRoot: string, targetDirectory: string) {
	const tutorialDirectories = readdirSync(tutorialRoot).filter(function (file) {
		const stat = statSync(join(tutorialRoot, file));
		return stat.isDirectory();
	});

	for (let tutorialDirectory of tutorialDirectories) {
		const examplesRoot = join(tutorialRoot, tutorialDirectory, 'demo');
		if (existsSync(examplesRoot)) {
			for (let directory of readdirSync(examplesRoot)) {
				const exampleDirectory = join(examplesRoot, directory);
				if (!statSync(exampleDirectory).isDirectory()) {
					continue;
				}
				const tutorialName = tutorialDirectory.substring(Math.max(0, join(tutorialDirectory, '..').length - 1));
				const name = `${ tutorialName }-${ directory }.project.json`;

				exportProject(exampleDirectory, targetDirectory, name);
				logger.info(`created project.json ${ tutorialName } ${ directory } to ${ targetDirectory }`);
			}
		}
	}
}

export function exportProject(exampleDirectory: string, targetDirectory: string, name: string) {
	for (let directory of readdirSync(exampleDirectory)) {
		const dojoProjectDirectory = join(exampleDirectory, directory);
		if (!statSync(dojoProjectDirectory).isDirectory()) {
			continue;
		}
		const exportDestination = join('.', `${directory}.project.json`);
		const destination = join(targetDirectory, name);
		// run npm i on project
		execSync('npm i', {
			cwd: dojoProjectDirectory
		});

		// run dojo export -p {path}
		execSync(`dojo export -p ${dojoProjectDirectory}`);

		// rename and move project.json file
		let moveCommand: string;
		let rmDirCommand: string;
		if (platform() === 'win32') {
			moveCommand = 'move';
			rmDirCommand = 'rmdir /s /q';
		}
		else {
			moveCommand = 'mv';
			rmDirCommand = 'rm -rf';
		}
		execSync(`${moveCommand} ${exportDestination} ${destination}`);

		// clean up
		execSync(`${rmDirCommand} ${join(dojoProjectDirectory, 'node_modules')}`);
	}
}
