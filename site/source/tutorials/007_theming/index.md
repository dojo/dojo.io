---
layout: tutorial
title: Theming
overview: In this tutorial, you will learn how to use the Dojo 2 theming and styling system to add a theme to the sample application.
---

{% section 'first' %}

# Theming

## Overview
This tutorial will extend on previous tutorials where we created the basic biz-e-corp application. In this tutorial, we will adapt the app to allow it to be themed, write a theme and apply it to our application. This will be done using the powerful theming system that is baked into Dojo 2.

## Prerequisites
You can [download](../assets/007_themeing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Making our widgets themeable

{% task 'Make our widgets themeable' %}

In order to theme our widgets, we must ensure that they each extent `ThemeableMixin` and should change their top level class name to `root`. `ThemeableMixin` provides us with a `this.classes` function that can lookup class names in the provided `theme` file and applies classnames appropaitely. We change the top level classnames to `root` in order to provice a predictable way to target the outernode of a iwgdte.

{% instruction 'Add the following to `Banner.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Banner.ts' lines:3-13 %}

{% aside 'Reminder' %}
If you cannot see the application, remember to run `dojo build -w` to build the application and start the development server.
{% endaside %}

This `Banner` widget will now have access to the class files in `banner.m.css` and can receive a `theme`. We use the `root` class here as detailed above to ensure that the theme we create can easily target the correct node.

{% instruction 'Create a new css file for `Banner` named `banner.m.css`.' %}

We will create an empty `root` class for now as our base theme does not require any styles to be added to the `banner`.

{% include_codefile 'demo/finished/biz-e-corp/src/styles/banner.m.css' lang:css %}

{% instruction 'Now, lets look at changing `WorkerForm`' %}

`WorkerForm` already uses the `ThemeableMixin` and has a `workerForm` class on it's root node. Lets go ahead and change that to a `root` class, but while we're there, we will create a `rootFixed` class too and apply that as a `fixed` class to the root node. This passes a classname to the theming system that cannot be changed or overridden via a theme and ensures that structured or nested styles are not lost when a theme is used.

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:48-51 %}

{% include_codefile 'demo/finished/biz-e-corp/src/styles/workerForm.m.css' lines:1-17 lang:css %}

If you open the application in a webpage it should still look and work the same as before.

{% instruction 'Why don\'t you go ahead and make the same changes to `Worker` and `WorkerContainer`' %}

Next, we'll start to create a theme.

{% section %}

## Creating a Theme

{% task 'Create a theme directory' %}

Lets go ahead and create a `theme` directory under your project `src`. This is where we will store our themes. For the purpose of this tutorial, we will create a `dojo` theme. Create a `theme.ts` under `src/themes/dojo/theme.ts`. This is the `theme` file into which we will import our themed css files and export the keyed theme for consumption by our widgets.

{% instruction 'Theme the worker widget' %}

In order to theme the `worker` widget, we will need to create a `worker.m.css` file within our theme directory and and use it within our `theme.ts` file. The naming here is important as the object key of the exported theme must match the naming of the widget's css file.

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/theme.ts' lines:3,9,11,16 %}

Lets start by creating a red `worker` so that we can see our theme has been applied correctly.

```css
/* worker.m.css */
.root {
	background: red;
}
```

In order to apply our theme, we will need to use a `themeInjector`. Alternatively we *could* set `theme` on the top level widget and pass it down via properties to every child widget but this approach is not very elegant. We can create a `themeInjector` using the `registerThemeInjector` function exported by `ThemeableMixin`. So let's go ahead and update our `main.ts` file to import our theme and create a `themeInjector`.

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' %}

If you open up your web browser now you should see that the `worker` backgrounds are now `red`.

{% instruction 'Use variables and complete the worker theme' %}

The Dojo 2 build system allows us new `css` features such as `css-custom-properties` by using `postCss` to process our `.m.css` files. We can use these to add variables to `worker.m.css` and to complete it's theme.
Let go ahead and create `themes/dojo/variables.css` (notice that this file does not have a `.m.css` extension as it is not a `css-module` file).

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/variables.css' lang:css %}

We can now use these variables in `worker.m.css` to create our fully themed `worker`.

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/worker.m.css' lang:css %}

{% section %}

## Theming Dojo widgets

So far in this tutorial we have themed our custom `worker` widget, but how do we target dojo widgets with our theme. To demonstrate this, we will theme the `workerForm` widget as it contains both domNodes and dojo widgets to be themed.

{% instruction 'Lets create `workerForm.m.css` and include it in our theme.ts' %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/workerForm.m.css' lang:css %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/theme.ts' lines:3,5,9,11,13,16 %}

This should be familiar to you by now as we covered theming `worker` in the last section. Now to theme the Dojo 2 `TextInput` that `WorkerForm` uses, we will need to create a `dojoTextInput.m.css` file and export it from `theme.ts` using a special theme key which is prefixed with `dojo-`. This prefix helps to ensure that our own widget theme files do not clash with dojo specific widgets and makes it easy to recognise when we are targeting one of the other.

{% instruction 'Create `dojoTextInput.m.css` and emport it from `theme.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/dojoTextInput.m.css' lang:css %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/theme.ts' lines:3,5,6,9,11,13,14,16 %}

In this example we are introducing another powerful part of the Dojo 2 theming system, `composes`. Composes comes from the `css-module` specification and allows you to take styles from one class selector and apply them to another. In this case we are saying that `root` of a `TextInput` (the label text in this case), should look the same as the `nameLabel` class in our `WidgetForm`. This approach can be very useful when creating multiple themes from a baseTheme and avoids re-writing / re-specifying styles in multiple places.

If you open up your web browser now you should see that the Text Inputs at the top of the form have been styled.

{% instruction 'Why dont you go ahead and create a theme file for dojo button' %}

Have a go at creating a theme file for the Dojo button thats used on `WidgetForm`. If you need help you can see the finished `dojoButton.m.css` file [here](demo/finished/biz-e-corp/src/themes/dojo/dojoButton.m.css).

{% section %}

## Summary

In this tutorial, we learned how to create a theme and apply a theme to both Dojo and custom widgets using the themeInjector. We learnt how to use some of the functionality of the Dojo 2 theming system to apply variables and to use `composes` to share styles between components.

If you would like to you can continue to work with the theme we have started here to tweak and change things as you please.
You can download the completed [demo application](../assets/007_theming-finished.zip) from this tutorial.

{% section 'last' %}
