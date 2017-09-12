---
layout: false
title: Registry
overview: [ Add overview ]
---

{% section 'first' %}

# Working with the Registry

## Overview

## Prerequisites
You can [download](../assets/1020_registries-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## The Default Registry

{% task 'Create a default registry.' %}

Creates a registry instance that will be used by the application.

{% instruction 'Add the following to `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts'}

Talk about the default registry and that it is available for all widgets in the projector.

{% aside 'Registries everywhere!' %}
The registry doesn't deal exclusively with visual widgets.... state can be side loaded into your application using the registry... see tutorial blah.
{% endaside %}

Next, we'll add the widgets to the registry

{% section %}

## Add Widgets to the Registry

{% task 'Define widgets in the Registry.' %}

Import the widgets in main.ts, define them in the registry, remove imports from other widgets and use registry label. generic for the typings

{% section %}

## Lazy Loading Widgets

{% task 'Create a widget that will be lazy loaded when needed.' %}

create a new widget that will be lazy loaded, talk about providing a function

{% aside 'Use before define!' %}
The registry doesn't deal exclusive

{% endaside %}

{% section %}

## Summary

Put a summary here.

If you would like, you can download the completed [demo application](../assets/1020_registries.zip) from this tutorial.

{% section 'last' %}
