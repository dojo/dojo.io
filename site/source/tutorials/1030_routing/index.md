---
layout: tutorial
title: Routing
overview: In this tutorial, you will learn how to use Dojo 2's declarative routing within your application.
---

{% section 'first' %}

# Application routing

## Overview

`@dojo/routing` is a powerful set of tools to support declarative routing using a high order component, an `Outlet` and a component that creates links with a `href` generated from an `outlet` name.

In this tutorial, we will start with a basic application with no routing. We will use Dojo 2's declarative routing to configure some routes, create `outlets` from our existing widgets and use the `Link` component to create links for the application outlets.

## Prerequisites
You can [download](../assets/1030_routing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Configuring the router

{% task 'Create the routing configuration' %}

All application routes needs to be to configured when creating the router instance, otherwise entering a route will not trigger a transition within the application. The `RouteConfig` a basic object consisting off `path`, `outlet`, `defaultParams`, `defaultRoute` and `children`.

The routing hierarchy is generated using by adding an array, `RouteConfigs`, to the children property, which get recursively processed, building up the application routing paths.

{% instruction 'Include the required imports `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:2,3 %}

{% instruction 'Define the routing configuration.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:9-31 %}

{% instruction 'Now, register the router in a `registry`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:33-34 %}

A helper utility above, is provided by `@dojo/routing`, that can be used to create a routing instance. The utility accepts the applications routing configuration, and a `registry` to define a `router` injector against. The utility returns the `router` instance.

{% instruction 'Finally, set the registry on the projector and call start on the `router` instance.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:38-41 %}

{% aside 'Important!' %}
When using a `defaultRoute` in the routing configuration, the `router` will need to be started *after* the projector is appended.
{% endaside %}

Finally, to initialize the routing, the `start` needs to be called on the `router` instance.

Next, we will create `outlets` to control when our widgets are displayed.

{% section %}

## Routing outlets

{% task 'Create outlets for the routed widgets.' %}

{% aside 'Reminder' %}
The path that is associated to an outlet name is defined by the routing configuration from the first section of this tutorial.
{% endaside %}

An `Outlet` is a higher order component that wraps a widget, and controls whether the widget is rendered based on the navigated route associated to the outlets name. To keep our application organized, outlets are usually stored in a separate directory named `outlets`.

{% instruction 'Add the following code to `WorkerFormOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/WorkerFormOutlet.ts' %}

The first argument for the `Outlet` function determines the widget to display when the configured route is selected. Consider an `outlet` configured for a `path` of `foo`, its wrapped widget will render for a selected route `foo` (described as an `index` match). The application will also display for any route that the outlet's `path` partially matches, for example, `foo/bar` or `foo/bar/baz`.

Normally using a component for as the first argument of `Outlet` is perfectly acceptable, however there are scenarios where it is necessary to explicitly define a widget for an `index` match. To support this more advanced configuration, the first argument also accepts an object that can be used to specify these components explicitly.

```ts
const ExampleOutlet = Outlet({
	index: MyIndexComponent,
	component: MyComponent,
	error: MyErrorComponent
}, 'outlet-name');
```

We use the advanced object for both the `BannerOutlet.ts` and `WorkerContainerOutlet.ts`, as we do not want the widgets to render for routes unless they are an exact match for the selected route.

{% instruction 'Add the following code to `WorkerContainerOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/WorkerContainerOutlet.ts' %}

{% instruction 'Add the follow code to `BannerOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/BannerOutlet.ts' %}

Now, we can the swap out the widgets for the newly created `outlets`. Notice we have not needed to changed any of wrapped widgets!

{% instruction 'First, swap the widget imports for the outlet imports in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:8-10 %}

{% instruction 'Then, swap the widget usages for their outlets.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-55,59-61 %}

Running the application now should display the `Banner.ts` by default, but also enable routing to the other widgets using the `/#directory` and `/#new-widget` routes.

Next, we will add a side menu with links for the created outlets.

{% section %}

## Adding Links

{% task 'Add a sidebar menu to the application.' %}

In this section we will be using the `Link` component, provided by `@dojo/routing`, to create link elements with an `href` for an outlet name. A `label` for the `Link` can be passed as children and `param` values for the outlet can be passed to a `Link` component using the `params` property.

```ts
w(Link, { to: 'outlet-name', params: { paramName: 'value' } });

```

{% instruction 'Add the `Link` import in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:4 %}

{% instruction 'Replace the render function in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:37-55,59-64 %}

Now, the links in the side menu can be used to navigate around the application!

{% section %}

## Dynamic `Outlet`

{% task 'Add filters to the `WorkerContainer.ts` widget and create an outlet.' %}

Finally, we are going to enhance the `WidgetContainer.ts` with a filter on the workers' last name. To do this we need to use the `filter` outlet configured in the first section. The key difference for the `filter` outlet is that the path is using a placeholder that indicates a path parameter, `{filter}`.

This means a route with any value will match the `filter` as long as the previous path segments match, so for the `filter` outlet a route of `directory/any-value-here` would be considered a match.

{% instruction 'Add the new property to the `WidgetContainerProperties` interface in `WorkerContainer.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:10-13 %}

{% instruction 'Include the `Link` import' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' line:8 %}

{% instruction 'Add a private function to generate the filter links' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:20-32 %}

{% instruction 'Re-work the render function to filter using the new property' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:34-55 %}

We have added a new property named `filter` to `WorkerContainerProperties` in `WorkerContainer.ts`, which will be used to filter the workers based on their last name. When by used a normal widget this would be determined by its parent and passed in like any normal property. However for this application we need the route param value to be passed as the filter property. To achieve this, we can add a mapping function that receives `MapParamOptions` (`param`, `location`, `router`, `matchType`) and returns an object injected into the wrapped widget properties!

{% instruction 'Add the following code to `FilteredWorkerContainerOutlet.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/FilteredWorkerContainerOutlet.ts' %}

{% instruction 'Add `FilteredWorkerContainerOutlet.ts` import in `App.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:10 %}

{% instruction 'Include the `outlet` in the render function' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-61 %}

{% section %}

## Summary

Dojo 2 routing is a declarative, non-intrusive, mechanism to add complicated route logic to a web application. Importantly, by using a high order component pattern, the widgets for the routes should not need to be updated and can remain solely responsible for their existing view logic.

If you would like, you can download the completed [demo application](../assets/1030_routing.zip) from this tutorial.

{% section 'last' %}
