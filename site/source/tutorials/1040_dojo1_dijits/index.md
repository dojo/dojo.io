---
layout: tutorial
title: Using Dojo 1 Dijits
overview: In this tutorial, you will learn how to use Dojo 1 Dijits in a Dojo 2 application.
---

{% section 'first' %}

# Using Dojo 1 Dijits

## Overview

This tutorial will extend the the [Form widgets](../005_form_widgets/) tutorial.  In this tutorial, we will be taking some of the form widgets and replacing them with Dojo 1 Dijits.

While we would hope that developers would author their code fully in Dojo 2, we recognize that it might be challenging to do a wholesale migration, and that using custom Dijits that have been developed for Dojo 1 might help make it _easier_ to migrate an application, migrating complex Dojo 1 Dijits over a period of time.

## Prerequisites

You can [download](../assets/9001_dojo1_dijits-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Adding dependencies

{% task 'Installing dependencies.' %}

The first step will be to install our dependencies using npm:

{% instruction 'Install the initial dependencies via npm.' %}

```
$ npm install
```

{% instruction 'Install additional development dependency.' %}

```
$ npm install dojo-typings --save-dev
```

{% instruction 'Install additional runtime dependencies.' %}

```
$ npm install dojo dijit dojo-themes @dojo/interop --save
```

The `dojo`, `dijit`, and `dojo-themes` packages are the Dojo 1 dependencies we will be using at run-time.  The `@dojo/interop` package contains several tools that allow easy integration with other projects, like Dojo 1 and Redux.

{% section %}

## Updating project configuration

{% task 'Update the `dojo build` configuration.' %}

Dojo 1 and Dijits at runtime are considered _external_ dependencies for the Dojo 2 build system.  We need to supply information to the `dojo build` CLI command to include our external dependencies as part of our build.  The way we provide additional configuration information to the Dojo 2 CLI is via a `.dojorc` file in the root of our project.  The file is a JSON file, where configuration can be provided to each command.

{% instruction 'Create a `.dojorc` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/.dojorc' %}

In this case we have declared four external dependencies which will be copied as an external dependency during our build.  In addition some of those dependencies will be injected (loaded) into our bundle.  The first one is a configuration file for the Dojo 1 loader (which we haven't created yet).  The second one includes the `dojo` package and loads the Dojo 1 AMD loader which will then subsequently load the other Dojo 1 modules that are requested.  The final dependency is a modern flat theme for Dojo 1 Dijits.  We are injecting the _root_ CSS file into our application bundle as well, which will ensure the CSS is loaded an available at run time.

{% task 'Update the `tsconfig.json` configuration.' %}

In order for us to integrate the TypeScript typings, we need to adjust two sections of our `tsconfig.json`.

{% instruction 'Add `scripthost` to `lib` section of `tsconfig.json`:' %}

{% include_codefile 'demo/finished/biz-e-corp/tsconfig.json' lines:6-14 %}

Some of the Dojo 1 typings reference typings from this library.

{% instruction 'Add the Dijit module typings to `include` section of `tsconfig.json`:' %}

{% include_codefile 'demo/finished/biz-e-corp/tsconfig.json' lines:27-31 %}

By adding the modules to the scope of the TypeScript compiler, we should be able to have typing information when attempting to import various Dijit modules.

{% section %}

## Configuring Dojo 1

{% task 'Create loader configuration.' %}

{% aside 'Information' %}
The Dojo 1 loader configuration can be complex.  There is this Dojo 1 tutorial <em>[Configuring Dojo with dojoConfig](https://dojotoolkit.org/documentation/tutorials/1.10/dojo_config/index.html)</em> that explains how to configure Dojo 1.
{% endaside %}

In the previous step, we need to include a configuration for our Dojo 1 loader.  For this tutorial, we only need to ensure that the Dojo 1 loader works in an asynchronous fashion, because the Dojo 1 loader will default to synchronous operation, which will perform slower and cause issues with our application.  The file could be named anything, but in this tutorial, we are naming it `/src/dojo1.cfg.js`.

{% instruction 'Create a `/src/dojo1.cfg.js` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dojo1.cfg.js' %}

{% task 'Ensure the application builds.' %}

At this point, you should be able to build your application.

{% instruction 'Run `dojo build` in the project root.' %}

{% aside 'Reminder' %}
You can now use `dojo build -w` to continue to develop at this point.
{% endaside %}

You should see a rather long output indicating lots of files have been output.

{% section %}

## Dealing with Dijits

In order for Dijits to be integrated into a Dojo 2 application, they need to _wrapped_ so that they can be managed by the Dojo 2 widgeting system.  As discussed in previous steps, there is a function named `DijitWrapper` which will _convert_ a Dojo 1 Dijit constructor function into something that behaves like a Dojo 2 widget class.  When used with the Dojo 1 typings, you will also get code intellisense when configuring your Dijits.

The `DijitWrapper` function takes two arguments.  The first is the Dojo 1 `declare` class.  The second is an optional string, which represents that tag name that should be used when the Dojo 2 widgeting system needs to create a _DOM stub_ to attach the Dijit instance to.  It defaults to `div` if not supplied.

{% task 'Wrap Dijits.' %}

{% aside 'Information' %}
All Dojo 1 modules are AMD modules without default exports.  Because of this, you have to import them using the `import * as Dijit from 'module/id';` syntax.
{% endaside %}

We recommend that any Dijits that you wrap, that you create them as individual modules in `/src/dijit` in the same path structure they are located in the source `dijit` package.

{% instruction 'Create `/src/dijit/Fieldset.ts` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dijit/Fieldset.ts' %}

{% instruction 'Create `/src/dijit/form/Button.ts` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dijit/form/Button.ts' %}

{% instruction 'Create `/src/dijit/form/TextBox.ts` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dijit/form/TextBox.ts' %}

{% task 'Importing Dijits.' %}

Now that you have wrapped Dijits that you want to use, we need to import them into the Dojo 2 which will contain them.

{% instruction 'Import Dijits into `/src/widgets/WorkerForm.ts`:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:5-7 %}

{% section %}

## Placing Dijits

{% task 'Adding to a widget\'s render function.' %}

Now that we have imported our wrapped Dijits into the module we want to use them in, we need to add them to the render function.

{% instruction 'Add imported Dijits to the `WorkerForm` widget\'s render function:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:44-74 %}

{% aside 'Information' %}
The <em>properties</em> for a wrapped Dijit are equivalent to the <em>params</em> that can be passed when constructing a Dijit.  For more information on what parameters are possible on Dijits, you can refer to the [Dojo 1 API documentation](https://dojotoolkit.org/api/).
{% endaside %}

Once Dijits are wrapped, they behave very similar to Dojo 2 widgets.  Coupled with the `dojo-typings` TypeScript typings, you get code completion as well when specifying the _properties_ and TypeScript should help ensure the values of the properties are valid.

The one restriction to be aware of is that any wrapped Dijit can only have other wrapped Dijit's as children.  This is because all Dojo 2 widget's DOM is represented virtually, but all Dojo 1 Dijits directly manage their own DOM.  Having virtual DOM children is not something a Dijit is capable of dealing with.

{% task 'Setting a Dojo 1 theme.' %}

When we configured the _externals_ for our project, we included the main CSS for our theme.  Most Dijits will not render properly without a theme being applied to them.  There are many different ways to apply a Dojo 1 theme, but the most straight forward is to set the theme class name on the `<body>` of the application document.

{% instruction 'Add theme class name to `src/index.html`:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/index.html' lines:6-8 lang:html %}

You should now have an application that will provide you with a form that takes a first name, last name, and e-mail address in order to add another _card_ to the application.

{% section %}

## Summary

In this tutorial, we learned how to setup the build system to include Dojo 1 as an external dependency.  We learned how to import Dojo 1 based Dijits into a Dojo 2 project and wrap them so they can be integrated into the Dojo 2 widgeting system.  We also learned how to apply a Dojo 1 theme so our Dijits have a proper look and feel.

If you would like, you can download the completed [demo application](../assets/9001_dojo1_dijits-finished.zip) from this tutorial.

This tutorial is far from exhaustive on the subject, but is intended to provide the basics of using Dojo 1 Dijits in a Dojo 2 application.  In most cases we still feel it is better to use or create Dojo 2 widgets than to leverage Dojo 1 Dijits.  We think the main use case is when you want to incrementally migrate an existing application to Dojo 2, being able to _wrap_ custom Dijits can be really useful.

The way we integrated Dojo 1 in this situation is not suitable for a production application.  Ideally you would create a built layer of your Dojo 1 dependencies.  You can _inject_ that built layer in the same fashion as earlier in tutorial.  For more on creating builds of Dojo 1, you should refer to the Dojo 1 [Creating Builds](https://dojotoolkit.org/documentation/tutorials/1.10/build/index.html) tutorial.

{% section 'last' %}