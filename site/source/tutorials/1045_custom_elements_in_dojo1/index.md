---
layout: tutorial
title: Using Dojo 2 Widgets in a Dojo 1 Application
overview: Find out how to use Dojo 2 Widgets in a Dojo 1 application.
paginate: true
---

{% section 'first' %}

# Using Dojo 2 Widgets in a Dojo 1 Application

## Overview

This tutorial will use the Worker widget from the [Creating widgets](../003_creating_widgets/) tutorial.
In this tutorial, we will add Dojo 2 widgets to a Dojo 1 application.

Ideally, you would upgrade your Dojo 1 application to Dojo 2. This approach is provided as a migration strategy,
to leverage Dojo 2 Widgets within a Dojo 1 application, to help make it easier to migrate an application in phases over time.

## Prerequisites

You can [download](../assets/1045_custom_elements_in_dojo1-initial.zip) the demo project to get started.

If you want to author a Dojo 2 widget, you need to be familiar with TypeScript as Dojo 2 uses it extensively.
For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Adding dependencies

{% task 'Installing dependencies.' %}

The first step will be to install our dependencies using npm.

{% instruction 'Install the initial dependencies via npm:' %}

```shell
$ npm install
```

{% section %}

## Creating custom element

{% task 'Convert a Dojo 2 widget to a custom element.' %}

{% aside 'Information' %}
Learn more about custom elements at [webcomponents.org](https://www.webcomponents.org/introduction).
{% endaside %}

The first step towards using a Dojo 2 widget in a Dojo 1 application is to transform the Dojo 2 widget into a custom element. The Dojo 2 CLI build command will help us do the conversion.

`dojo2-widget/src/widgets/Worker.ts` contains the `Worker` widget created in the [Creating widgets](../003_creating_widgets/) tutorial. We need to describe a custom element based on the `Workder` widget in a way the Dojo 2 CLI build command can understand.

{% instruction 'Add the following to `dojo2-widget/src/widgets/createWorkerElement.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/dojo2-widget/src/widgets/createWorkerElement.ts' %}

A `CustomElementDescriptor` describes the custom elements tag name, the constructor used to create the widget, and the attributes supported by the custom element.

{% instruction 'Use the Dojo 2 build CLI to create the custom element.' %}

```shell
$ dojo build --element=src/widgets/createWorkerElement.ts
```

The build CLI creates the custom element in `dist/worker`.

{% section %}

## Loading custom elements

{% task 'Load custom element.' %}

Next, update your Dojo 1 application to load the custom element.

{% instruction 'Add the following to the `<head>` element of `index.html`.' %}

A polyfill simulates any missing Web Component capabilities.

```html
<script src="https://rawgit.com/webcomponents/custom-elements/master/src/native-shim.js"></script>
```

A `link` tag loads the custom element and makes it available to use in your application.

```html
<link rel="import" href="./dojo2-widget/dist/worker/worker.html">
```


{% section %}

## Using custom elements

{% task 'Use custom element.' %}

{% instruction 'Add the following to the `src/main.js`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.js' %}

The application code creates a `myapp-worker` element for each item in the `workerData` array.

You can also use the `myapp-worker` element in HTML like you would any other DOM element.

```html
<myapp-worker firstName="John" lastName="Smith"></myapp-worker>
```

{% section %}

## Summary

In this tutorial, we incorporated a Dojo 2 widget into a Dojo 1 application using a custom element.  By transforming the Dojo 2 widget into a Web Component, we made it available to any web application.

Note that each custom element created from a Dojo 2 widget will contain some of the same Dojo 2 modules. In cases when you are using multiple Dojo 2 widgets, it will be more efficient to create a Dojo 2 application.

If you would like, you can download the completed [demo application](../assets/1045_custom_elements_in_dojo1-finished.zip).

{% section 'last' %}
