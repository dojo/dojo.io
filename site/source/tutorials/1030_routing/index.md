---
layout: tutorial
title: Routing
overview: In this tutorial, you will learn how to use Dojo 2's declartive routing within your application.
---

{% section 'first' %}

# Appliction routing

## Overview
Add routing overview here.

## Prerequisites
You can [download](../assets/1030_routing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Configuring the router

{% task 'Create the routing configuration' %}

Talk about how to and creating the routing configuration.

{% instruction 'Add the routing configuration to `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:9-31 %}

{% instruction 'Now, register the router in a `registry`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:33-34 %}

{% instruction 'Lastly, we need to start the router.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:41 %}

Next, we will create `outlets` to control when our widgets are displayed.

{% section %}

## Routing outlets

{% task 'Create outlets for the routed widgets.' %}

{% aside 'Reminder' %}
The path that is associated to an outlet name is defined by the routing configuration from the first section.
{% endaside %}

An `Outlet` is a higher order component that wraps a widget, and controls whether the widget is rendered based on if the navigated route associated to outlets name. To keep out application organized, outlets are usual stored in a separate directory called `outlets`.

{% instruction 'Add the following code to `WorkerFormOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/WorkerFormOutlet.ts' %}

The fist argument for the `Outlet` function determines the widget to display when the configured route is selected. Consider an `outlet` configured for a `path` of `foo`, its wrapped widget will render for a selected route `foo` (described as an `index` match). It will also display for any route that the outlets `path` partially matches too, for example, `foo/bar` or `foo/bar/baz`.

Normally this is perfectly acceptable, however there are scenarios, where it is necessary to explicitly define a widget for an `index` match. To support this more advanced configuration, first argument also accepts an object that can be used to specify these components explicitly.

```ts
const ExampleOutlet = Outlet({
	index: MyIndexComponent,
	component: MyComponent,
	error: MyErrorComponent
}, 'outlet-name');
```

We use this option for both the `BannerOutlet.ts` and `WorkerContainerOutlet.ts`, as we do not want the widgets to render for routes unless the are an exact match for the selected route.

{% instruction 'Add the following code to `WorkerContainerOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/WorkerContainerOutlet.ts' %}

{% instruction 'Add the follow code to `BannerOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/BannerOutlet.ts' %}

Now, we can the swap out the widgets for the newly created `outlets`. Notice we haven't needed to changed any of wrapped widgets!

{% instruction 'First, swap the widget imports for the outlet imports in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:8-10 %}

{% instruction 'Then, swap the widget usages for their outlets.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-55,59-61 %}

Running the application now, should display the `Banner.ts` by default but also enable routing to the other widgets using the `/#directory` and `/#new-widget` routes.

Next, we will add a side menu with links for the created outlets.

{% section %}

## Adding Links

{% task 'Add a sidebar menu to the application.' %}

In this section we will be using the `Link` component that can create a link for an outlet name.

{% instruction 'Replace the render function in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:37-55,59-64 %}

Now, the links in the side menu can be used to navigate around the application!

{% section %}

## Dynamic Outlet

{% task 'Add route that filters the workers by last name.' %}

Add the filtered outlet, talk about the mapping function that allows route params/querys/location to be mapped to a visual components properties.

{% section %}

## Summary


If you would like, you can download the completed [demo application](../assets/1030_routing.zip) from this tutorial.

{% section 'last' %}
