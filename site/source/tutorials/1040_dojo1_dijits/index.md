---
layout: false
title: Using Dojo 1 Dijits
overview: Find out how to use Dojo 1 Dijits in a Dojo 2 application.
paginate: true
---

{% section 'first' %}

# Using Dojo 1 Dijits

## Overview

This tutorial will extend the the [Form widgets](../005_form_widgets/) tutorial.  In this tutorial, will replace some of the Dojo 2 based form widgets and with Dojo 1 Dijits.

To achieve maximum performance and efficiency, developers should eventually author their Dojo 2 application with Dojo 2 widgets. This approach is provided as a migration strategy, to leverage custom Dojo 1 Dijits within a Dojo 2 application, to help make it easier to migrate an application in phases over time.

## Prerequisites

You can [download](../assets/1040_dojo1_dijits-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Adding dependencies

{% task 'Installing dependencies.' %}

The first step will be to install our dependencies using npm:

{% instruction 'Install the initial dependencies via npm:' %}

```
$ npm install
```

{% instruction 'Install this additional development dependency:' %}

```
$ npm install dojo-typings --save-dev
```

{% instruction 'Install additional run-time dependencies:' %}

```
$ npm install dojo dijit dojo-themes @dojo/interop --save
```

The `dojo`, `dijit`, and `dojo-themes` packages are the Dojo 1 dependencies we will be using at run-time.  The `@dojo/interop` package contains several tools that allow easy integration with other projects, like Dojo 1 and Redux.

{% section %}

## Updating project configuration

{% task 'Updating the `dojo build` configuration.' %}

Dojo 1 and Dijits at run-time are considered _external_ dependencies for the Dojo 2 build system.  We need to supply information to the `dojo build` CLI command to include our external dependencies as part of our build.  We provide additional configuration information to the Dojo 2 CLI via `.dojorc` in the root of our project.  `.dojorc` is formatted as a JSON file and configuration can be provided to each CLI command.

{% aside 'Dojo Build Command' %}
Currently only the older command `cli-build-webpack` supports loading external modules into Dojo 2, so for this tutorial this is the build command that is required.
{% endaside %}

{% instruction 'Create a `.dojorc` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/.dojorc' %}

 To support Dojo 1 Dijits we have declared four external dependencies which will be copied during our build.  Additionally, some of those dependencies will be injected (loaded) into our bundle.  The first dependency provides configuration for the Dojo 1 loader (which we will create later).  The second dependency includes the `dojo` package and loads the Dojo 1 AMD loader which will then subsequently load the other Dojo 1 modules that are requested.  The third dependency is `dijit`, which contains our Dojo 1 Dijits.  The final dependency is a modern flat theme for Dojo 1 Dijits.  We are injecting the _root_ CSS into our application bundle as well, which will ensure the CSS is loaded and available at run time.

{% task 'Updating the `tsconfig.json` configuration.' %}

In order for us to integrate the TypeScript typings, we need to adjust two sections of our `tsconfig.json`.

{% instruction 'Add `scripthost` to the `lib` section of `tsconfig.json`:' %}

{% include_codefile 'demo/finished/biz-e-corp/tsconfig.json' lines:6-14 %}

Some of the Dojo 1 typings reference typings from this library.

{% instruction 'Add the Dijit module typings to the `include` section of `tsconfig.json`:' %}

{% include_codefile 'demo/finished/biz-e-corp/tsconfig.json' lines:27-31 %}

{% aside 'Information' %}
If you are using your own custom Dijits, you should add your own TypeScript typings to the project.  The [`dojo/typings`](https://github.com/dojo/typings/) can provide you examples of how you might want to accomplish this.
{% endaside %}

By adding the modules to the scope of the TypeScript transpiler, we should have typing information available when attempting to import various Dijit modules.

{% section %}

## Configuring Dojo 1

{% task 'Creating loader configuration.' %}

{% aside 'Information' %}
The Dojo 1 loader configuration can be complex.  There is this Dojo 1 tutorial <em>[Configuring Dojo with dojoConfig](https://dojotoolkit.org/documentation/tutorials/1.10/dojo_config/index.html)</em> that explains how to configure Dojo 1.
{% endaside %}

In the previous step, we needed to include a configuration for our Dojo 1 loader.  For this tutorial, we only need to ensure that the Dojo 1 loader works asynchronously, because the Dojo 1 loader will default to synchronous operation, which would inhibit performance and cause issues with our Dojo 2 application.  The configuration could have any name.  Here we specify it as `/src/dojo1.cfg.js`.

{% instruction 'Create a `/src/dojo1.cfg.js` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dojo1.cfg.js' %}

{% task 'Ensuring the application builds.' %}

At this point, you should be able to build your application.

{% aside 'Reminder' %}
You can now use `dojo build -w` to continue to develop, with live rebuilding of your project.
{% endaside %}

{% instruction 'Run `dojo build` in the project root.' %}

You should see a rather long output indicating many dependencies have been output.

{% section %}

## Working with Dijits

To integrate Dijits within a Dojo 2 application, they need to _wrapped_ for management by the Dojo 2 widgeting system.  As discussed in previous steps, the `DijitWrapper` function will _convert_ a Dojo 1 Dijit constructor function into something that behaves like a Dojo 2 widget class.  When used with the Dojo 1 typings, you will also get code intellisense when configuring your Dijits.

The `DijitWrapper` function accepts two arguments.  The first is the Dojo 1 `declare` class.  The second is an optional string, which represents the tag name that should be used when the Dojo 2 widgeting system needs to create a _DOM stub_ to attach the Dijit instance to.  It defaults to `div` if not supplied.

{% aside 'Information' %}
All Dojo 1 modules are AMD modules without default exports.  As such, you need to import Dojo 1 modules using the `import * as Dijit from 'module/id';` syntax.
{% endaside %}

{% task 'Wrapping Dijits.' %}

We recommend any wrapped Dijits be created as individual modules in `/src/dijit` using the same path structure as in the source `dijit` package.

{% instruction 'Create `/src/dijit/Fieldset.ts` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dijit/Fieldset.ts' %}

{% instruction 'Create `/src/dijit/form/Button.ts` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dijit/form/Button.ts' %}

{% instruction 'Create `/src/dijit/form/TextBox.ts` with the following content:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/dijit/form/TextBox.ts' %}

{% task 'Importing Dijits.' %}

Now that you have wrapped Dijits for use, we need to import them into their containing Dojo 2 modules.

{% instruction 'Import Dijits into `/src/widgets/WorkerForm.ts`:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:5-7 %}

{% section %}

## Placing Dijits

{% aside 'Reminder' %}
We will be using the `w()` function from `@dojo/widget-core/d`.  Don't forget to `import` it...
{% endaside %}

{% task 'Adding Dijits to a widget\'s render function.' %}

Now that we have imported our wrapped Dijits into the module where they will be used, we need to add them to the render function.

{% instruction 'Add imported Dijits to the `WorkerForm` widget\'s render function:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:44-75 %}

{% aside 'Information' %}
The <em>properties</em> for a wrapped Dijit are equivalent to the <em>params</em> that can be passed when constructing a Dijit.  For more information on what parameters are possible on Dijits, you can refer to the [Dojo 1 API documentation](https://dojotoolkit.org/api/).
{% endaside %}

Once Dijits are wrapped, they behave similarly to Dojo 2 widgets.  Coupled with the `dojo-typings` TypeScript typings, you get code completion as well when specifying the _properties_ and TypeScript should help ensure the validity of property values.

One restriction to keep in mind is that wrapped Dijits may only have other wrapped Dijit's as their children. Dojo 2 widgets represent their [DOM virtually](../../docs/fundamentals/working_with_virtual_dom/), while Dojo 2 Dijits directly manage their own DOM.  Because of this, Dijits cannot properly manage virtual DOM based children.

{% task 'Setting a Dojo 1 theme.' %}

When we configured the _externals_ for our project, we included the main CSS for our theme, via the `"inject"` property.  The build system will automatically load any CSS or JavaScript files we inject when the page is loaded, meaning we don't have to add the stylesheet directly to our HTML.

Most Dijits will not render properly without a theme being applied to them.  There are many different ways to apply a Dojo 1 theme, but the most straightforward is to set the theme class name on the `<body>` of the application document.

{% instruction 'Add theme class name to `src/index.html`:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/index.html' lines:6-8 lang:html %}

You should now have an application that will provide you with a form that accepts a first name, last name, and e-mail address in order to add another _card_ to the application.

{% section %}

## Summary

In this tutorial, we learned how to setup the build system to include Dojo 1 as an external dependency.  We learned how to import Dojo 1 based Dijits into a Dojo 2 project and wrap them so they can be integrated into the Dojo 2 widgeting system.  We also learned how to apply a Dojo 1 theme so our Dijits have a proper look and feel.

If you would like, you can download the completed [demo application](../assets/1040_dojo1_dijits-finished.zip) from this tutorial.

This tutorial is far from exhaustive on the subject, but is intended to provide the basics of using Dojo 1 Dijits in a Dojo 2 application.  It is ideally better to use or create Dojo 2 widgets than to leverage Dojo 1 Dijits.  We think the main use case is when you want to incrementally migrate an existing application to Dojo 2, being able to _wrap_ custom Dijits can be really useful.

The way we integrated Dojo 1 in this example is not suitable for a production application.  Ideally you would create a built layer of your Dojo 1 dependencies.  You can _inject_ that built layer in the same way as earlier in the tutorial.  For more on creating builds of Dojo 1, you should refer to the Dojo 1 [Creating Builds](https://dojotoolkit.org/documentation/tutorials/1.10/build/index.html) tutorial.

{% section 'last' %}
