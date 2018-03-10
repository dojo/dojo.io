---
layout: tutorial
title: State management
overview: Learn what Containers and Injectors are.  Use them to manage external state and inject that state into widget properties.
paginate: true
---

{% section 'first' %}

# State management

## Overview

Modern web applications are often required to manage complex state models which can involve fetching data from a remote service or multiple widgets requiring the same slices of state. While Dojo 2's widgets can manage application state, encapsulation and a clean separation of concerns may be lost if widgets manage their own visual representations, listen for interactions from the user, manage their children, and keep track of state information. Additionally, using widgets to pass state through an application often forces the widgets to be aware of state information for the sole purpose of passing that data down to their children. To allow widgets to remain focused on their primary roles of providing a visual representation of themselves and listening for user interactions, Dojo 2 provides two classes, `Container` and `Injector`, that are designed to coordinate an application's external state and connect and map this state to properties.

In this tutorial, we will start with an application that is managing its state in the widgets themselves. We will then extract all of the state-related code out of the widgets and inject external state as properties only into widgets as is needed. You can [download](../assets/1010_containers_and_injecting_state-initial.zip) the demo project to get started.

## Prerequisites

This tutorial assumes that you have gone through the [beginner tutorial](../001_static_content) series.

{% section %}

## Creating an application context

{% task 'Create a class to manage application state.' %}

To begin our tutorial, let's review the initial version of `App`:

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/App.ts' %}

Most of this widget is dedicated to holding and managing the `WorkerData` in the application. Notice, however, that it never actually uses that data itself. `App` is only containing the state and passing it to the children as required via properties. Lifting up state to the highest common widget in the tree is a valid pattern, but as an application's state grows in size and complexity, it is often desirable to decouple this from widgets. In larger applications, the `App` class would become complicated and more difficult to maintain due to the additional state information that it would be required to track. Since the state information is not a primary concern of the `App` class, let's refactor it out of `App` and into a new `ApplicationContext` class that extends the base `Injector`.

{% instruction 'Add the following to the existing `ApplicationContext.ts` file in the `src` directory' %}

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' %}

{% aside 'Invalidations' %}
Dojo 2 Widgets can invoke `invalidate()` directly, however a non-widget can only emit an event with: `this.emit({ type: 'invalidate' })`
{% endaside %}

The code begins by importing some modules, including the `WorkerProperties` and `WorkerFormData` interfaces defined in the `Worker` and `WorkerForm` modules. These two interfaces define the shape of state that the `ApplicationContext` manages.

The `ApplicationContext` contains the application state information. The base `Injector` class exposes a public method `get` that is used to determine what will be injected, by default the `get` method returns the value that is passed on `Injector` construction, i.e. `new Injector(myValueToInject);`. However, as the `ApplicationContext` is itself the value the needs to be injected, the `get` method can be overridden to return the instance of `ApplicationContext`.

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:37-39 %}

 `ApplicationContext` also has two private fields, `_workerData` and `_formData`, which contain the state, and two accessor methods to retrieve these fields.

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:26-35 %}

The `formInput` method provides the same functionality as the `_onFormInput` method in the `App` class and the `submitForm` method is analogous to the `_addWorker` method from the `App` class. The implementations vary slightly as the `ApplicationContext` has dedicated fields to store the state information. Also, since the `ApplicationContext` is not a widget, it cannot call `invalidate();` to schedule a re-render. Instead the instance needs to emit an `invalidate` event that instructs associated widgets to `invalidate` themselves.

Notice that the `ApplicationContext` does not contain any code to load state information. Currently its only role is only to manage the application's state provided on initialization via its `constructor`. However as the requirements for the application become more advanced, the `ApplicationContext` could make requests to fetch and modify data from a remote service or local storage mechanism.

Now that we have moved state management to a dedicated module, we need a way to register the state and connect it to sections of our application. We will do this by creating a registry and registering the `ApplicationContext` injector.

{% section %}

## Injectors

{% task 'Register an `Injector` that will allow state to be injected into widgets.' %}

Currently, the application's `main` module is only responsible for creating the `Projector`, which provides the bridge between the application code and the DOM.

{% include_codefile 'demo/initial/biz-e-corp/src/main.ts' %}

Now, we need to:

1. Update the `main` module to construct and populate an instance of `ApplicationContext`
2. Create a `registry` and then define the `ApplicationContext` as an injector in the registry
3. To make the `registry` available within the widget tree, we need to pass the `registry` as a property to the `projector`

{% instruction 'Import the `ApplicationContext` module and add this code to the `main` module:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:4,9-28 %}

{% aside 'Loading data' %}
In a real-world application, this data would probably be loaded via a call to a web service or a local data store. To learn more, take a look at the [stores tutorial](../comingsoon.html).
{% endaside %}

The state stored in the `ApplicationContext` is the same data that was used in the previous version of the `App` module to initialize the `WorkerProperties`, but it is now decoupled into an isolated module that helps to understand and maintain the application. In general, the `main` module of an application should be concerned with initializing application-wide state. Also, as previously mentioned, the `App` class only needed to manage the `WorkerProperties` state so that it could coordinate change to its children.

Now that we have the `ApplicationContext` instance, let's use it within our widgets. This is done by making the `ApplicationContext` available to the widgets via a `registry`.

{% instruction 'Add the `Registry` import to the `main` module.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:2 %}

{% instruction 'Now, add the following after the `applicationContext` declaration.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:30,31 %}

The first statement creates a `registry` where the application context can be registered. The second statement registers the `ApplicationContext` instance with the newly created registry. The registry provides a way to register a widget via a label, making it accessible to other parts of the application. You can learn more in the [registry tutorial](../1020_registries/).

{% instruction 'Add the registry to the projector' %}

We need to pass the `registry` to the `projector` via the `setProperties` method to ensure that it is available for all widget and container instances.

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:35 %}

Now that the `Injector` is defined and registered and the `registry` has been set in the `projector`, it is time to create the components that will use it. In the next section, we will create a non-visual widget called a `Container` that will allow state to be injected into the `WorkerForm` and `WorkerContainer` widgets.

{% section %}

## Creating state containers

{% task 'Create `Containers` that will allow state to be injected into widgets' %}

On their own, `Injectors` are not able to help us very much because widgets expect state to be passed to them via properties. Therefore an `injector` must be connected to interested widgets in order for their state to be mapped to `properties` that widgets can consume by using a `Container`. `Containers` are designed to coordinate the injection - they connect `injectors` to widgets and return `properties` from the `injector`'s state which are passed to the connected widgets.

Normally, a separate `Container` is created for each widget that needs to have `properties` injected. In the demo application, we have two widgets that rely on application state - `WorkerContainer` and `WorkerForm`.

Let's start with the `WorkerContainer`. As a best practice, you should give your containers the same name as their respective widgets, with a `Container` suffix.

E.g. Widget name: `Foo`
container name ‘FooContainer’. To keep things organized, they are also stored in a different directory - `containers`.

{% instruction 'Add the following imports to the `WorkerContainerContainer` in the `containers` directory' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerContainerContainer.ts' lines:1-4 %}

* The first `import` gives the module access to the `Container` factory function which will be used to construct the container.
* The second `import` allows the module to use the `ApplicationContext` to extract state
* The third import enables the `WorkerContainerProperties` to receive properties from its parent, and wrap the `WorkerContainer` class with the `container`.

Next, we need to address the fact that the container has two places to get properties from - its parent widget and the `ApplicationContext`. To tell the container how to manage this, we will create a function called `getProperties`.

{% instruction 'Add the `getProperties` function to the `WorkerContainerContainer` module.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerContainerContainer.ts' lines:6-8 %}

The `getProperties` function receives two parameters. The first is the `payload` of the `injector` instance returned by the `injector`s `get()` method. For the demo application, this is the instance of the `ApplicationContext` returned when we override the base `Injector` class' default `get()` method to return itself. The second is the `properties` that have been passed to the container via the normal mechanism, `w(Container, properties)`. The properties will implement the properties interface defined by the wrapped widget (for example `WorkerContainerProperties`). The `getProperties` function must then return an object that holds the properties that will be passed to the widget itself. In this example, we are ignoring the properties provided by the parent and returning the `workerData` stored by the `ApplicationContext`. More advanced use cases where both sources are used to generate the properties are also possible.

{% instruction 'Finish the `WorkerContainerContainer` by adding the following code.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerContainerContainer.ts' lines:10-12 %}

These final lines define the actual `WorkerContainerContainer` class and exports it. The `Container` function creates the class by accepting three parameters:

* The widget's class definition (alternatively, a widget's registry key can be used)
* The registry key for the `Injector`
* An object literal that provides the mapping functions used to reconcile the two sets of properties and children that the container can receive (one from the `Injector` and one from the parent widget). The returned class is also a widget as it descends from `WidgetBase` and therefore may be used just like any other widget.

The other container that we need is the `WorkerFormContainer`.

{% instruction 'Add the following code to the `WorkerFormContainer` module in the `containers` sub-package.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerFormContainer.ts' %}

This module is almost identical to the `WorkerContainerContainer` except for additional properties that are required by the `WorkerForm` to allow it to respond to user interactions with the form. The `ApplicationContext` contains two methods for managing these events - `onFormInput` and `onFormSave`. These methods need to be passed into the `WorkerForm` to handle the events, but they need to execute in the context of the `ApplicationContext`. To handle this, `bind` is called on each of the methods to explicitly set their execution contexts.

At this point, we have created the `ApplicationContext` to manage state, an `Injector` to inject state into the application's widgets, and `Containers` to manage how properties and children from the injector and parent widgets are combined. In the next section, we will integrate these components into our application.

{% section %}

## Using state containers

{% task 'Integrate containers into an application.' %}

As mentioned in the previous section, `Container` is a higher order component that extends `WidgetBase` and returns the wrapped widget and injected `properties` from the `render`. As such, it can be used just like any other widget. In our demo application, we can take advantage of its extension of `WidgetBase` by simply replacing the `WorkerForm` and `WorkerContainer` with their container equivalents.

{% instruction 'Replace the imports in the `App` module with the following.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:1-5 %}

There are two major changes to the `App` module's imports. First, the widgets (`WorkerForm` and `WorkerContainer`) have been replaced by their container equivalents (`WorkerFormContainer` and `WorkerContainerContainer`). Second, all of the interfaces, `WorkerFormData`, and `WorkerProperties` have been removed. These are no longer needed since the `App` class no longer needs to manage state.

Also, the property and methods within `App` that are setting and managing state can be removed.

{% instruction 'Remove the following code from the `App` class.' %}

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/App.ts' lines:9-44 %}

The final change to `App` is to update the `render` method to use the containers. Since the containers already know how to manage their state and respond to events, no properties need to be passed directly to the `Container` by the `App` widget.

{% instruction 'Replace the `render` method with the following code.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:9-15 %}

With this last change, the `App` class is now only nine lines of code. All of the state management logic is still part of the application, but it has been refactored out of the `App` class to create a more efficient application architecture.

Notice that the `WorkerForm` and `WorkerContainer` widgets were not changed at all! This is an important thing to keep in mind when designing widgets - a widget should never be tightly coupled to the source of its properties. By keeping the containers and widgets separate, we have helped to ensure that each widget or container has a narrowly defined set of responsibilities, creating a cleaner separation of concerns within our widgets and containers.

At this point, you should reload your page and verify the application is working.

{% section %}

## Summary

Since Dojo 2 widgets are TypeScript classes, they are capable of filling a large number of roles, including state management. With complex widgets, however, combining the responsibilities to manage the widget's visual representation as well as the state of its children can make them difficult to manage and test. Dojo 2 defines `Injectors` and `Containers` as a way to externalize state management from the app and centralize that management into classes that are designed specifically to fill that role.

If you would like, you can download the finished [demo application](../assets/1010_containers_and_injecting_state-finished.zip) to review.

{% section 'last' %}
