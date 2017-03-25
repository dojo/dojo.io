import ServeFile from 'webserv/middleware/ServeFile';
import ServeDirectory from 'webserv/middleware/ServeDirectory';
import WebProxy from 'webserv/middleware/Proxy';
import route from 'webserv/handlers/route';
import { relativeUrl } from 'webserv/handlers/transform';
import LogRequest from 'webserv/middleware/LogRequest';
import { Handler } from 'webserv/handlers/Handler';

export function middleware(): Handler[] {
	return [
		new LogRequest(),
		route(/./).transform(relativeUrl('/dojo.io')).wrap([
			new ServeFile('./_dist'),
			new ServeDirectory('./_dist')
		]),
		new WebProxy('http://dojo.github.io')
	];
}
