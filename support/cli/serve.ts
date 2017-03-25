#!/usr/bin/env node
import WebServer from 'webserv/WebServer';
import ServeFile from 'webserv/middleware/ServeFile';
import ServeDirectory from 'webserv/middleware/ServeDirectory';
import Proxy from 'webserv/middleware/Proxy';
import route from 'webserv/handlers/route';
import { relativeUrl } from 'webserv/handlers/transform';

const commands = {
	'default'() {
		const server = new WebServer();
		server.app.middleware
			.add(route().transform(relativeUrl('/dojo.io')).wrap([
				new ServeFile('./_dist'),
				new ServeDirectory('./_dist')
			]))
			.add(new Proxy('http://dojo.github.io'));
		server.start();
		console.log(`started server on ${ server.config.port }`);
	}
};

export default commands;
