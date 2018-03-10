---
layout: tutorial
title: Form widgets
overview: Use some of Dojo 2's out-of-the-box form widgets to create a simple form and use it to update the application.
paginate: true
---

{% section 'first' %}

# Working with forms

## Overview
This tutorial will extend on [Responding to events](../004_user_interactions/), where we allowed the user to interact with the application by listening for click events. In this tutorial, we will add a form to the Biz-E-Worker page so that a user can add new workers to the application. This will be done by using some of Dojo 2's form widgets to allow the feature to be developed more rapidly.

## Prerequisites
You can [download](../assets/005_form_widgets-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Forms

{% task 'Create a form.' %}

The first step to allowing the user to create new workers is to create a form. This form will contain the input elements that will accept the new worker's initial settings.

{% instruction 'Add the following to `WorkerForm.ts`.' %}

```typescript
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v } from '@dojo/widget-core/d';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import * as css from '../styles/workerForm.m.css';

export interface WorkerFormProperties {
}

export const WorkerFormBase = ThemedMixin(WidgetBase);

@theme(css)
export default class WorkerForm extends WorkerFormBase<WorkerFormProperties> {

	private _onSubmit(event: Event) {
		event.preventDefault();
	}

	protected render() {
		return v('form', {
			classes: this.theme(css.workerForm),
			onsubmit: this._onSubmit
		});
	}
}
```

{% aside 'Reminder' %}
If you cannot see the application, remember to run `dojo build -m dev -w memory -s` to build the application and start the development server.
{% endaside %}

This widget will render an empty form with a `submit` handler that prevents the form from being submitted to the server. Before we continue to expand on this starting point though, let's integrate the form into the application so we can observe the form as we add more features.

{% instruction 'Add the following widget CSS rules to `workerForm.m.css`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/styles/workerForm.m.css' lang:css %}

{% instruction 'Now, add the `WorkerForm` to the `App` class.' %}

Import the `WorkerForm` class and the `WorkerFormData` interface and update the `render` method to draw the `WorkerForm`. It should be included after the `Banner` and before the `WorkerContainer` so the `render` method should look like this:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:46-49,53-58 %}

Now, open the application in a browser and inspect it via the browser's developer tools. Notice that the empty form element is being rendered onto the page as expected.

Next, we'll add the visual elements of the form.

{% section %}

## Form widgets

{% task 'Populate the form.' %}

Our form will contain fields allowing the user to create a new worker:

* A first name field for the worker
* A last name field for the worker
* An e-mail address field
* A save button that will use the form's data to create a new worker

We could create these fields and buttons using the `v` function to create simple virtual DOM elements. If we did this, however, we would have to handle details such as theming, internationalization ([i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization)) and accessibility ([a11y](https://en.wikipedia.org/wiki/Accessibility)) ourselves. Instead, we are going to leverage some of Dojo 2's built-in widgets that have been designed with these considerations in mind.

{% instruction 'Add `w` to the imports from `@dojo/widget-core/d` and add imports for the `Button` and `TextInput` classes to `WorkerForm.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:3-5 %}

These imports are for [built-in Dojo 2 Widgets](https://github.com/dojo/widgets). You can explore other widgets in the [Dojo 2 Widget Showcase](https://dojo.github.io/examples/widget-showcase/).

The `Button` class will be used to provide the form's submit button and the `TextInput` class will provide the data entry fields for the worker data.

{% instruction 'Replace your `render()` method with the definition below. The code below adds the necessary visual elements to the form' %}

```ts
	protected render() {
		return v('form', {
			classes: this.theme(css.workerForm),
			onsubmit: this._onSubmit
		}, [
			v('fieldset', { classes: this.theme(css.nameField) }, [
				v('legend', { classes: this.theme(css.nameLabel) }, [ 'Name' ]),
				w(TextInput, {
					key: 'firstNameInput',
					label: 'First Name',
					labelHidden: true,
					placeholder: 'Given name',
					required: true
				}),
				w(TextInput, {
					key: 'lastNameInput',
					label: 'Last Name',
					labelHidden: true,
					placeholder: 'Surname name',
					required: true
				})
			]),
			w(TextInput, {
				label: 'Email address',
				type: 'email',
				required: true
			}),
			w(Button, {}, [ 'Save!' ])
		]);
	}
```

At this point, the user interface for the form is available, but it does not do anything since we have not specified any event handlers. In the [last tutorial](../004_user_interactions/), we learned how to add event handlers to custom widgets by assigning a method to an event. When using pre-built widgets, however, we pass the handlers as properties. For example, we are going to need a way to handle each text field's `input` event. To do that, we provide the desired handler function as the `onInput` property that is passed to the widget.

{% instruction 'Update the `render` method once again.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:42-81 %}

This form of the `render` method now does everything that we need: it creates the user interface and registers event handlers that will update the application as the user enters information. However, we need to add a few more methods to the `WorkerForm` to define the event handlers.

{% instruction 'Add these methods:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:30-40 %}

The `render` method starts by decomposing the properties into local constants. We still need to define those properties.

{% instruction 'Update the `WorkerFormProperties` interface to include them, and add a `WorkerFormData` interface.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:8-18 %}

Most of these properties should be familiar by now, but notice the type signature for the `formData` property and the argument of the `onFormInput` property. They're both objects of type `Partial<WorkerFormData>`. The `Partial` type will convert all of the properties of the provided type (`WorkerFormData` in this case) to be optional. This will inform the consumer that it is not guaranteed to receive all of the `WorkerFormData` properties every time - it should be prepared to receive only part of the data and process only those values that it receives.

There are two types of properties that we are using in this form. The `firstName`, `lastName` and `email` properties are grouped together in the `WorkerFormData` interface and are going to set the values that are displayed in the form fields. The `onFormInput` and `onFormSave` properties expose the events that the `WorkerForm` widget can emit. To see how these different property types are used, let's examine the properties that are being passed into the first `TextInput` widget:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:53-61 %}

The first thing that we see is a `key` property. As mentioned before, a key is necessary whenever more than one of the same type of widget or virtual DOM element will be rendered by a widget. The `label`, `placeholder`, and `required` fields map to their expected properties.

The `value` property renders the value of the field that is passed into the widget via its properties. Notice that there is no code that manipulates this value within the widget. As parts of a [reactive framework](https://en.wikipedia.org/wiki/Reactive_programming), Dojo 2 widgets do not normally update their own state. Rather, they inform their parent that a change has occurred via events or some other mechanism. The parent will then pass updated properties back into the widget after all of the changes have been processed. This allows Dojo 2 applications to centralize data and keep the entire application synchronized.

The final property assigns the `onFirstNameInput` method to the `onInput` property. The `onFirstNameInput` method, in turn, calls the `onFormInput` property, informing the `WorkerForm`'s parent that a change has occurred. This is another common pattern within Dojo 2 applications - the `WorkerForm` does not expose any of the components that it is using to build the form. Rather, the `WorkerForm` manages its children internally and, if necessary, calls its event properties to inform its parent of any changes. This decouples the consumers of the `WorkerForm` widget and frees them from having to understand the internal structure of the widget. Additionally, it allows the `WorkerForm` to change its implementation without affecting its parent as long as it continues to fulfill the `WorkerFormProperties` interface.

The last change that needs to be made in the `WorkerForm` is to update the `_onSubmit` method to delegate to the `onFormSave` property when it is called.

{% instruction 'Replace the `_onSubmit` method with.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:25-28 %}

The form is now ready to be integrated into the application. We will do that in the next step.

{% section %}

## Using forms

{% task 'Integrate the form into the application.' %}

Now that the `WorkerForm` widget is complete, we will update the `App` class to use it. First, we need to address how to store the user-completed form data. Recall that the `WorkerForm` will accept an `onFormInput` property that will allow the `App` class to be informed when a field value changes. However, the `App` class does not currently have a place to store those changes. We will add a private property to the `App` to store this state, and a method to update the state and re-render the parts of the application that have changed. As the application grows and needs to store more data, using private properties on a widget class can become difficult to maintain. Dojo 2 uses containers and injectors to help manage the complexities of dealing with state in a large application. For more information, refer to the [Containers and Injecting State](../1010_containers_and_injecting_state/) article.

{% instruction 'Import the `WorkerFormData` interface into `App.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:4 %}

{% instruction 'Add `_newWorker` as a private property.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:9 %}

Notice that `_newWorker` is a `Partial<WorkerFormData>`, since it may include only some, or none, of the `WorkerFormData` interface properties.

{% instruction 'Update the `render` method to populate the `WorkerForm`\'s properties.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:46-58 %}

The `onFormInput` handler is calling the `App`'s `_onFormInput` method.

{% instruction 'Add the `_onFormInput` method.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:38-44 %}

The `_onFormInput` method updates the `_newWorker` object with the latest form data and then invalidates the app so that the form field will be re-rendered with the new data.

The `onFormSave` handler calls the `_addWorker` method.

{% instruction 'Add the `_addWorker` method to the `App` class.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:32-36 %}

The `_addWorker` method sets `_workerData` to a new array that includes the `_newWorker` object (which is the current `WorkerFormData`), sets `_newWorker` to a new empty object, and then invalidates the `App` widget. The reason that `_workerData` is not updated in place is because Dojo 2 decides whether a new render is needed by comparing the previous value of a property to the current value. If we are modifying the existing value then any comparison performed would report that the previous and current values are identical.

With the `WidgetForm` in place and the `App` configured to handle it, let's try it. For now let's test the [happy path](https://en.wikipedia.org/wiki/Happy_path) by providing the expected values to the form. Provide values for the fields, for example: "Suzette McNamara (smcnamara359@email.com)" and click the `Save` button. As expected, the form is cleared and a new `Worker` widget is added to the page. Clicking on the new `Worker` widget shows the detailed information of the card where we find that the first name, last name, and email values have been properly rendered.

{% section %}

## Summary

In this tutorial, we learned how to create complex widgets by composing simpler widgets together. We also got a first-hand look at how Dojo 2's reactive programming style allows an application's state to be centralized, simplifying data validation and synchronization tasks. Finally, we saw a couple of the widgets that come in Dojo 2's widgets package and learned how they address many common use cases while providing support for theming, internationalization, and accessibility.

Dojo 2 widgets are provided in the [@dojo/widgets](https://github.com/dojo/widgets) GitHub repository. Common built-in widgets exist, such as buttons, accordions, form inputs, etc. You can view these widgets in the [Widget Showcase](https://dojo.github.io/examples/widget-showcase/).

If you would like, you can download the completed [demo application](../assets/005_form_widgets-finished.zip) from this tutorial.

In [Deploying to production](../006_deploying_to_production/), we will wrap up this series by learning how to take a completed Dojo 2 application and prepare it for deployment to production.

{% section 'last' %}
