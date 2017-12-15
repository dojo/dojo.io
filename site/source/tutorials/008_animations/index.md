---
layout: tutorial
title: Web Animations
overview: Use the Dojo 2 WebAnimations meta to animate you widgets.
paginate: true
---

{% section 'first' %}

# Web Animations

## Overview
This tutorial introduces two lovable zombies which we will learn to animate using the Dojo 2 `WebAnimation` meta. In this tutorial, we will introduce the api provided by WebAnimations and show you how to use it with Dojo 2.

## Prerequisites
You can [download](../assets/008_animations-initial.zip) the initial demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## What is the web animations API

The [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API) provides programatic control over web animations via the timing model and the animation model. This allows animations to be created and controlled via javascript with access to playbackrate, iterations, events etc... something which would previously have required the use of `requestAnimationFrame` or the dreaded `setInterval`. Dojo 2 provides a meta that can apply Web Animations to the rendered vdom in the widgets you create. This allows properties such as `play` and `duration` to be reactive to state changes and fits in neatly within the Dojo 2 eco stystem.

## Introducing the zombies

Looking at the `Zombies.ts` file within the initial project we can see that we have a series of divs representing two zombies, each with a body and two legs. Via the magic of css these turn into two zombies when you open your browser. To demonstrate the use of Web Animations with Dojo 2 we make the zombies walk towards each other when they are clicked.

{% task 'Animating our zombies' %}

To animate the zombies, we use the `@dojo/widget-core/meta/WebAnimation` meta. This takes a `key` and `AnimationProperties`.
Lets add animation properties to our left Zombie.

{% instruction 'Add the following to the render function in Zombies.ts' %}

``` typescript
// add the import
import WebAnimation from '@dojo/widget-core/meta/WebAnimation';

//add to the top of the render function
const zombieOneMoveAnimation = {
	id: 'zombieOneMove,
	effects: [
		{ left: '0%' },
		{ left: '35%' }
	],
	timing: {
		duration: 2000,
		easing: 'ease-in',
		fill: 'forwards'
	},
	controls: {
		play: true
	}
};

this.meta(WebAnimation).animate('zombieOne', zombieOneMoveAnimation);
```

{% aside 'Reminder' %}
If you cannot see the zombies, make sure you have run `dojo build -w` to build the application and start the development server.
{% endaside %}

Refresh your browser and you should now see the left zombie moving across the screen for 2 seconds.

So let's talk about the animation properties we've created here:

- Object contains a unique id for this animation
- Effects array depicts the steps for the animation, in this case we're animating the `left` style from `0%` to `35%`
- The timing object specifies the duration and easing effects for the animation. The fill param specifies that the animation should finish in it's final position
- The controls object in this case simply sets play to `true`

{% task 'Animating our zombie on click' %}

To make the zombie animate on click, we need to use our widgets state to control the `play` property of the `zombieOneMoveAnimation` object. We can do this by creating a `_play: boolean` property on our widget and toggling it in our zombie click function.

{% instruction 'Edit Zombies.ts' %}

``` typescript
export class Zombies extends WidgetBase {
	// add the _play boolean at the top of the class
	private _play = false;

	private _onZombieClick() {
		// add the toggle and an invalidate call to the zombie
		// click function
		this._play = !this._play;
		this.invalidate();
	}

	// now use this._play instead of a hardcoded `true` in the `zombieOneMoveAnimation` object
```

Refresh the browser and the zombie should now respond to a click.


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

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:48-51 %}

Replace all of the selectors containing `.workerForm` with the following rules in `workerForm.m.css`.

{% include_codefile 'demo/finished/biz-e-corp/src/styles/workerForm.m.css' lines:1-17 lang:css %}

If you open the application in a browser its appearance and behavior should be unchanged.

{% instruction 'Now update `worker.m.css` and `workerContain.m.css` to use `.root` and `.rootFixed` and then update the associated widgets to use the new selectors. %}

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
        classes: [ ...this.theme([ css.root, this._isFlipped ? css.reverse : null ]), css.rootFixed ]
    }, [
    // ...
}
```

{% endsolution %}

Next, we will start to create a theme.

{% section %}

## Creating a Theme

{% task 'Create a theme directory' %}

Let's create a `themes` directory under your project `src` to store our theme resources, and create a `dojo` theme with `theme.ts` under `src/themes/dojo/theme.ts`. This is the `theme` resource where we will import our themed CSS files and export the keyed theme for consumption by our widgets.

{% instruction 'Theme the Worker widget' %}

In order to theme the `Worker` widget, we need to create `worker.m.css` within our `themes/dojo` directory and use it within `theme.ts`. The naming here is important as the object key of the exported theme must match the naming of the widget's style sheet.

Add the following code to `theme.ts`:

``` typescript
import * as worker from './worker.m.css';
export default {
	worker
};
```

Let's start by creating a red `Worker` and observe our theme being applied correctly.

```css
/* worker.m.css */
.root {
	background: red;
}
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

Now we will use these variables in `worker.m.css` to create our fully themed `Worker`.

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
	worker,
	workerForm
};
```

This should be familiar from theming the `Worker` in the previous section. To theme the Dojo 2 `TextInput` within our `WorkerForm`, we need to create `dojoTextInput.m.css` and export it from `theme.ts` using a theme key prefixed with `dojo-`. The dojo prefix helps ensure that the Dojo widget theme keys do not clash with application widget theme keys.

{% instruction 'Create `dojoTextInput.m.css`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/themes/dojo/dojoTextInput.m.css' lang:css %}

{% instruction 'And export it from `theme.ts`' %}

``` typescript
import * as worker from './worker.m.css';
import * as workerForm from './workerForm.m.css';
import * as dojoTextInput from './dojoTextInput.m.css';
export default {
	worker,
	workerForm,
	'dojo-textinput': dojoTextInput
};
```

Notice the styling rule for the `.root` selector? Here we are introducing another powerful part of the Dojo 2 theming system, `composes`. Composes originates in the [`css-module` specification](https://github.com/css-modules/css-modules#composition), allowing you to apply styles from one class selector to another. Here we are specifying that the `root` of a `TextInput` (the label text in this case), should appear the same as the `nameLabel` class in our `WidgetForm`. This approach can be very useful when creating multiple themes from a `baseTheme` and avoids repetitive redefinition of style rules.

In your web browser you will see the `TextInput` widgets at the top of the form have been styled.

{% instruction 'Create a theme resource for the Dojo Button' %}

Create a theme resource for the Dojo `Button` within `WidgetForm` following the same pattern within this tutorial.

{% instruction 'When you are finished, click on toggle solution to see the results.' %}

{% solution showsolution2 %}
``` css
@import './variables';

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
{% endsolution %}

{% section %}

## Summary

In this tutorial, we learned:

* How to create a theme
* How to apply a theme to both Dojo and custom widgets using the `themeInjector`.
* How to leverage functionality from the Dojo 2 theming system to apply variables
* How to use `composes` to share styles between components

You can download the completed [demo application](../assets/007_theming-finished.zip) from this tutorial.

{% section 'last' %}
