---
layout: tutorial
title: Form widgets
overview: In this tutorial, you will learn how to use some of Dojo 2's built-in form widgets to create a simple form and use it to update the application.
---

{% section 'first' %}

# Working with forms

## Overview
This tutorial will extend on the [previous](../004_user_interactions/) tutorial where we allowed the user to interact with the application by listening for click events. In this tutorial, we will add a form to the Biz-E-Worker page so that a user can add new workers to the application. This will be done by using some of Dojo 2's form widgets to allow the feature to be developed more rapidly.

## Prerequisites
You can [download](../assets/005_form_widgets-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Forms

{% task 'Creating a form' %}

The first step to allowing the user to create new workers is to create a form. This form will contain the input elements that will accept the new worker's initial settings.

{% instruction 'Add the following to `WorkerForm.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:1-4,7,14-15,19-27,29,42-43,48-51,85-87 %}

{% aside 'Reminder' %}
If you cannot see the application, remember to run `dojo build -w` to build the application and start the development server.
{% endaside %}

This widget will render an empty form with a `submit` handler that prevents the form from being submitted to the server. Before we continue to expand on this starting point though, let's integrate the form into the application so we can observe the form as we add more features.

{% instruction 'Add the following widget CSS rules to `workerForm.css`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/styles/workerForm.css' lang:css %}

{% instruction 'Now, add the `WorkerForm` to the `App` class.' %}

Import the `WorkerForm` class and the `WorkerFormData` interface and update the `render` method to draw the `WorkerForm`. It should be included after the `Banner` and before the `WorkerContainer` so the `render` method should look like this:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-53,57-62 %}

Now, open the application in a browser and inspect it via the browser's developer tools. Notice that the empty form element is being rendered onto the page as expected.

Next, we'll add the visual elements of the form.

{% section %}

## Form widgets

{% task 'Populating the form' %}

Our form will contain fields allowing the user to enter the worker's first name, last name and e-mail address. It will also contain a save button that will use the form's data to create a new worker. We could create these fields and buttons using the `v` function to create simple virtual DOM elements. If we did this, however, we would have to handle details such as theming, internationalization ([i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)) and accessibility ([a11y](https://en.wikipedia.org/wiki/Accessibility)) ourselves. Instead, we are going to leverage some of Dojo 2's built-in widgets that have been designed with these considerations in mind.

{% instruction 'Add the following imports to `WorkerForm.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:5-6 %}

{% aside 'Note' %}
	If you have been working with the same project throughout this series, you might get some errors when you try to import the widgets. If you do, add a new dependency to the `project.json` file: "@dojo/widgets":"2.0.0-alpha.23" and rerun `npm install` to install Dojo 2's standard widget library.
{% endaside %}

We are importing the `Button` class that will be used to provide the form's submit button and the `TextInput` class that will provide the data entry fields for the worker data.

{% instruction 'Use those classes and a few virtual DOM nodes to add the visual elements of the form.' %}

```ts
	protected render(): DNode {
		return v('form', {
			classes: this.classes(css.workerForm),
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.classes(css.nameField) }, [
				v('legend', { classes: this.classes(css.nameLabel) }, [ 'Name' ]),
				w(TextInput, {
					key: 'firstNameInput',
					label: {
						content: 'First Name',
						hidden: true
					},
					placeholder: 'Given name',
					required: true
				}),
				w(TextInput, {
					key: 'lastNameInput',
					label: {
						content: 'Last Name',
						hidden: true
					},
					placeholder: 'Surname name',
					required: true
				})
			]),
			w(TextInput, {
				label: 'Email address',
				type: 'email',
				required: true
			}),
			w(Button, { content: 'Save' })
		]);
	}
```

At this point, the user interface for the form is available, but it does not do anything since we have not specified any event handlers. In the [last tutorial](../004_user_interactions/), we learned how to add event handlers to custom widgets by assigning a method to an event. When using pre-built widgets, however, we pass the handlers as properties. For example, we are going to need a way to handle each text field's `input` event. To do that, we provide the desired handler function as the `onInput` property that is passed to the widget.

{% instruction 'Update the `render` method once again.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:43-86 %}

This form of the `render` method now does everything that we need: it creates the user interface and registers event handlers that will update the application as the user enters information. However, we need to add a few more methods to the `WorkerForm` to define the event handlers.

{% instruction 'Add these methods:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:31-41 %}

The `render` method starts by decomposing the properties into local constants. We still need to define those properties.

{% instruction 'Update the `WorkerFormProperties` interface to include them.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:9-19 %}

Most of these properties should be familiar by now, but notice the type signature for the `onFormInput` property. It accepts an object of type `Partial<WorkerFormData>`. The `Partial` type will convert all of the properties of the provided type (`WorkerFormData` in this case) to be optional. This will inform the consumer that it is not guaranteed to receive all of the `WorkerFormData` properties every time - it should be prepared to receive only part of the data and process only those values that it receives.

There are two types of properties that we are using in this form. The `firstName`, `lastName` and `email` properties are grouped together in the `WorkerFormData` interface and are going to set the values that are displayed in the form fields. The `onFormInput` and `onFormSave` properties expose the events that the `WorkerForm` widget can emit. To see how these different property types are used, let's examine the properties that are being passed into first `TextInput` widget:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:54-64 %}

The first thing that we see is a `key` property. As mentioned before, a key is necessary whenever the same type of widget or virtual DOM element will be rendered by a widget. The `label`, `placeholder`, and `required` fields map to their expected properties.

The `value` property renders the value of the field that is passed into the widget via its properties. Notice that there is no code that manipulates this value within the widget. As parts of a [reactive framework](https://en.wikipedia.org/wiki/Reactive_programming), Dojo 2 widgets do not normally update their own state. Rather, they inform their parent that a change has occurred via events or some other mechanism. The parent will then pass updated properties back into the widget after all of the changes have been processed. This allows Dojo 2 applications to centralize data and keep the entire application synchronized.

The final property assigns the `onFirstNameInput` method to the `onInput` property. The `onFirstNameInput` method, in turn, calls the `onFormInput` property, informing the `WorkerForm`'s parent that a change has occurred. This is another common pattern within Dojo 2 applications - the `WorkerForm` does not expose any of the components that it is using to build the form. Rather, the `WorkerForm` manages its children internally and, if necessary, calls its event properties to inform its parent of any changes. This decouples the consumers of the `WorkerForm` widget and frees them from having to understand the internal structure of the widget. Additionally, it allows the `WorkerForm` to change its implementation without affecting its parent as long as it continues to fulfill the `WorkerFormProperties` interface.

The last change that needs to be made in the `WorkerForm` is to update the `_onSubmit` method to delegate to the `onFormSave` property when it is called.

{% instruction 'Replace the `_onSubmit` method with.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:26-29 %}

The form is now ready to be integrated into the application. We will do that in the next step.

{% section %}

## Using forms

{% task 'Integrate the form into the application' %}

Now that the `WorkerForm` widget is complete, we will update the `App` class to use it. First, we need to address how to store the user-completed form data. Recall that the `WorkerForm` will accept an `onFormInput` property that will allow the `App` class to be informed when a field value changes. However, the `App` class does not currently have a place to store those changes. We could add private fields in the class to store those values, but that would be difficult to maintain as the application grows and needs to store more data. Instead, we are going to leverage another mixin that comes with Dojo 2 that is designed to handle state for us - the `StatefulMixin`.

{% aside 'StatefulMixin versus dojo/Stateful' %}
	The `StatefulMixin` might remind some users of Dojo 1's `dojo/Stateful` module. In Dojo 1, the `Stateful` module allowed properties to be retrieved, set, and observed. All of which are now part of the JavaScript language. In Dojo 2, `StatefulMixin` adds functionality to a class that provides a standard mechanism to store state information and automatically re-render when the state changes.
{% endaside %}

The `StatefulMixin` allows a class to store data in an object that can be updated by calling the `setState` method. The `StatefulMixin` is designed to accept partial updates to the contained state. In this application, the `WorkerForm` is only going to provide data on one property at a time. When the `setState` method is called with a partial state update, it will only update the state of values that have been provided. Additionally, calling the `setState` method will raise an event that will trigger the application to re-render the relevant portions of the user interface to reflect the new state.

{% instruction 'Import the `StatefulMixin` by adding this line to the top of `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:4 %}

{% instruction 'Add `AppBase` and update the class declaration.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:10,17-18 %}

{% instruction 'Update the `render` method to populate the `WorkerForm`'s properties.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:50-62 %}

The `onFormInput` handler is calling the `App`'s `_onFormInput` method.

{% instruction 'Add the `_onFormInput` method.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:46-48 %}

The `_onFormInput` method calls the `setState` method, passing in the updated partial state.

The `onFormSave` handler calls the `_addWorker` method.

{% instruction 'Add the `_addWorker` method to the `App` class.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:41-44 %}

The `_addWorker` method pushes the stored state (which is the current `WorkerFormData`) to the `_workerData` array and then calls the `setState` method with a `defaultForm`.

{% instruction 'Add the `defaultForm` to `App.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:12-16 %}

The `defaultForm` object resets all of the state properties to `undefined`. This will serve to clear the `WorkerForm` when the application renders it again, which will happen automatically after the new state has been stored.

With the `WidgetForm` in place and the `App` configured to handle it, let's try it. First test the [happy path](https://en.wikipedia.org/wiki/Happy_path) by providing the expected values to the form. Provide values for the fields, for example: "Suzette McNamara (smcnamara359@email.com)" and click the `Save` button. As expected, the form is cleared and a new `Worker` widget is added to the page. Clicking on the new `Worker` widget shows the detailed information of the card where we find that the first name, last name, and email values have been properly rendered.

{% section %}

## Summary

In this tutorial, we learned how to create complex widgets by composing simpler widgets together. We also got a first-hand look at how Dojo 2's reactive programming style allows an application's state to be centralized, simplifying data validation and synchronization tasks. Finally, we saw a couple of the widgets that come in Dojo 2's widgets package and learned how they address many common use cases while providing support for theming, internationalization, and accessibility.

In the [next tutorial](../comingsoon.html), we will wrap up this series by learning how to take a completed Dojo 2 application and prepare it for deployment to production.

{% section 'last' %}
