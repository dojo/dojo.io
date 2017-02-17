import ServeFile from 'webserv/middleware/ServeFile';
import ServeDirectory from 'webserv/middleware/ServeDirectory';
import WebProxy from 'webserv/middleware/Proxy';
import route from 'webserv/handlers/route';
import { relativeUrl } from 'webserv/handlers/transform';
import LogRequest from 'webserv/middleware/LogRequest';

export function middleware() {
	return [
		new LogRequest(),
		route(/./).transform(relativeUrl('/dojoio')).wrap([
			new ServeFile('./_dist'),
			new ServeDirectory('./_dist')
		]),
		new WebProxy('http://sitepen.github.io')
	];
}
