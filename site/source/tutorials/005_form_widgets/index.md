---
layout: false
title: Form Widgets
overview: In this tutorial, you will do things.
---
# Forms n stuff!
---
## Changes to 004 code:
- Moved worker data to App, which is passed to WorkerContainer as a property
- Added a key to each worker (recommended for multiple widgets with the same constructor or VNodes with the same tag)
- Switched worker.jpg to worker.svg to have a sharp image
- In Worker, nested front and back inside a wrapping div to allow the flip animation. Now `this.isFlipped` controls which class is added to the root div.
- Updated styles, all of which are available without 005-specific code in [this branch](https://github.com/smhigley/dojo.io/tree/flip-animation).
	- Switched WorkerContainer and Worker to use flexbox
	- Currently they wrap and stay aligned center, but if left justification is preferred, that can be changed
	- Some minor text sizing, alignment and spacing changes to make the back layout more readable
	- Added the card flip css animation, controlled by toggling `styles.reverse` on Worker.

## 005 code
- App is used as the single source of truth for the application, so it has both the worker data and form state
- Form values are handled in `state`, so the StatefulMixin was added to App
- It passes field values and validity into WorkerForm as properties. This could be modified to pass all data for form fields (including which form widget constructor) into WorkerForm, but I thought the current approach with specific fields would be simplest to understand and explain.
- App passes handlers for onChange (update form values), onBlur (validate), and onSubmit (add worker) to WorkerForm
	- Important to note: event handlers set on a VNode can't be reassigned (it's a Maquette restriction). So `WorkerForm.properties.onSubmit` needs to be called in a private `WorkerForm._onSubmit` function, which is then passed to `v('form')`. TextInput widgets already handle this internally, so they can have anonymous functions passed directly to their `onChange` and `onBlur` properties.
- First and Last name are grouped in a `fieldset` with individual hidden labels for better accessibility
- If you want to talk about styling existing widgets from `@dojo/widgets`, it would be easy to add something like `.inputWrapper` to `workerForm.css`, and add `overrideClasses: styles` to the TextInput widgets.
