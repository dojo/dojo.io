---
layout: docs
category: command-line
title: Creating a new Dojo 2 application
overview: Create a new Dojo 2 application from scratch
---

# Creating a new Dojo 2 application

## Objective

This recipe demonstrates the process of creating a new Dojo 2 application.

## Procedure

* **Ensure that the latest version of the Dojo Command Line utility (CLI) is installed.**
	* Run the command `dojo version` from the terminal or command-line.
	* If the command is not found, or the utility is out of date, run the command `npm install @dojo/cli -g` to install the latest version.
* **Create the application.**
	* Within the terminal, navigate to the directory that will host the new application.
	* Run the command `dojo create --name {app-name}` where `{app-name}` is replaced by the new application's name.
	* For example, to create an application called `hello-dojo`, the command would be `dojo create --name hello-dojo`.
* **Confirm the application was successfully installed.**
	* Navigate into the application's directory.
	* Run `dojo test` to run the initial test suite.
	* Run `dojo build --watch` to build the application and start the development server.
	* Open a browser to `http://localhost:9999` to confirm that the application is working.

## Additional resources

* Dojo 2 requires Node.js version 6 or above. To install the latest versions of Node, visit the [Node.js website](https://nodejs.org).
* To learn more about the Dojo CLI, refer to the [Dojo 2 local installation](/tutorials/000_local_installation) tutorial.
