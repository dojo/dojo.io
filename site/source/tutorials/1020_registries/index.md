---
layout: tutorial
title: Registry
overview: In this tutorial, you will learn how to use Dojo 2's registry to lazily load widgets when they are needed.
---

{% section 'first' %}

# Working with the Registry

## Overview

Flexibility to override the default type of a widget's children provides a powerful configuration option when it comes to using and customizing widgets with any web application. Additionally, as web applications grow, the physical size of the resources required to load the application becomes increasingly critical. Keeping the size of resources required to load a web application as small as possible ensures that the application can provide an optimal performance for all users. To help with these challenges, Dojo 2 provides a concept of a `registry` that can be used to achieve both of these goals in a simple and effective manner, without intruding on the existing development experience.

In this tutorial, we will start with an application that uses concrete widget classes and request all assets when the application first loads. First we will swap all the concrete widget references to load the widgets from a `registry`. Then we will create a new widget that will be lazily loaded when the worker card is clicked the first time.

## Prerequisites
You can [download](../assets/1020_registries-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## The default registry

{% task 'Create a default registry.' %}

The first step is to create a `registry` that will be made available to the application by passing the instance as the `registry` property on the `projector`.

{% instruction 'Add the `Registry` import to the `main.ts` module.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:3 %}

{% instruction 'Now, create a `Registry` instance.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:17 %}

{% instruction 'And finally set the `registry` on the `projector`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:30 %}

{% aside 'Registries Everywhere!' %}
A `registry` can also be used to define widgets with non-visual responsibilities, such as state injection and routing. To learn more, take a look at the [container tutorial](../1010_containers_and_injecting_state/) and [routing tutorial](../comingsoon.html) .
{% endaside %}

At the moment we haven't affected the application, however we now have a handle to a `registry` where we can start to define widgets. Once the widgets are defined in the `registry`, they will be available through the application and can be used by switching the concrete class in `w()` with the `registry` label.

{% instruction 'Add the widget imports to `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:6-10 %}

{% instruction 'Then define widgets in the `registry`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:18-23 %}

In the next section we will use the registry label in our render functions.

{% section %}

## Using registry items

Now that the `registry` has been made available to the application and the widgets have been defined, we can use the label instead of the widget classes across the application.

{% instruction 'Use registry labels in `App.ts`\'s render function.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:46-58 %}

{% instruction 'Use registry labels in `WorkerContainer.ts`\'s render function.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:21-24 %}

{% instruction 'Use registry labels in `WorkerForm.ts`\'s render function.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:43-86 %}

Notice that we are passing a generic type to the `w()` function call, this is because when using a `registry` label it is unable to infer the properties interface. As a result falls back to the default, `WidgetProperties` interface. Passing the generic tells `w()` the type of widget the label represents in the `registry` and will correctly enforce the widget's properties interface.

Next, we will create a widget that is lazily loaded when needed!

{% section %}

## Lazy loading widgets

First we need to extract the `_renderBack` function from `Worker.ts` into a new widget, `WorkerBack.ts`, and then add the new widget to the registry.

{% task 'Add the following code in `WorkerBack.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerBack.ts' %}

{% task 'Update the `_renderBack` function to use the `WorkerBack` registry items in `Worker.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:51-65 %}

{% aside 'Use Before You Define' %}
The `registry` is designed to mirror the behavior and API of custom elements wherever possible. One neat feature is that a registry item can be used before it is defined, and, once defined, an used before it is defined and, once defined, widgets that use the `registry` will automatically re-render!
{% endaside %}

Now we need to add the `registry` definition for `WorkerBack.ts` to lazily load when the worker is clicked. Instead of adding a concrete widget class, we add a function that, when called, requires and returns the concrete widget. This function will not be called until the first time the application tries to use the widget label as part of the usual `render` cycle. Initially, before the widget has loaded, nothing will be rendered. Once it has loaded, any widgets that use the lazy widget will automatically re-render.

{% task 'Import `load` from `@dojo/core/load` in `main.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:1 %}

{% task 'Define a `const` for `require` that is available at runtime' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:13 %}

{% task 'Now define a function that lazily loads `WorkerBack.ts` in the registry' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:24-26 %}

Now that the `WorkerBack` widget is defined to load lazily, running the application with the browser developer tools open should show that the `WorkerBack.js` file is only loaded when a worker card is clicked on for the first time:

{% aside 'Auto Bundling Support' %}
To fully support lazy loading, the Dojo CLI build command will automatically bundle any lazily defined widgets into their own separate file! To learn more, take a look at the [build command tutorial](../comingsoon.html).
{% endaside %}

![lazy loading gif](./images/lazy-load-widget.gif)

{% section %}

## Summary

Put a summary here.

If you would like, you can download the completed [demo application](../assets/1020_registries.zip) from this tutorial.

{% section 'last' %}
