---
layout: tutorial
title: Responding to events
overview: Update an application in response to user-generated events, such as clicking a button.
paginate: true
---

{% section 'first' %}

# Responding to events

## Overview
In this tutorial, you will learn how to update an application in response to user-generated events, such as clicking a button.

We will start with an application that renders widgets containing the portrait and names of several employees for the hypothetical company, "Biz-E Corp". In this tutorial, you will learn how to add event listeners to these widgets so that they show additional information about each worker including a list of their active tasks.

## Prerequisites
You can [download](../assets/004_user_interactions-initial.zip) the demo project and run `npm install` to get started.

You should install the `@dojo/cli` command globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Event listeners

{% task 'Create an event listener.' %}

In [Creating widgets](../003_creating_widgets/), we created an application that contains several widgets that render worker information. In this tutorial, you will add event listeners to these widgets to show additional information about an employee when clicking on the widget.

The first step is to add the listener itself. In Dojo 2, event listeners get assigned like any other property passed to the rendering function, `v`. Look at the `Worker` widget that is in `src/widgets`. Currently, the top level `DNode` has one property assigned: `classes`.

{% instruction 'Update the object containing that property as follows.' %}

```ts
{
	classes: this.theme(css.worker),
	onclick: this.flip
}
```

The `onclick` property registers a function to call when clicking on the node to which it is attached. In this case, the registered function is a method called `flip`.

{% instruction 'Add a basic implementation for that method within the Worker class.' %}

```ts
flip(): void {
	console.log('the flip method has been fired!');
}
```

Now, run the app (using `dojo build -m dev -w memory -s`) and navigate to [localhost:9999](http://localhost:9999). Once there,

{% instruction 'Open the console window and click on any of the worker widgets to confirm that the `flip` method gets called as expected.' %}

{% section %}

## Using event handlers

{% task 'Add a second visual state.' %}

Now that we have an event handler, it is time to extend the `render` method to show detailed information about a worker in addition to the current overview. For the sake of this tutorial, we will call the current view the front and the detailed view the back.

We could add the additional rendering logic in the current `render` method, but that method could become difficult to maintain as it would have to contain all of the rendering code for both the front and back of the card. Instead, we will generate the two views using two private methods and then call them from the `render` method.

{% instruction 'Create a new private method called `_renderFront` and move the existing render code inside it.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:29-47 %}

{% instruction 'Create another private method called `_renderBack` to render the back view.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:49-90 %}

This code is not doing anything new. We are composing together multiple virtual nodes to generate the elements required to render the detailed view. This method does, however, refer to some properties and CSS selectors that do not exist yet.

We need to add three new properties to the `WorkerProperties` interface. These properties are the email address of the worker, the average number of hours they take to complete a task, and the active tasks for the worker.

{% instruction 'Update the `WorkerProperties` interface.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:6-12 %}

Now, we need to add the CSS selectors that will provide the rules for rendering this view's elements.

{% instruction 'Open `worker.m.css` and replace the existing classes with the following.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/styles/worker.m.css' lang:css %}

We also need to update the CSS selector for the front view by changing the selector from `css.worker` to `css.workerFront`.

Finally, we need to update the `render` method to choose between the two rendering methods.

{% instruction 'Add a private field to the class.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' line:18 %}

In general, the use of private state is discouraged. Dojo 2 encourages the use of a form of the [inversion of control](https://en.wikipedia.org/wiki/Inversion_of_control) pattern, where the properties passed to the component by its parent control the behavior of the component. This pattern helps make components more modular and reusable since the parent component is in complete control of the child component's behavior and does not need to make any assumptions about its internal state. For widgets that have state, the use of a field to store this kind of data is standard practice in Dojo 2. Properties are used to allow other components to view and modify a widget's published state, and private fields are used to enable widgets to encapsulate state information that should not be exposed publicly.

{% instruction 'Use that field\'s value to determine which side to show.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:20-27 %}

Confirm that everything is working by viewing the application in a browser. All three cards should be showing their front faces. Now change the value of the `_isFlipped` field to `true` and, after the application re-compiles, all three widgets should be showing their back faces.

To re-render our widget, we need to update the `flip` method to toggle the `_isFlipped` field and invalidate the widget

{% instruction 'Replace the `flip` method with this one.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:92-95 %}

Now, the widget may flip between its front and back sides by clicking on it.

{% section %}

## Final steps

{% task 'Provide additional properties.' %}

Currently, several of the properties are missing for the widgets. As an exercise, try to update the first widget to contain the following properties:

```ts
{
	firstName: 'Tim',
	lastName: 'Jones',
	email: 'tim.jones@bizecorp.org',
	tasks: [
		'6267 - Untangle paperclips',
		'4384 - Shred documents',
		'9663 - Digitize 1985 archive'
	]
}
```

This change will pass the specified properties to the first worker. The widget's parent
is responsible for passing properties to the widget. In this application, `Worker`
widgets are receiving data from the `App` class via the `WorkerContainer`.


{% section %}

## Summary

In this tutorial, we learned how to attach event listeners to respond to widget-generated events. Event handlers get assigned to virtual nodes like any other Dojo 2 property.

If you would like, you can download the [demo application](../assets/004_user_interactions-finished.zip).

In [Form widgets](../005_form_widgets/), we will work with more complicated interactions in Dojo 2 by extending the demo application, allowing new Workers to be created using forms.

{% section 'last' %}
