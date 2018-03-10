---
layout: tutorial
title: Routing
overview: Use Dojo 2's declarative routing within your application.
paginate: true
---

{% section 'first' %}

# Application routing

## Overview

`@dojo/routing` is a powerful set of tools to support declarative routing using a higher order component, an `Outlet` and a component that creates links with a `href` generated from an `outlet` name.

In this tutorial, we will start with a basic application with no routing. We will use Dojo 2's declarative routing to configure some routes, create `outlets` from our existing widgets and use the `Link` component to create links for the application outlets.

## Prerequisites
You can [download](../assets/1030_routing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Configuring the router

{% task 'Create the routing configuration' %}

All application routes needs to be to configured when creating the router instance, otherwise entering a route will not trigger a transition within the application. The `RouteConfig` object is an object consisting of various properties:

* `path` - the URL path to match against
* `outlet` - a unique identifier associated with a route
* `defaultParams` - default parameters are used as a fallback when parameters do not exist in the current route
* `defaultRoute` - a default route to be used if there is no other matching route
* `children` - nested route configurations which can represent a nested path within a parent route

Application routing paths are assembled into a hierarchy based on the routing configuration. The `children` property of a parent route accepts an array of more route configurations.

{% instruction 'Include the required imports in the file `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:2-3 %}

{% instruction 'Define the routing configuration.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:9-29 %}

Explanations for the route configuration in the above code block are explained earlier in this step.

{% instruction 'Now, register the router in a `registry`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:31-32 %}

{% aside 'History Managers' %}
The default history manager uses hash-based (fragment style) URLs. To use one of the other provided history managers pass it as the `HistoryManager` in the third argument of `registerRouterInjector`.
{% endaside %}

The `registerRouterInjector` helper utility used in the code above is provided by `@dojo/routing`, and can be used to create a routing instance. The utility accepts:

* The application's routing configuration
* A `registry` to define a `router` injector against
* An object which specifies the [history manager](https://github.com/dojo/routing#history-management) to be used

The utility returns the `router` instance if required.

{% instruction 'Initialize the routing' %}

To initialize the routing, set the registry as a property on the projector.

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:36 %}

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

The first argument for the `Outlet` function determines the widget to display when the configured route is selected. Consider an `outlet` configured for a `path` of `about`, its wrapped widget will render for a selected route `about` (described as an `index` match). The widget will also display for any route that the outlet's `path` partially matches, for example, `about/company` or `about/company/team`.

Normally using a component as the first argument of `Outlet` is perfectly acceptable, however there are scenarios where it is necessary to explicitly define a widget for an `index` match. To support this more advanced configuration, the first argument also accepts an object that can be used to specify these components explicitly.

```ts
const ExampleOutlet = Outlet({
	index: MyIndexComponent,
	component: MyComponent,
	error: MyErrorComponent
}, 'outlet-name');
```

We use the advanced configuration for both the `BannerOutlet.ts` and `WorkerContainerOutlet.ts`, as we do not want the widgets to render for routes unless they are an exact match for the selected route.

{% instruction 'Add the following code to `WorkerContainerOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/WorkerContainerOutlet.ts' %}

{% instruction 'Add the following code to `BannerOutlet.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/BannerOutlet.ts' %}

Now, we can the swap out the widgets for the newly created `outlets`. Notice we don’t need to change any of the wrapped widgets!

{% instruction 'First, swap the widget imports for the outlet imports in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:8-10 %}

{% instruction 'Then, swap the widget usages for their outlets.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-55,59-61 %}

Running the application now should display the `Banner.ts` by default, but also enable routing to the other widgets using the `/directory` and `/new-worker` routes.

Next, we will add a side menu with links for the created outlets.

{% section %}

## Adding Links

{% task 'Add a sidebar menu to the application.' %}

In this section we will be using the `Link` component, provided by `@dojo/routing`, to create link elements with an `href` attribute for an outlet name. A `label` for the `Link` can be passed as children and parameter values for the outlet can be passed to a `Link` component using the `params` property.

```ts
w(Link, { to: 'outlet-name', params: { paramName: 'value' } });
```

{% instruction 'Add the `Link` import in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:4 %}

{% instruction 'Replace the `render` function in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:37-55,59-64 %}

The updated block of code continues to render the banner, worker form and worker container widgets, and additionally renders three `Link` widgets:

1. A link to the home
2. A link to the worker directory
3. A link to the new worker form

Now, the links in the side menu can be used to navigate around the application!

{% section %}

## Dynamic `Outlet`

{% task 'Add filters to the `WorkerContainer.ts` widget and create an outlet.' %}

Finally, we are going to enhance the `WorkerContainer.ts` with a filter on the workers' last name. To do this we need to use the `filter` outlet configured in the first section. The key difference for the `filter` outlet is that the path is using a placeholder that indicates a path parameter, `{filter}`.

{% aside 'URL matching in routes' %}
The [Dojo 2 Routing documentation](https://github.com/dojo/routing/#route-registration) on GitHub further explains how outlets map to URLs.
{% endaside %}

This means a route with any value will match the `filter` as long as the previous path segments match, so for the `filter` outlet a route of `directory/any-value-here` would be considered a match.

{% instruction 'Add the new property to the `WidgetContainerProperties` interface in `WorkerContainer.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:9-12 %}

{% instruction 'Include the `Link` import' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' line:7 %}

{% instruction 'Add a private function to generate the filter links' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:19-31 %}

{% instruction 'Re-work the render function to filter using the new property' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:33-54 %}

We have added a new property named `filter` to `WorkerContainerProperties` in `WorkerContainer.ts`, which will be used to filter the workers based on their last name. When used by a normal widget this would be determined by its parent and passed in like any normal property. However for this application we need the route param value to be passed as the filter property. To achieve this, we can add a mapping function callback which receives an object argument consisting of four properties:

* `params`
* `location`
* `router`,
* `matchType`

Each of these four properties are documented in the [Dojo 2 Routing documentation](https://github.com/dojo/routing/#map-params) on GitHub.

The mapping function callback can return an object which is then injected into the wrapped widget properties.

{% instruction 'Add the following code to `FilteredWorkerContainerOutlet.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/outlets/FilteredWorkerContainerOutlet.ts' %}

This code defines an `Outlet`. The third argument passed into the `Outlet` is a callback function which receives an object as specified earlier. A new object is constructed and returned from this function which includes a `filter` property which in turn comes from the `params` property.

{% instruction 'Add a `FilteredWorkerContainerOutlet.ts` import in `App.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:11 %}

{% instruction 'Include the `outlet` in the render function' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-61 %}

Previously, the raw Dojo 2 widgets were rendered. Now, Outlets (which are also widgets) are rendered instead. These outlets 'wrap' the original widgets and pass-through parameters to the wrapped widget, as you define them in the Outlet callback function.

{% section %}

## Summary

Dojo 2 routing is a declarative, non-intrusive, mechanism to add complicated route logic to a web application. Importantly, by using a higher order component pattern, the widgets for the routes should not need to be updated and can remain solely responsible for their existing view logic.

If you would like, you can download the completed [demo application](../assets/1030_routing-finished.zip) from this tutorial.

{% section 'last' %}
