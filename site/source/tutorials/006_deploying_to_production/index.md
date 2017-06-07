---
layout: tutorial
title: Deploying to Production
overview: This tutorial shows how to prepare a Dojo 2 application for production deployment.
---

{% section 'first' %}

# Deploying to Production

## Overview

{% aside 'Recommendation' %}
To get the most value out of this tutorial, we recommend downloading the [demo project](../assets/006_deploying_to_production-initial.zip) and working locally.
{% endaside %}

This tutorial will extend on the [previous](../005_form_widgets/) tutorial where we added a form to allow the user to create new workers. In this tutorial, we will prepare the application for deployment to production.

## Prerequisites
You can [download](../assets/006_deploying_to_production-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Production builds

{% task 'Create a production build.' %}

Creating a production build of a Dojo 2 application is straightforward. We have actually been creating an application for production throughout this tutorial series. If you have been following the tutorials locally, you have been using the `dojo build --watch` command to build the application and start a web-server to view the application as it developed. This version of the application is almost the same as what should be deployed to production.

{% instruction 'Run the `dojo build` command.' %}

The build command creates a new folder, `dist`, where all of the built files are located. Open that directory and examine `index.html`. This version of `index.html` is slightly different than the one in the `src` directory - the build process has added links to `main.css` and `src/main.js` so that the application and its styling rules will be available.

`main.css` contains the styling rules for the application's custom widgets as well as the `Button` and `TextInput` widgets that are used in the `WorkerForm`. `main.css.map` provides information that development tools use to map the styling rules in `main.css` to the original sources.

Finally, there is `report.html` in the `dist` directory. Opening that in a browser reveals a page that looks like this:

<p class="center">![build_stats](./resources/build_stats.png)</p>

This interactive chart shows how much the build process was able to compress the source code. Hovering over different sections shows the individual resources that have been included in the build.

Additionally, the `dist` folder contains three subdirectories. Two of those, `images` and `styles` are copies from the `src` directory. The third directory, `src`, contains two entries - `main.js` and `main.js.map`. `main.js` contains all of the application's source code after it has been transpiled to JavaScript, bundled, and [minified](http://bit.ly/2rVdhNk). This allows the application to be served as efficiently as possible. `main.js.map` is used to allow developers to view the original source code when debugging the application.

Since all of the resources in the `dist` folder are optimized for use in production, deployment only involves copying the contents of the `dist` directory to the location that the web application expects them to be.

While the default `dojo build` command can handle many common scenarios, there are some arguments that can be passed to the command to influence the build process. We will talk about those in the next section.

{% section %}

## Build options

{% task 'Learn how to customize a Dojo 2 build.' %}

The default options for `dojo build` are sufficient for many situations, but there are cases where additional configuration is required.

{% instruction 'Run the `dojo build help` command and examine the result.' %}

There are four groups of command line arguments that are available when using the `dojo build` command.

The first group consists of the `--watch` and `--port` arguments. These are used to start and configure the development server that is designed to host Dojo 2 applications as they are being authored.

The `--help` argument displays the help information for the `dojo build` command and is equivalent to the `dojo build help` command.

{% aside 'I18n in Dojo 2' %}
Dojo 2 has a complete set of internationalization (i18n) capabilities that are beyond the scope of this tutorial. To learn more about i18n in Dojo 2, refer to the [Internationalization in Dojo 2 tutorial](../comingsoon.html).
{% endaside %}

The `--locale`, `--supportedLocales`, and `--messageBundles` arguments are used to configure the build's support for internationalization. The `--locale` argument is used to specify which language should be considered the *default*. Whenever a different locale is used that does not have a specific translation, the default locale's translation will be used. The `--supportedLocales` argument is used to specify all of the provided locales for the application. Each locale that is added here will have its rules for date formatting, currency, etc. added to the build. Finally, the `--messageBundles` argument specifies all of the message bundles (translations) that should be included in the build. For more information about creating internationalized applications with Dojo 2, refer to the [Internationalization](../comingsoon.html) article in the reference guide.

The next two arguments that are listed when the `dojo build help` command is run are the `--element` and `--elementPrefix`. These two fields are primarily used when exporting Dojo 2 widgets as [web components](https://en.wikipedia.org/wiki/Web_Components) rather than for building stand alone Dojo 2 applications.

The `--debug` argument will cause the builder to generate `profile.json`, providing a great deal of information about the build itself, including what modules were included and how long they took to build. A profile be inspected using WebPack's [analyze tool](https://webpack.github.io/analyse/).

The final argument is `--disableLazyWidgetDetection`. A widget can be registered with the [widget registry](https://github.com/dojo/widget-core#widget-registry) to load only when required. This [lazy loading](https://en.wikipedia.org/wiki/Lazy_loading) behavior can reduce the initial load time of the application and is often useful when large, sophisticated widgets are not initially required. The build system does this by creating a separate bundle for each of these lazily loaded widgets. Lazy loading can, however, cause unnecessary delays if the widgets are actually needed initially. In those situations, adding the `--disableLazyWidgetDetection` argument will cause the the build system to include lazily loaded widgets into the main bundle. The widgets will then be immediately available for use by the application.

The command line arguments give control over how the application is built and prepared for deployment. However, providing these arguments every time a build is required can be error prone. In the next section, we will learn how to create a persistent build configuration by using `.dojorc`.

{% section %}

## Configuration

{% task 'Use .dojorc to store configuration settings.' %}

The command line arguments that the `dojo build` tool accepts are very useful when developing an application and preparing it to be deployed to production. However, since command line arguments can't be committed to source control, they are not the best way to ensure that production deployment builds are executed consistently. To store configuration settings, Dojo 2 applications can store their settings in `.dojorc`.

{% aside 'Arguments vs .dojorc' %}
It is possible to provide different settings when using command line arguments and `.dojorc`. When this occurs, command line arguments always take precedence over configuration settings stored in `.dojorc`.
{% endaside %}

`.dojorc` contains a JSON object with configuration information for any of the commands that are run via the `dojo` command line tool, such as `dojo build`. Each command is allocated a section within the configuration object where its settings can be stored.

Consider the following:

```json
{
  "build-webpack": {
    "locale": "en",
    "messageBundles: [ "src/nls/main" ]
  }
}
```

This is a sample `.dojorc` and contains configuration settings for the `dojo build` command. Note the field name, `build-webpack`. This is the full name of the command that we have been using. Each `dojo-cli` command group, such as `build`, has a default sub-command. The `build` command's default sub-command is `webpack`, so the `dojo build` command is equivalent to entering `dojo build webpack`. Since each entry in `.dojorc` needs the full command name, the field name must be `build-webpack`. That entry contains an object with two values - `locale` and `messageBundles`. Each of these fields takes values that are similar to the same options when provided by the command line.

Dojo 2's build system is designed to encapsulate the build process as completely as possible. However, there may be times when a greater degree of control is required. In those situations, a project can be *ejected* from the `dojo` command line tool. We will take a look at that next.

{% section %}

## Taking full control

{% task 'Take full control of the build process.' %}

The build tool is designed to cover the most common use cases for developing and deploying Dojo 2 applications. There are times, however, when you need to take full control of the deployment process. To achieve this level of control, a project can be *ejected* from the `dojo` tool and all of its configuration information exported.

**Note:** This is a *non-reversible* process. Once a project has been ejected, the `dojo` tool can no longer be used to manage a project.

To eject a project, use the `dojo eject` command. You will be prompted to ensure that you understand that this is a non-reversible action. Entering **'y'** will begin to export process. The export process generates a new directory - `config` that contains all of the exported configuration information for each of the `dojo-cli` tools that the project had been using. The process will also install some additional dependencies that the project now requires.

The project is now configured to be managed as a webpack project. Changes can be made to the build configuration by altering `config/build-webpack/webpack.config.js`. A build can then be triggered by running `webpack`'s build command and providing the configuration. That command is: `./node_modules/.bin/webapack --config ./config/build-webpack/webpack.config.js`.

{% section %}

## Summary

For many software projects, preparing an application for deployment to production often involves creating complicated settings and at least a little bit of experimentation. Dojo 2, on the other hand, provides a single command, `dojo build` that is used both during development as well as for production deployments.

While the `dojo build` command addresses many use cases, a few configuration options are necessary to support certain development and deployment scenarios. The `--locale`, `--supportedLocales`, and `--messageBundles` arguments are used to configuration the applications internationalization support. The `--debug` argument allows the results of the build to be examined in more depth. Finally, the `--disableLazyWidgetDetection` argument can be used to optimize how an application loads widgets.

To ensure repeatable builds, all of the configuration options for the `dojo` CLI commands can be stored in `.dojorc`, an ideal choice when it is necessary to ensure that consecutive builds are executed with the same parameters.

In the event that the development team requires a higher level of control than Dojo 2's build system offers, a project can be exported via the `dojo eject` command. This non-reversible command exports all of the `dojo` CLI commmands' configuration information, providing a solid starting point for additional optimizations.

## Next steps

This brings us to the end of the beginner tutorials for Dojo 2. At this point, you should have a good understanding of how to build simple applications with Dojo 2. There are, however, many more features that Dojo 2 has to offer.

To learn about those features, take a look at the [advanced tutorials](../comingsoon.html) section where you will find more tutorials that demonstrate how to use features that almost every application needs such as creating in-page routers, working with client-side data stores, and more. For less common features, the [cookbook](../comingsoon.html) contains tutorials for features that are more specialized in nature such as data visualization.

If you would like to learn more about the underlying architecture and technology behind Dojo 2, take a look at the articles in the [reference guide](../comingsoon.html). This section contains information about topics such as [TypeScript and Dojo2](../comingsoon.html) and [Working with a Virtual DOM](../comingsoon.html). These articles provide valuable insight into why Dojo 2 works the way that it does.

{% section 'last' %}
