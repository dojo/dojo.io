---
layout: tutorial
icon: sitemap
title: Routing
overview: Use Dojo's declarative routing within your application.
paginate: true
topic: routing
---

{% section 'first' %}

# Application routing

## Overview

`@dojo/framework/routing` is a powerful set of tools to support declarative routing using a specialized widget that accepts a render property called an `Outlet` and a widget that creates links with a `href` generated from an `outlet` id.

In this tutorial, we will start with a basic application with no routing. We will use Dojo's declarative routing to configure some routes, use the `Outlet` widget to define the view for each route and use the `Link` widget to create links for the application's outlets.

## Prerequisites
You can open the [tutorial on codesandbox.io](https://codesandbox.io/s/github/dojo/dojo.io/tree/master/site/source/tutorials/1030_routing/demo/initial/biz-e-corp) or [download](../assets/1030_routing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo uses it extensively.

{% section %}

## Configuring the router

{% task 'Create the routing configuration' %}

All application routes needs to be to configured when creating the router instance, otherwise entering a route will not trigger a transition within the application. The `RouteConfig` object is an object consisting of various properties:

* `path` - the URL path to match against
* `outlet` - a unique identifier associated with a route
* `defaultParams` - default parameters are used as a fallback when parameters do not exist in the current route
* `defaultRoute` - a default route to be used if there is no other matching route
* `children` - nested route configurations which can represent a nested path within a parent route

The route configuration should be static, i.e. not dynamically determined at runtime and defined as the default export of a module called `routes.ts` in the project's `src` directory.

Application routing paths are assembled into a hierarchy based on the routing configuration. The `children` property of a parent route accepts an array of more route configurations.

{% instruction 'Include the required imports in the file `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:4-6 %}

{% instruction 'Define the routing configuration in `routes.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/routes.ts' %}

Explanations for the route configuration in the above code block are explained earlier in this step.

{% instruction 'Now, register the router in a `registry`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:8-9 %}

{% aside 'History Managers' %}
The default history manager uses hash-based (fragment style) URLs. To use one of the other provided history managers pass it as the `HistoryManager` in the third argument of `registerRouterInjector`.
{% endaside %}

The `registerRouterInjector` helper utility used in the code above is provided by `@dojo/framework/routing`, and can be used to create a routing instance. The utility accepts:

* The application's routing configuration
* A `registry` to define a `router` injector against
* An object which specifies the [history manager](https://github.com/dojo/routing#history-management) to be used

The utility returns the `router` instance if required.

{% instruction 'Initialize the routing' %}

To initialize the routing, pass the registry to the renderer's `mount` function.

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:12 %}

Next, we will create `outlets` to control when our widgets are displayed.

{% section %}

## Routing Outlets

{% task 'Wrap the application widgets with the `Outlet` widget.' %}

{% aside 'Reminder' %}
The path that is associated to an outlet name is defined by the routing configuration from the first section of this tutorial.
{% endaside %}

The `Outlet` widget accepts two properties, `id` and `renderer`. The `id` is the `outlet` from the routing configuration and the `renderer` is a function that returns widgets and nodes to display using `v()` and `w()`.

The `renderer` function receives a `MatchDetails` object that provides information about the route match.

 * `router`: The router instance, which can be used to generate links.
 * `queryParams`: An object that contains any query params for the route.
 * `params`: An object that contains any path params for the route.
 * `type`: The type of match:
   * `index`: An exact match
   * `partial`: The route is a match but not exact
   * `error`: The route is an error match
 * `isError`: Helper function that returns true when the match type is error
 * `isExact`: Helper function that returns true when the match type is exact

Consider an `outlet` configured for a `path` of `about`, the widget that it returns from the `renderer` will render for a selected route `about` (described as an `index` match). The widget will also display for any route that the outlet's `path` partially matches, for example, `about/company` or `about/company/team`.

{% aside 'Warning: Make sure functions used in render property are bound!' %}
Functions passed to `v()` and `w()` in a render property need to already have been bound to the correct context. This is because the render property is actually executed and returned from the `Outlet` and therefore will be bound to the context of the `Outlet` and not your widget.
{% endaside %}

Simply returning the widget or nodes that need to be displayed when an outlet has matched is usually all that is required, however there are scenarios where it is necessary to explicitly define a widget for an `index` or `error` match. This is where `matchDetails` is beneficial. By using the information from `matchDetails`, we can create simple logic to determine which widget to render for each scenario.

```ts
w(Outlet, {
	id: 'outlet-name',
	renderer: (matchDetails: MatchDetails) => {
		if (matchDetails.isExact()) {
			return w(MyIndexComponent, {});
		} else if (matchDetails.isError()) {
			return w(MyErrorComponent, {});
		}
		return w(MyComponent, {});
	}
});
```
{% instruction 'Import the `Outlet` widget and `MatchDetails` interface.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:5-6 %}

{% instruction 'Replace `Banner` with an `Outlet` that returns `Banner`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:51-53 %}

{% instruction 'Replace `WorkerForm` with an `Outlet` that returns `WorkerForm`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:54-60 %}

The `filter` outlet use the match details information to determine if the `filter` param should be passed to the `WorkerContainer` widget.

{% instruction 'Replace `WorkerContainer` with an `Outlet` that returns `WorkerContainer`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:61-70 %}

Running the application now should display the `Banner.ts` by default, but also enable routing to the other widgets using the `/directory` and `/new-worker` routes.

Next, we will add a side menu with links for the created outlets.

{% section %}

## Adding Links

{% task 'Add a sidebar menu to the application.' %}

In this section we will be using the `Link` widget, provided by `@dojo/framework/routing`, to create link elements with an `href` attribute for an outlet name. A `label` for the `Link` can be passed as children and parameter values for the outlet can be passed to a `Link` widget using the `params` property.

```ts
w(Link, { to: 'outlet-name', params: { paramName: 'value' } });
```

{% instruction 'Add the `Link` import in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:4 %}

{% instruction 'Replace the `render` function in `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:38-55,59-72 %}

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
The [Dojo Routing documentation](https://github.com/dojo/routing/#route-registration) on GitHub further explains how outlets map to URLs.
{% endaside %}

This means a route with any value will match the `filter` as long as the previous path segments match, so for the `filter` outlet a route of `directory/any-value-here` would be considered a match.

{% instruction 'Add the new property to the `WidgetContainerProperties` interface in `WorkerContainer.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:9-12 %}

{% instruction 'Include the `Link` import' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' line:7 %}

{% instruction 'Add a private function to generate the filter links' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:17-29 %}

{% instruction 'Re-work the render function to filter using the new property' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerContainer.ts' lines:31-52 %}

We have added a new property named `filter` to `WorkerContainerProperties` in `WorkerContainer.ts`, which will be used to filter the workers based on their last name. When used by a normal widget this would be determined by its parent and passed in like any normal property. However for this application we need the route param value to be passed as the filter property. To achieve this, we can add a mapping function callback which receives an object argument consisting of four properties:

Previously, the raw Dojo widgets were rendered. Now, Outlets (which are also widgets) are rendered instead. These outlets 'wrap' the original widgets and pass-through parameters to the wrapped widget, as you define them in the Outlet callback function.

{% section %}

## Summary

Dojo routing is a declarative, non-intrusive, mechanism to add complicated route logic to a web application. Importantly, by using a specialized widget with a render property, the widgets for the routes should not need to be updated and can remain solely responsible for their existing view logic.

If you would like, you can open the completed demo application on [codesandbox.io](https://codesandbox.io/s/github/dojo/dojo.io/tree/master/site/source/tutorials/1030_routing/demo/finished/biz-e-corp) or alternatively [download](../assets/1030_routing-finished.zip) the project.

{% section 'last' %}
