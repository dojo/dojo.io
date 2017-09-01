import { statSync } from 'fs';
import { join } from 'path';
import ServeFile from 'webserv/middleware/ServeFile';
import ServeDirectory from 'webserv/middleware/ServeDirectory';
import WebProxy from 'webserv/middleware/Proxy';
import route from 'webserv/handlers/route';
import { relativeUrl } from 'webserv/handlers/transform';
import LogRequest from 'webserv/middleware/LogRequest';
import { Handler } from 'webserv/handlers/Handler';

function isDirectory(location: string): boolean {
	try {
		const stats = statSync(location);
		return stats.isDirectory();
	}
	catch (e) {
	}

	return false;
}

const rootDirectory = './_dist';

export function middleware(): Handler[] {
	return [
		new LogRequest(),
		route(/./).filter(incomingMessage => {
			const path = join(rootDirectory, incomingMessage.url);

			return isDirectory(path) && incomingMessage.url.lastIndexOf('/') !== incomingMessage.url.length - 1;
		}).wrap(
			(request, response) => {
				response.writeHead(301, { Location: request.url + '/'});
				response.end('');
				return Promise.resolve();
			}
		),
		route(/./).transform(relativeUrl('/dojo.io')).wrap([
			new ServeFile(rootDirectory),
			new ServeDirectory(rootDirectory)
		]),
		new WebProxy('http://dojo.github.io')
	];
}
