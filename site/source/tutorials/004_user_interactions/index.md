---
layout: tutorial
title: Responding to events
overview: In this tutorial, you will learn how to update an application in response to user-generated events, such as clicking a button.
---
# Responding to events

## Overview
In this tutorial, you will learn how to update an application in response to user-generated events, such as clicking a button.

We will start with an application that renders widgets containing the portrait and names of several employees for the hypothetical company, "Biz-E Corp". In this tutorial, you will learn how to add event listeners to these widgets so that they show additional information about each worker including a list of their active tasks.

## Prerequisites
You can [download](../assets/004_user_interactions-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

## Creating an event listener
In the [previous](../003_creating_widgets/) tutorial in this series, we created an application that contains several widgets that render worker information. In this tutorial, you will add event listeners to these widgets to show additional information about an employee when the widget is clicked.

The first step is to add the listener itself. In Dojo 2, an event listener is assigned like any other property that is passed to the rendering function, `v`. Look at the `Worker` widget that is in `src/widgets`. Currently, the top level `DNode` has one property assigned: `classes`. Update the object containing that property as follows:

```ts
{
	classes: this.classes(css.workerFront),
	onclick: this.flip
}
```

The `onclick` property registers a function that will be called when the node that it is attached to is clicked. In this case, the registered function is a method called `flip`. Add a basic implementation for that method:

```ts
flip(): void {
	console.log('the flip method has been fired!');
}
```

Now, run the app (using `dojo build --watch` or `dojo build -w`) and navigate to [localhost:9999](http://localhost:9999). Once there, open the console window and click on any of the worker widgets to confirm that the `flip` method is being called as expected.

For short event handlers you might be tempted to use an anonymous function like this:
```ts
return v('div', {
	classes: this.classes(css.worker),
	onclick: () => {
		// Note: DO NOT DO THIS, this is an
		// example of an anti-pattern
		console.log('the handler has been called');
	}
}, ...
```

While this appears to work, Maquette doesn't allow an event handler to be updated. To see what happens, let's have the `onclick` handler invalidate the widget, forcing Maquette to re-render it.

```ts
return v('div', {
	classes: this.classes(css.worker),
	onclick: () => {
		// Note: DO NOT DO THIS, this is an
		// example of an anti-pattern
		console.log('the handler has been called');
		this.invalidate();
	}
}, ...
```

Open up your browser's development tools and display the console tab then click on a widget. Notice that an error is written to the console. To avoid an error, all event handlers must be defined once, such as via a method. Update the `onclick` property to its previous value:

```ts
return v('div', {
	classes: this.classes(css.worker),
	onclick: this.flip
},...
```

## Adding a second visual state
Now that we have an event handler it is time to extend the `render` method to be able to show detailed information about a worker in addition to the current overview. For the sake of this tutorial, we will call the current view the front and the detailed view the back.

We could add the additional rendering logic in the current `render` method, but that method could become difficult to maintain as it would have to contain all of the rendering code for both the front and back of the card. Instead, we will generate the two views using two private methods and then call them from the `render` method. To start, create a new private method called `_renderFront` and move the existing render code inside it:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:25-43 %}

Next, create another private method called `_renderBack` to render the back view:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:45-91 %}

This code is not doing anything new. We are composing together multiple virtual nodes to generate the elements required to render the detailed view. This method does, however, refer to some properties and CSS selectors that do not exist yet.

Three new properties need to be added to the `WorkerProperties` interface. These properties are the email address of the worker, the average number of hours they take to complete a task, and the active tasks for the worker.

Update the `WorkerProperties` interface to:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:7-13 %}

Now, we need to add the CSS selectors that will provide the rules for rendering this view's elements. Open up the `worker.css` file in `src/styles` and update it as follows:

{% include_codefile 'demo/finished/biz-e-corp/src/styles/worker.css' lines:8-39 lang:css %}

We also need to update the CSS selector for the front view, by changing the selector from `css.worker` to `css.workerFront`.

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:25-43 %}

Finally, we need to update the `render` method to choose between the two rendering methods. To do that, add a private field to the class:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' line:19 %}

The use of a field to store this kind of data is standard practice in Dojo 2. Properties are used to allow other components to view and modify a widget's published state. For internal state, however, private fields are used to allow widget to encapsulate state information that should not be exposed publicly. Let's use that field's value to determine which side to show:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:21-23 %}

Confirm that everything is working by viewing the application in a browser - all three cards should be showing their front faces. Now change the value of the `_isFlipped` field to `true` and, after the application recompiles, all three widgets should be showing their back faces.

In order to re-render our widget, we need to update the `flip` method to toggle the `_isFlipped` field and invalidate the widget

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/Worker.ts' lines:93-96 %}

Now, the widget can be flipped between its front and back sides by clicking on it.

## Final steps - providing more properties

Currently, several of the properties are missing for the widgets. As an exercise, try to update the first widget to contain the following properties:
```ts
firstName: 'Tim'
lastName: 'Jones'
email: 'tim.jones@bizecorp.org',
tasks: [
	'6267 - Untangle paperclips',
	'4384 - Shred documents',
	'9663 - Digitize 1985 archive'
]
```

When you are ready, click the button below to see our solution.

{% solution showsolution1 %}
The widget's parent is responsible for passing properties to the widget.
In this application, `Worker` widgets are contained by the `WorkerContainer` widget.
To pass the specified properties to the first worker, the first element in
the `workers` array needs to be updated to the following:

```ts
w(Worker, {
	firstName: 'Tim',
	lastName: 'Jones',
	email: 'tim.jones@bizecorp.org',
	tasks: [
		'6267 - Untangle paperclips',
		'4384 - Shred documents',
		'9663 - Digitize 1985 archive'
	]
})
```
{% endsolution %}

## Summary

In this tutorial, we learned how to attach event listeners to respond to widget-generated events. Event handlers are assigned to virtual nodes like any other Dojo 2 property. Be aware that the value of an event handler cannot change once the widget has been rendered the first time. This is normally accomplished by creating a method on the widget class and assigning this method as the event handler.

If you would like, you can download the [demo application](../assets/004_user_interactions-finished.zip).

In the [next tutorial](../comingsoon.html), we will work with more complicated interactions in Dojo 2 by extending the demo application, allowing new Workers to be created using forms.
