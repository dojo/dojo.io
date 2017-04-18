import { mkdirSync, mkdtempSync, existsSync } from 'fs';
import { join } from 'path';

export function tmpDirectory(): string {
	if (!existsSync('.test')) {
		mkdirSync('.test');
	}
	return mkdtempSync('.test/dir-');
}

export function tmpFile(name: string = String(Math.floor(Math.random() * 10000))): string {
	let filename: string;

	do {
		filename = join(tmpDirectory(), name);
	} while (existsSync(filename));

	return filename;
}
