---
layout: tutorial
title: Theming
overview: Use the Dojo 2 theming and styling system to add a theme to an application.
paginate: true
---

{% section 'first' %}

# Theming

## Overview
This tutorial will extend on previous tutorials where we created the basic biz-e-corp application. In this tutorial, we will adapt the app to allow it to be themed, then write a theme and apply it to our application. This will be done using the built-in theming system that is included in Dojo 2.

## Prerequisites
You can [download](../assets/007_theming-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Theming our widgets

{% task 'Theming our widgets' %}

In Dojo, we differentiate between two types of styles:

* Structural styles: these are the minimum necessary for a widget to function
* Visual styles: these are themed

The current CSS in the example app provides the structural styles, we will now review how to create and manage themes.

In order to theme our widgets, we must ensure that they each apply the `ThemedMixin` and change the class name of the widget's top-level node to `root`. The `ThemedMixin` provides a `this.theme` function that returns (or that will return) the correct class for the `theme` provided to the widget. The top-level class name is changed to `root` in order to provide a predictable way to target the outer-node of a widget, this is a pattern used throughout widgets provided by `@dojo/widgets`.

{% instruction 'Replace the contents of `Banner.ts` with the following' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Banner.ts' lines:1-13 %}

{% aside 'Reminder' %}
If you cannot see the application, remember to run `dojo build -m dev -w memory -s` to build the application and start the development server.
{% endaside %}

This `Banner` widget will now have access to the classes in `banner.m.css` and can receive a `theme`. We use the `root` class to ensure that the theme we create can easily target the correct node.

Notice that this file and other `css` files now have a `.m.css` file extension. This is to indicate to the [Dojo 2 build system](../006_deploying_to_production/) that this file is a `css-module` and should be processed as such.

{% aside 'CSS Modules' %}
[CSS Modules](https://github.com/css-modules/css-modules) is a technique to use scoped CSS classnames by default.
{% endaside %}

{% instruction 'Create a new style sheet for the `Banner` widget named `banner.m.css`.' %}

We will create an empty `root` class for now as our base theme does not require any styles to be added to the `Banner` widget.

{% include_codefile 'demo/finished/biz-e-corp/src/styles/banner.m.css' lang:css %}

{% instruction 'Now, let\'s look at changing the `WorkerForm` widget' %}

{% aside 'Fixed Classes' %}
Fixed classes apply styles that cannot be overridden by a theme, using a suffix is a convention that helps easily differentiate the intention of these classes.
{% endaside %}

`WorkerForm` already uses the `ThemedMixin` and has a `workerForm` class on its root node. Let's change the workerForm class to a `root` class, and while we are there, we will create a `rootFixed` class too, and apply it to the root node. Classes that are not passed to `theme` cannot be changed or overridden via a theme, ensuring that structured or nested styles are not lost when a theme is used.

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:47-50 %}

Replace all of the selectors containing `.workerForm` with the following rules in `workerForm.m.css`.

{% include_codefile 'demo/finished/biz-e-corp/src/styles/workerForm.m.css' lines:1-17 lang:css %}

If you open the application in a browser its appearance and behavior should be unchanged.

{% instruction 'Now update `worker.m.css` and `workerContainer.m.css` to use `.root` and `.rootFixed` and then update the associated widgets to use the new selectors.' %}

{% instruction 'When you are finished, click on toggle solution to see one possible result.' %}

{% solution showsolution1 %}
```css
/* workerContainer.m.css */
.rootFixed {
	display: flex;
	flex-flow: row wrap;
	justify-content: center;
	align-items: stretch;
	margin: 0 auto;
	width: 100%;
}

.root {

}

/* worker.m.css */

/* all rules were originally in the .worker selector */
.root {
	margin: 0 10px 40px;
	max-width: 350px;
	min-width: 250px;
	flex: 1 1 calc(33% - 20px);
	position: relative;
}

.rootFixed {
	/* flip transform styles */
	perspective: 1000px;
	transform-style: preserve-3d;
}
```
```typescript
// WorkerContainer.ts
// ...
render() {
    // ...
    return v('div', {
			classes: [ this.theme(css.root), css.rootFixed ]
    }, workers);
	// ...
}

// Worker.ts
// ...
render() {
    // ...
    return v('div', {
        classes: [
			...this.theme([ css.root, this._isFlipped ? css.reverse : null ]),
			css.rootFixed
		]
    }, [
    // ...
}
```

{% endsolution %}

Next, we will start to create a theme.

{% section %}

## Creating a Theme

{% task 'Create a theme directory' %}

Dojo 2 provides a CLI command for creating a skeleton theme from existing Dojo 2 widgets. To do this the command prompts the user to enter the name of the package that contains Dojo 2 widgets and allows you to select specific widgets to include in the output.

{% instruction 'At the command line run `dojo create theme --name dojo`' %}

When prompted for the package to theme enter `@dojo/widgets` and then type `N` to indicate their are no more packages. You should now be presented with a list of widgets from @dojo/widgets that can be scaffolded. For this demo we need to select `button` and `text-input` using the arrow keys and space to select each one, press enter to complete the process.

This should have created a `themes` directory in the project's `src` directory, this will be where the custom theme is created.

Dojo 2 uses the concept of a `key` to be able to look up and load classnames for a theme, it is a composite of the package name and the widget name joined by `/`. These keys are used as the keys to object that is exported from the main `theme.ts`.

{% instruction 'Theme the Worker widget' %}

In order to theme the `Worker` widget, we need to create `worker.m.css` within our `themes/dojo` directory and use it within `theme.ts`. As mentioned above, the naming of the key of the exported theme must match the name from the project's `package.json` and the name of the widget's style sheet joined by a forward slash (`/`).

Let's start by creating a red `Worker` and observe our theme being applied correctly.

```css
/* worker.m.css */
.root {
	background: red;
}
```

So for `worker.m.css`, you need to add the import for the `worker.m.css` and the theme itself to the exported object using the key `biz-e-corp/worker`.

``` typescript
import * as textInput from './@dojo/widgets/text-input/text-input.m.css';
import * as button from './@dojo/widgets/button/button.m.css';
import * as worker from './worker.m.css';

export default {
	'@dojo/widgets/button': button,
	'@dojo/widgets/text-input': textInput,
	'biz-e-corp/worker': worker
};
```

To apply a theme to a widget, simply pass the `theme` as a property to widgets to have the `ThemedMixin` applied. To ensure that the entire application applies the `theme` it needs to be passed to all the themed widgets in our application. This can become problematic when an application uses a mixture of themed and non-themed widgets, or uses a widget from a third party, meaning that there is no guarantee that the `theme` will be propagated as required.

{% aside 'What is a registry?' %}
A registry provides a mechanism to inject external payloads into widgets throughout the application tree. To learn more, take a look at the [container tutorial](../1010_containers_and_injecting_state/) and [registry tutorial](../1020_registries/).
{% endaside %}

However an application can automatically inject a `theme` from the `registry` to every themed widget in an application tree. First, create a `themeInjector` using the `registerThemeInjector` function by passing a `registry` instance and `theme`. This will return a handle to the `themeInjector` that can be used to change the theme using `themeInjector.set()`, which will invalidate all themed widgets in the application tree and re-render using the new theme!

{% instruction 'Update our `main.ts` file to import our theme and create a `themeInjector`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' %}

Open the application in your web browser and see that the `Worker` backgrounds are now `red`.

{% instruction 'Use variables and complete the Worker theme' %}

The [Dojo 2 build system](../006_deploying_to_production/) supports new CSS features such as `css-custom-properties` by using PostCSS to process our `.m.css` files. We can use these new CSS features to add variables to `worker.m.css` and complete its theme.
Let's create `themes/dojo/variables.css` (notice that this file does not have a `.m.css` extension as it is not a `css-module` file).

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/variables.css' lang:css %}

In the above code you can see that we have created a number of CSS Custom Properties to be used within our theme and wrapped them in a `:root` selector which makes them available on the global scope within our `css-modules`.
To use them, we can `@import` the `variables.css` file and use the `var` keyword to assign a `css-custom-property` to a css rule.

Now we will use these variables in our themes `worker.m.css` to create our fully themed `Worker`.

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/worker.m.css' lang:css %}

{% section %}

## Theming Dojo widgets

Thus far in this tutorial, we have themed our custom `Worker` widget, but we have not targeted Dojo widgets that are contained within our application. To demonstrate the styling of Dojo widgets, we will theme the `workerForm` widget as it contains both DOM nodes and Dojo widgets.

{% instruction 'Let\'s create `workerForm.m.css`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/workerForm.m.css' lang:css %}

{% instruction 'And include it in `theme.ts`' %}

``` typescript
import * as worker from './worker.m.css';
import * as workerForm from './workerForm.m.css';
export default {
	'biz-e-corp/worker': worker,
	'biz-e-corp/workerForm': workerForm,
};
```

This should be familiar from theming the `Worker` in the previous section. To theme the Dojo 2 `TextInput` within our `WorkerForm`, we need to add to the skeleton `text-input.m.css` theme created by `@dojo/cli-create-theme`, this is already exported from `theme.ts`.

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/@dojo/widgets/text-input/text-input.m.css' lang:css %}

Notice the styling rule for the `.root` selector? Here we are introducing another powerful part of the Dojo 2 theming system, `composes`. Composes originates in the [`css-module` specification](https://github.com/css-modules/css-modules#composition), allowing you to apply styles from one class selector to another. Here we are specifying that the `root` of a `TextInput` (the label text in this case), should appear the same as the `nameLabel` class in our `WidgetForm`. This approach can be very useful when creating multiple themes from a `baseTheme` and avoids repetitive redefinition of style rules.

In your web browser you will see the `TextInput` widgets at the top of the form have been styled.

{% instruction 'Add the following theme styles to the `button.m.css` theme resource' %}

``` css
@import './../../../variables';

.root {
	height: 38px;
	border: 1px solid var(--input-border);
	background: var(--card);
	color: var(--accent);
	font-size: 16px;
	font-weight: bold;
	padding: 8px;
	min-width: 150px;
	vertical-align: bottom;
}
```

{% section %}

## Summary

In this tutorial, we learned:

* How to create a theme
* How to apply a theme to both Dojo and custom widgets using the `themeInjector`.
* How to leverage functionality from the Dojo 2 theming system to apply variables
* How to use `composes` to share styles between components

You can download the completed [demo application](../assets/007_theming-finished.zip) from this tutorial.

{% section 'last' %}
