---
layout: tutorial
title: Theming
overview: In this tutorial, you will learn how to use the Dojo 2 theming and styling system to add a theme to the sample application.
---

{% section 'first' %}

# Theming

## Overview
This tutorial will extend on previous tutorials where we created the basic biz-e-corp application. In this tutorial, we will adapt the app to allow it to be themed, then write a theme and apply it to our application. This will be done using the powerful theming system that is included in Dojo 2 widget system.

## Prerequisites
You can [download](../assets/007_themeing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Making our widgets themeable

{% task 'Make our widgets themeable' %}

In order to theme our widgets, we must ensure that they each extend `ThemeableMixin` and should change their top level class name to `root`. `ThemeableMixin` provides a `this.classes` function for looking up class names in the provided `theme` file and applies the processed class names. We change the top level class names to `root` in order to provide a predictable way to target the outer-node of a widget.

{% instruction 'Add the following to `Banner.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Banner.ts' lines:3-13 %}

{% aside 'Reminder' %}
If you cannot see the application, remember to run `dojo build -w` to build the application and start the development server.
{% endaside %}

This `Banner` widget will now have access to the classes in `banner.m.css` and can receive a `theme`. We use the `root` class to ensure that the theme we create can easily target the correct node.

{% instruction 'Create a new CSS file for `Banner` named `banner.m.css`.' %}

We will create an empty `root` class for now as our base theme does not require any styles to be added to the `Banner` widget.

{% include_codefile 'demo/finished/biz-e-corp/src/styles/banner.m.css' lang:css %}

{% instruction 'Now, let's look at changing `WorkerForm`' %}

{% aside 'Fixed Classes' %}
Fixed classes apply styles that _cannot_ be overridden by a theme, using a suffix is a convention that helps easily differentiate the intention of these classes.
{% endaside %}

`WorkerForm` already uses the `ThemeableMixin` and has a `workerForm` class on its root node. Let's change the workerForm class to a `root` class, and while we are there, we will create a `rootFixed` class too, and apply that as a `fixed` class to the root node. This passes a class name to the theming system that cannot be changed or overridden via a theme and ensures that structured or nested styles are not lost when a theme is used.

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:48-51 %}

{% include_codefile 'demo/finished/biz-e-corp/src/styles/workerForm.m.css' lines:1-17 lang:css %}

If you open the application in a browser its appearance and behavior should be unchanged.

{% instruction 'Now add a `root` and `rootFixed` to both `Worker.ts` and `WorkerContainer.ts`' %}

Next, we will start to create a theme.

{% section %}

## Creating a Theme

{% task 'Create a theme directory' %}

Let's create a `theme` directory under your project `src` to store our theme resources, and create a `dojo` theme with `theme.ts` under `src/themes/dojo/theme.ts`. This is the `theme` resource where we will import our themed CSS files and export the keyed theme for consumption by our widgets.

{% instruction 'Theme the worker widget' %}

In order to theme the `worker` widget, we need to create `worker.m.css` within our theme directory and use it within `theme.ts`. The naming here is important as the object key of the exported theme must match the naming of the widget's CSS file.

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/theme.ts' lines:3,9,11,16 %}

Let's start by creating a red `worker` and observe our theme being applied correctly.

```css
/* worker.m.css */
.root {
	background: red;
}
```

To apply a theme to a widget, simply pass the `theme` as a property to widgets have the `ThemeableMixin` applied. To ensure that the entire application applies the `theme` it needs to be passed to all the themeable widgets in our application. This can become problematic when an application using a mixture of themeable and non-themeable widgets or uses a widget from a third party, meaning that there is no guarantee that the `theme` will be propagated as required.

{% aside 'What is a registry?' %}
A registry provides a mechanism to inject external payloads into widgets throughout the application tree. To learn more, take a look at the [container tutorial](../1010_containers_and_injecting_state/) and [registry tutorial](../1020_registries/).
{% endaside %}

However an application can automatically inject a `theme` from the `registry` to every themeable widget in an application tree. First, create a `themeInjector` using a the `registerThemeInjector` by passing a `registry` instance and `theme`. This will returns a handle to the `themeInjector` that can be used to change the theme using `themeInjector.set()`, which will invalidate all themeable widgets in the application tree and re-render using the new theme!

{% instruction 'Update our `main.ts` file to import our theme and create a `themeInjector`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' %}

Open the application in your web browser and see that the `worker` backgrounds are now `red`.

{% instruction 'Use variables and complete the worker theme' %}

The [Dojo 2 build system](../006_deploying_to_production/) supports new CSS features such as `css-custom-properties` by using PostCSS to process our `.m.css` files. We can use these new CSS features to add variables to `worker.m.css` and complete its theme.
Let's create `themes/dojo/variables.css` (notice that this file does not have a `.m.css` extension as it is not a `css-module` file).

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/variables.css' lang:css %}

We can now use these variables in `worker.m.css` to create our fully themed `worker`.

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/worker.m.css' lang:css %}

{% section %}

## Theming Dojo widgets

Thus far in this tutorial, we have themed our custom `worker` widget, but how do we theme Dojo's existing widgets that are contained within our application? To demonstrate the styling of existing Dojo widgets, we will theme the `workerForm` widget as it contains both DOM nodes and Dojo widgets.

{% instruction 'Let\'s create `workerForm.m.css` and include it in theme.ts' %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/workerForm.m.css' lang:css %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/theme.ts' lines:3,5,9,11,13,16 %}

This should be familiar from theming the `worker` in the previous section. To theme the Dojo 2 `TextInput` within our `WorkerForm`, we need to create `dojoTextInput.m.css` and export it from `theme.ts` using a theme key prefixed with `dojo-`. The dojo prefix helps ensure that the Dojo widget theme keys do not clash with application widget theme keys.

{% instruction 'Create `dojoTextInput.m.css` and export it from `theme.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/dojoTextInput.m.css' lang:css %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/theme.ts' lines:3,5,6,9,11,13,14,16 %}

In this example we are introducing another powerful part of the Dojo 2 theming system, `composes`. Composes originates in the `css-module` specification, allowing you to apply styles from one class selector to another. Here we are specifying that `root` of a `TextInput` (the label text in this case), should appear the same as the `nameLabel` class in our `WidgetForm`. This approach can be very useful when creating multiple themes from a `baseTheme` and avoids repetitive redefinition of style rules.

In your web browser you will see the `TextInput` widgets at the top of the form have been styled.

{% instruction 'Create a theme resource for the Dojo Button' %}

Create a theme resource for the Dojo `Button` within `WidgetForm` following the same pattern within this tutorial, and then compare your result to the see the [completed `dojoButton.m.css`](demo/finished/biz-e-corp/src/themes/dojo/dojoButton.m.css).

{% section %}

## Summary

In this tutorial, we learned how to create a theme and apply a theme to both Dojo and custom widgets using the `themeInjector`. We leveraged functionality from the Dojo 2 theming system to apply variables and to use `composes` to share styles between components.

You can download the completed [demo application](../assets/007_theming-finished.zip) from this tutorial.

{% section 'last' %}
