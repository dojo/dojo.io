---
title: Dojo local installation
icon: cloud-download-alt
layout: tutorial
overview: Discover the basics of creating a Dojo application.
paginate: false
group: getting_started
topic: install
---

# Dojo local installation

## Overview
This tutorial covers setup of a local Dojo environment.

## Creating a Dojo Application
First, we need to create a Dojo project. Dojo is powerful and leverages advanced tools for creating applications. It also provides a potent command-line tool to streamline the installation process, which is installed with the following terminal command:

```bash
npm install -g @dojo/cli
```

This command installs the Dojo command-line tool (`@dojo/cli`) to simplify development tasks related to creating, testing, and building your applications. Initially, the `@dojo/cli` tool only comes with two options:
* `eject` - Disconnects a project from `@dojo/cli` allowing advanced users to customize configuration
* `version` - Reports the version of `@dojo/cli` and any commands that are installed

Running `dojo` will show all available commands even if they are not installed, when you try to run a command that is not available the CLI will print a message that the command needs to be installed.

In order to create your first Dojo application, you need to globally install the `@dojo/cli-create-app` command which creates a template project to get started:

```bash
npm install -g @dojo/cli-create-app
```

Once the command is installed run the following command to create your Dojo project:

```bash
dojo create app --name first-dojo-app
```

{% aside 'Dojo create arguments' %}
Many of the arguments passed to `dojo create app` have abbreviated versions. So `dojo create app -n first-dojo-app` is equivalent to `dojo create app --name first-dojo-app`.
{% endaside %}

This command will create the basic scaffolding for a Dojo application in the newly created "first-dojo-app" directory with all of its dependencies pre-installed.

At this point, we've successfully created our first basic Dojo application and installed its dependencies. Now it is time to see what our application can do! First, we are going to leverage another `@dojo/cli` command. You don't have to install this one, it was added when you installed the other dependencies. In the terminal, switch into the `first-dojo-app` directory and then enter the `dojo build --mode dev --watch --serve` command:

```bash
cd first-dojo-app
dojo build --mode dev --watch --serve
```
(or, the shorter, `dojo build -m dev -w -s`)

{% aside 'Production build as a default' %}
The `@dojo/cli-build-app` command will create a production-ready build using `--mode dist` by default. Providing `--mode dev` instructs the command to create a development build that is useful for debugging and ongoing development.
{% endaside %}

This command will invoke Dojo's tool to build and transpile the project using [Webpack](https://webpack.github.io/), a popular tool for optimizing JavaScript source code. The `--watch` (or `-w`) flag watches and rebuilds your project whenever any changes are saved and the `--serve` (or `-s`) flag starts a simple web server which allows us to run our application in the browser while we make modifications.

In order to see what the application looks like, open a modern web browser (such as the latest version of Chrome, Edge, Firefox, Internet Explorer, or Safari) and navigate to [`http://localhost:9999`](http://localhost:9999). You will be greeted by a humble page that welcomes you to your new application.
