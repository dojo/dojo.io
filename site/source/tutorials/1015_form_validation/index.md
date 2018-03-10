---
layout: tutorial
title: Form validation
overview: This tutorial covers patterns for form validation, building on both the form widget tutorial and the state management tutorial.
paginate: true
---

{% section 'first' %}

# Form validation

## Overview

This tutorial will cover how to handle basic form validation within the context of the demo app. Handling form data has already been covered in the tutorial on [injecting state](../1010_containers_and_injecting_state); here we will build on those concepts to add a validation state and errors to the existing form. Over the course of the tutorial we will build an example pattern for creating both dynamic client-side validation and mock server-side validation.

## Prerequisites

Start by downloading the [demo project](../assets/1015_form_validation-initial.zip) and running `npm install` to get started.

This tutorial assumes that you have gone through the [form widgets tutorial](../005_form_widgets) as well as the [state management tutorial](../1010_containers_and_injecting_state).

{% section %}

## Create a place to store form errors

{% task 'Add form errors to the application context.' %}

Right now the error object should mirror `WorkerFormData` in both `WorkerForm.ts` and `ApplicationContext.ts`. In the wild this error configuration could be handled in a number of ways; one might be to provide an option for multiple validation steps with individual error messages for a single input. Here we will go for the simplest solution with a boolean valid/invalid state for each input.

{% instruction 'Create an interface for `WorkerFormErrors` in `WorkerForm.ts`' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:15-19 %}

Defining the properties in the `WorkerFormErrors` interface as optional allows us to effectively create three possible states for form fields: unvalidated, valid, and invalid.

{% instruction 'Next add a `formErrors` method to the `ApplicationContext` class' %}

As an exercise, complete the following three steps:

1. Create a private field for `_formErrors` in the ApplicationContext class
2. Define a public getter for the `_formErrors` field within the `ApplicationContext`
3. Update the `getProperties` function in the `WorkerFormContainer.ts` file to pass through the new error object

Hint: Follow the existing `_formData` private field in the `ApplicationContext` class to see how it's used. The `_formErrors` variable you need to add can follow the same flow.

Make sure the following lines are present somewhere in `ApplicationContext.ts`:
{% solution showsolution1 %}
```typescript
// modify import to include WorkerFormErrors
import { WorkerFormData, WorkerFormErrors } from './widgets/WorkerForm';

// private field
private _formErrors: WorkerFormErrors = {};

// public getter
get formErrors(): WorkerFormErrors {
	return this._formErrors;
}
```
{% endsolution %}

The modified `getProperties` function in `WorkerFormContainer.ts`:
{% solution showsolution2 %}
```typescript
function getProperties(inject: ApplicationContext, properties: any) {
	const {
		formData,
		formErrors,
		formInput: onFormInput,
		submitForm: onFormSave
	} = inject;

	return {
		formData,
		formErrors,
		onFormInput: onFormInput.bind(inject),
		onFormSave: onFormSave.bind(inject)
	};
}
```
{% endsolution %}

{% instruction 'Finally, modify `WorkerFormProperties` in `WorkerForm.ts` to accept the `formErrors` object passed in by the application context:' %}

```ts
export interface WorkerFormProperties {
	formData: WorkerFormData;
	formErrors: WorkerFormErrors;
	onFormInput: (data: Partial<WorkerFormData>) => void;
	onFormSave: () => void;
}
```

{% section %}

## Tie validation to form inputs

{% task 'Perform validation on `onInput`' %}

We now have a place to store form errors in the application state, and those errors are passed into the form widget. The form still lacks any actual validation of the user input; for that, we need to dust off our regular expressions and write a basic validation function.

{% instruction 'Create a private `_validateInput` method in `ApplicationContext.ts`' %}

Like the existing `formInput` function, `_validateInput` should take a partial `WorkerFormData` input object. The validation function should return a `WorkerFormErrors` object. The example app shows only the most basic validation checks -- the email regex pattern for example is concise but somewhat lax. You are free to substitute a more robust email test, or add other modifications like a minimum character count for the first and last names.

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:32-50 %}

For now, we will test our validation by calling it directly in every `onInput` event. Add the following line to `formInput` in `ApplicationContext.ts`:

```ts
this._formErrors = deepAssign({}, this._formErrors, this._validateInput(input));
```

{% instruction 'Update the render method of the `WorkerForm` class to display validation state' %}

At this point in our progress, the `WorkerForm` widget holds the validation state of each form field in its `formErrors` property, updated every time an `onInput` handler is called. All that remains is to pass the valid/invalid property to the inputs themselves. Luckily the Dojo 2 `TextInput` widget contains an `invalid` property that sets the `aria-invalid` attribute on a DOM node, and toggles classes used for visual styling.

The updated render function in `WorkerForm.ts` should set the `invalid` property on all form field widgets to reflect `formErrors`. We also add a `novalidate` attribute to the form element to prevent native browser validation.

{% solution showsolution3 %}
```ts
protected render() {
	const {
		formData: { firstName, lastName, email },
		formErrors
	} = this.properties;

	return v('form', {
		classes: this.theme(css.workerForm),
		novalidate: 'true',
		onsubmit: this._onSubmit
	}, [
		v('fieldset', { classes: this.theme(css.nameField) }, [
			v('legend', { classes: this.theme(css.nameLabel) }, [ 'Name' ]),
			w(TextInput, {
				key: 'firstNameInput',
				label:'First Name',
				labelHidden: true,
				placeholder: 'Given name',
				value: firstName,
				required: true,
				invalid: this.properties.formErrors.firstName,
				onInput: this.onFirstNameInput
			}),
			w(TextInput, {
				key: 'lastNameInput',
				label: 'Last Name',
				labelHidden: true,
				placeholder: 'Surname name',
				value: lastName,
				required: true,
				invalid: this.properties.formErrors.lastName,
				onInput: this.onLastNameInput
			})
		]),
		w(TextInput, {
			label: 'Email address',
			type: 'email',
			value: email,
			required: true,
			invalid: this.properties.formErrors.email,
			onInput: this.onEmailInput
		}),
		w(Button, {}, [ 'Save' ])
	]);
}
```
{% endsolution %}

Now when you view the app in the browser, the border color of each form field changes as you type. Next we'll add error messages and update `onInput` validation to only occur after the first blur event.

{% section %}

## Extending TextInput

{% task 'Create an error message' %}

Simply changing the border color of form fields to be red or green doesn't impart much information to the user -- we need to add some error message text along with invalid state. On a basic level, our error text must be associated with a form input, styleable, and accessible. A single form field with an error message might look something like this:

```ts
v('div', { classes: this.theme(css.inputWrapper) }, [
	w(TextInput, {
		...
		aria: {
			describedBy: this._errorId
		},
		onInput: this._onInput
	}),
	invalid === true ? v('span', {
		id: this._errorId,
		classes: this.theme(css.error),
		'aria-live': 'polite'
	}, [ 'Please enter valid text for this field' ]) : null
])
```

The error message is associated with the text input through `aria-describedby`, and the `aria-live` attribute ensures it will be read if it is added to the DOM or changed. Wrapping both the input and the error message in a containing `<div>` allows us to position the error message relative to the input if desired.

{% instruction 'Extend `TextInput` to create a `ValidatedTextInput` widget with an error message and `onValidate` method' %}

Re-creating the same error message boilerplate for multiple text inputs seems overly repetitive, so we're going to extend `TextInput` instead. This will also allow us to have better control over when validation occurs, e.g. by adding it to blur events as well. For now, just create a `ValidatedTextInput` widget that accepts the same properties interface as `TextInput` but with an `errorMessage` string and `onValidate` method. It should return the same node structure modeled above.

You will also need to create `validatedTextInput.m.css` with `error` and `inputWrapper` classes, although we will forgo adding specific styles in this tutorial:

```css
.inputWrapper {}

.error {}
```

{% solution showsolution4 %}
```ts
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { TypedTargetEvent } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import TextInput, { TextInputProperties } from '@dojo/widgets/text-input';
import * as css from '../styles/validatedTextInput.m.css';

export interface ValidatedTextInputProperties extends TextInputProperties {
	errorMessage?: string;
	onValidate?: (value: string) => void;
}

export const ValidatedTextInputBase = ThemedMixin(WidgetBase);

@theme(css)
export default class ValidatedTextInput extends ValidatedTextInputBase<ValidatedTextInputProperties> {
	private _errorId = uuid();

	protected render() {
		const {
			disabled,
			label,
			maxLength,
			minLength,
			name,
			placeholder,
			readOnly,
			required,
			type = 'text',
			value,
			invalid,
			errorMessage,
			onBlur,
			onInput
		} = this.properties;

		return v('div', { classes: this.theme(css.inputWrapper) }, [
			w(TextInput, {
				aria: {
					describedBy: this._errorId
				},
				disabled,
				invalid,
				label,
				maxLength,
				minLength,
				name,
				placeholder,
				readOnly,
				required,
				type,
				value,
				onBlur,
				onInput
			}),
			invalid === true ? v('span', {
				id: this._errorId,
				classes: this.theme(css.error),
				'aria-live': 'polite'
			}, [ errorMessage ]) : null
		]);
	}
}
```
{% endsolution %}

You may have noticed that we created `ValidatedTextInput` with an `onValidate` property, but we have yet to use it. This will become important in the next few steps by allowing us to have greater control over when validation occurs. For now, just treat it as a placeholder.

{% instruction 'Use `ValidatedTextInput` within `WorkerForm`' %}

Now that `ValidatedTextInput` exists, let's import it and swap it with `TextInput` in `WorkerForm`, and write some error message text while we're at it:

**Import block**
{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:1-7 %}

**Inside render()**
{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:74-110 %}

{% task 'Create `onFormValidate` method separate from `onFormInput`' %}

{% instruction 'Update the context to pass in an `onFormValidate` method' %}

Currently the validation logic is unceremoniously dumped in `formInput` within `ApplicationContext.ts`. Now let's break that out into its own `formValidate` function, and borrow the `onFormInput` pattern to pass `onFormValidate` to `WorkerForm`. There are three steps to this:

1. Add a `formValidate` method to `ApplicationContext.ts` and update `_formErrors` there instead of in `formInput`:
	{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:71-79 %}
2. Update `WorkerFormContainer` to pass `formValidate` as `onFormValidate`:
	{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerFormContainer.ts' lines:6-22 %}
3. Within `WorkerForm` first add `onFormValidate` to the `WorkerFormProperties` interface:
	{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:21-27 %}
	Then create internal methods for each form field's validation and pass those methods (e.g. `onFirstNameValidate`) to each `ValidatedTextInput` widget. This should follow the same pattern as `onFormInput` and `onFirstNameInput`, `onLastNameInput`, and `onEmailInput`:
	{% include_codefile 'demo/finished/biz-e-corp/src/widgets/WorkerForm.ts' lines:51-61 %}

{% instruction 'Handle calling `onValidate` within `ValidatedTextInput`' %}

You might have noticed that the form no longer validates on user input events. This is because we no longer handle validation within `formInput` in `ApplicationContext.ts`, but we also haven't added it anywhere else. To do that, add the following private method to `ValidatedTextInput`:

```ts
private _onInput(value: string) {
	const { onInput, onValidate } = this.properties;
	onInput && onInput(value);
	onValidate && onValidate(value);
}
```

Now pass it to `TextInput` in place of `this.properties.onInput`:
```ts
w(TextInput, {
	aria: {
		describedBy: this._errorId
	},
	disabled,
	invalid,
	label,
	maxLength,
	minLength,
	name,
	placeholder,
	readOnly,
	required,
	type,
	value,
	onBlur,
	onInput: this._onInput
})
```

Form errors should be back now, along with error messages for invalid fields.

{% section %}

## Making use of the blur event

{% task 'Only begin validation after the first blur event' %}

Right now the form displays validation as soon as the user begins typing in a field, which can be a poor user experience. Seeing "invalid email address" types of errors at the beginning of typing an email is both unnecessary and distracting. A better pattern would be to hold off on validation until the first blur event, and then begin updating the validation on input events.

{% aside 'Blur events' %}
The [blur](https://developer.mozilla.org/en-US/docs/Web/Events/blur) event fires when an element loses focus.
{% endaside %}

Now that calling `onValidate` is handled within the `ValidatedTextInput` widget, this is possible.

{% instruction 'Create a private `_onBlur` function that calls `onValidate`' %}

In `ValidatedTextInput.ts`:
```ts
private _onBlur(value: string) {
	const { onBlur, onValidate } = this.properties;
	onValidate && onValidate(value);
	onBlur && onBlur();
}
```

We only need to use this function on the first blur event, since subsequent validation can be handled by `onInput`. The following code will use either `this._onBlur` or `this.properties.onBlur` depending on whether the input has been previously validated:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/ValidatedTextInput.ts' lines:52-69 %}

Now all that remains is to modify `_onInput` to only call `onValidate` if the field already has a validation state:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/ValidatedTextInput.ts' lines:26-33 %}

Try inputting an email address with these changes; it should only show an error message (or green border) after leaving the form field, while subsequent edits immediately trigger changes in validation.

{% section %}

## Validating on submit

{% task 'Create mock server-side validation when the form is submitted' %}

Thus far our code provides nice hints to the user, but does nothing to prevent bad data being submitted to our worker array. We need to add two separate checks to the `submitForm` action:

1. Immediately fail to submit if the existing validation function catches any errors.
2. Perform some additional checks (in this case we'll look for email uniqueness). This is where we would insert server-side validation in a real app.

{% instruction 'Create a private `_validateOnSubmit` method in `ApplicationContext.ts`' %}

The new `_validateOnSubmit` should start by running the existing input validation against all `_formData`, and returning false if there are any errors:

```ts
private _validateOnSubmit(): boolean {
	const errors = this._validateInput(this._formData);
	this._formErrors = deepAssign({ firstName: true, lastName: true, email: true }, errors);

	if (this._formErrors.firstName || this._formErrors.lastName || this._formErrors.email) {
		console.error('Form contains errors');
		return false;
	}

	return true;
}
```

Next let's add an extra check: let's say each worker's email must be unique, so we'll test the input email value against the `_workerData` array. Realistically this check would be performed server-side for security:

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:52-69 %}

After modifying the `submitForm` function in `ApplicationContext.ts`, only valid worker entries should successfully submit. We also need to clear `_formErrors` along with `_formData` on a successful submission:

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:81-91 %}

{% section %}

## Summary

There is no way this tutorial could cover all possible use cases, but the basic patterns for storing, injecting, and displaying validation state provide a strong base for creating more complex form validation. Some possible next steps include:

- Configuring error messages in an object passed to `WorkerForm`
- Creating a toast to display submission-time errors
- Add multiple validation steps for a single form field

The finished [demo application](../assets/1015_form_validation-finished.zip) is available to review and play with.

{% section 'last' %}
