---
layout: tutorial
title: Web Animations
overview: Use the Dojo 2 WebAnimations meta to animate your widgets.
paginate: true
---

{% section 'first' %}

# Web Animations

## Overview
This tutorial introduces two lovable zombies which we will learn to animate using the Dojo 2 `WebAnimation` meta. We will introduce the api provided by WebAnimations and show you how to use it with Dojo 2.

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
Lets add animation properties to our first Zombie.

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

- A unique id for this animation
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
