---
layout: tutorial
title: Creating Custom Elements
icon: terminal
overview: In this tutorial, you will learn how to generate Custom Elements from Dojo Widgets you have created
paginate: true
group: advanced
topic: customelements
---

{% section 'first' %}

# Creating Custom Elements

## Overview
Dojo provides a powerful framework for build modern, reactive web applications. However there are times where it might be useful to use a widget you've created in another application written in a different framework (or no framework at all). This is where it may make sense to use a feature of Dojo, which is the ability to compile widgets to [Custom Elements](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements). Custom Elements allow developers to leverage a browser standard for defining their own HTML Elements. Dojo takes advantage of this by offering it as a compile target via the Dojo CLI, specifically using the `@dojo/cli-build-widget` command. Many other frameworks now support using Custom Elements, including Dojo; you can see support for [various frameworks at www.custom-elements-everywhere.com](https://custom-elements-everywhere.com/).

## Prerequisites
You can open the [tutorial on codesandbox.io](https://codesandbox.io/s/github/dojo/dojo.io/tree/master/site/source/tutorials/1070_custom_elements/demo/initial/biz-e-corp) or [download](../assets/1070_custom_elements-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo local installation](../000_local_installation/) article for more information. You must also have the `@dojo/cli-build-widget` command installed (`npm install @dojo/cli-build-widget`).

You also need to be familiar with TypeScript as Dojo uses it extensively.

{% section %}

## Creating a Dojo Widget

Before we can generate a Custom Element, we must first create the Dojo Widget we wish to use. Here we will create a small widget with some properties and an event, and then show how we can use the `@customElement` decorator to allow the CLI to turn compile it to a Custom Element.

{% instruction 'Examine the initial WorkerProfile widget in `WorkerProfile.ts`:' %}

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/WorkerProfile.ts' %}

Here you can see a relatively simple widget that we will use to augment with the necessary code to allow the CLI to compile it to a Custom Element. In particular take a look at the properties that we are passing in, as we will need to reference these in when we go to state the properties and attributes of the Custom Element.

{% section %}

## Applying the Custom Element Decorator

To allow `@dojo/cli-build-widget` to build the widget into a Custom Element, we need to augment the widget with the `@customeElement` decorator. The decorator takes an object, with a series of properties, in this case `tag`, `events`, `attributes` and `properties`.

{% instruction 'Append the customElement decorator like so:' %}
{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerProfile.ts' lines:15-24 %}

Here we have to give a `tag` property to the object passed to the decotrator. The tag is the HTML Element name we will use for the Custom Element. In this case the tag would be used like `<worker-profile></worker-profile>`. We have also let the CLI know how to map our properties and attributes correctly, as well as our events, using the respective properties in the decorator argument. 

Here we ommit a couple of potential arguments from the above decorator demonstration for simplicity. However we will explain the other two for completeness. Firstly, there is `childType`. This property is relevant if you are interested in having children in the Custom Element. The property takes one of three arguments, namely `DOJO` (default), `NODE` or `TEXT`, each corresponding to what children the Custom Element accepts. `DOJO` will allow a Custom Element to render other Custom Elements created from Dojo Widgets. `NODE` means it will accept regular DOM Nodes, and `TEXT` means the element will accept plain text as a child. The next property is  `registry` which accepts a given `Registry` chosen by the developer. Explaining registries in detail is outside the scope of this tutorial, but you can see the <a href="https://dojo.io/tutorials/1020_registries/">Registry tutorial for more information</a>. 

{% section %}

## Creating a Custom Element with the Dojo CLI

Now to compile the Widget to a Custom Element. We do this via the command line, using the installed `@dojo/cli-build-widget` command.

{% instruction 'Run the build custom element command like so:' %}
`dojo build widget --elements=src/widgets/WorkerProfile`

Here we've called `dojo build widget` and passed it the path of the WorkerProfile TypeScript file to build it to a Custom Element. This Custom Element files will be outputted to a folder inside of `output/dist/` called `workerprofile`. Here you will find the JavaScript, CSS and the source maps for the generated element.

{% section %}

## Using the Created Custom Element

Now we have generated a the worker profile Custom Element, we can use it in other projects. As a basic example, lets show how that could be used in a blank web page. There are two ways to use a Custom Element, either declaratively (via HTML markup) or imperatively via JavaScript. Let's take a look at both approaches.

{% instruction 'The declarative approach can be done in the following manner:' %}

```html

	<!DOCTYPE html>
	<html>
	<head>
		<title>Custom Element Demo</title>
		<link href="../output/dist/worker-profile/worker-profile-1.0.0.css" rel="stylesheet">
	</head>
	<body>

		<worker-profile firstName="Joe" secondName="Bloggs"></worker-profile>

		<script src='../output/dist/worker-profile/worker-profile-1.0.0.js'></script>
	
	</body>
	</html>

```

This works well, we can see that we import the JavaScript and CSS files for the Custom Element and then use it like we would any other HTML Element. However using the declarative approach means we can't access Custom Element properties or events. If we go down the imperative route, we can set these accordingly.

{% instruction 'You can use the outputted worker profile element in the following manner` like so:' %}

```html

	<!DOCTYPE html>
	<html>
	<head>
		<title>Custom Element Demo</title>
		<link href="../output/dist/worker-profile/worker-profile-1.0.0.css" rel="stylesheet">
	</head>
	<body>

		<script src='../output/dist/worker-profile/worker-profile-1.0.0.js'></script>
		<script> 
			var worker = document.createElement('worker-profile');
			worker.setAttribute('firstName', "Joe");
			worker.setAttribute('lastName', "Bloggs");
			worker.setAttribute('email', "j.bloggs@bizecorp.com");
			worker.timePerTask = 100;
			worker.tasks = ['Being real busy'];
			worker.addEventListener('selected', (data) => { console.log(data.detail) })
			document.body.appendChild(worker);
		</script>

	</body>
	</html>

```

Once the JavaScript is imported, we use Custom Elements just like we would use other HTML Elements using standard DOM APIs like `document.createElement`, `setAttribute` and `addEventListener` (which is one of their strengths!). 

## Summary

In this tutorial we have shown how we can create a Dojo Widget, and then use the `@customElement` decorator to allow us to generate a Custom Element using `@dojo/cli-create-widget`. We have then demonstrated how you can use that Custom Element in another seperate page. Here, the ability to provide Custom Elements as an output from your widgets provides the benefit of having the ability to share code between different teams, projects and even companies that may be using other frameworks.

{% section 'last' %}
