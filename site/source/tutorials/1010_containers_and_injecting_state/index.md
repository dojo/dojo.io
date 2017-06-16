---
layout: tutorial
title: State management
overview: In this tutorial, you will learn what a Containers and Injectors are and how to use them to manage external state and inject this into the parts of the widget tree.
---

{% section 'first' %}

# State management

## Overview

Almost all non-trivial applications must have multiple states that they can exist in. While Dojo 2's widgets can manage application state, they can quickly become overburdened as they manage their own visual representations, listen for interactions from the user, as well as manage their children and their state information. Additionally, using widgets to pass state information through an application often forces widgets to be aware of application state for the sole purpose of passing that state down to their children. To allow widgets to remain focused on their primary roles of providing a visual representation of themselves and listening for user interactions, Dojo 2 provides `Containers` and `Injectors` that are designed to manage an application's state and provide that information only to the widgets that require it.

In this tutorial, we we start with an application that is using widgets to manage its state. We will then extract all of the state-related code out of the widgets and inject it into the widgets need to be aware of it.

## Prerequisites
You can [download](../assets/1010_form_widgets-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Creating an application context

{% task 'Create a class to manage application state.' %}

To begin our discussion, let's take a look at the initial version of `App`:

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/App.ts' %}

Most of this widget is dedicated to holding and managing the `WorkerData` in the application. Notice, however, that it never actually uses that data itself. `App` is only holding the data so that its children can access it. While this may be acceptable in a small application, in larger applications, the `App` class can become overwhelmed by the amount of state information that it is tracking. Since the state information not a primary concern of the `App` class, let's refactor it out to a new class.

{% instruction 'Add the following to `ApplicationContext.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' %}

The code begins by importing some modules, including the `WorkerProperties` and `WorkerFormData` interfaces defined in the `Worker` and `WorkerForm` modules. These two interfaces define the state that the `ApplicationContext` is going to track. One important item to note is that the `ApplicationContext` is aware of the widgets, but the widgets are not aware of the `ApplicationContext` module. It is important to import the modules this way since it keeps the widgets independent of the source of their properties.

After the imports, we have redefined the `defaultWorkerForm`. This is identical to the `defautlForm` from the `App` module and is used for the same purpose - to reset the form data when a new `Worker` is created.

The `ApplicationContext` class contains the state information. It contains two private fields, `_workerData` and `_formData` that will contain the state as well as two accessor methods to retrieve those fields. Finally, notice the two public methods that `ApplicationContext` exposes:

{% include_codefile 'demo/finished/biz-e-corp/src/ApplicationContext.ts' lines:32-41 %}

The `formInput` method is providing the same functionality that the `_onFormInput` method in the `App` class is and the `submitForm` method is doing the same thing that `App#_addWorker` is. The implementations are slightly different since the `ApplicationContext` has dedicated fields that are storing the state information. Also, since the `ApplicationContext` is not a widget, it needs to emit an `invalidate` event to inform the application it needs to schedule a render cycle.

Notice that the `ApplicationContext` does not have any code to load state information. Its role is only to manage the application's state. Any data that the application should start with must be provided to the `ApplicationContext`, possible via its `constructor` while the application is being started.

Now that we have moved state management to a dedicated module, we need a way to initialize the state and make it available to be consumed. We will do that in the next section where we will create and register an `Injector`.

{% section %}

## Injectors

{% task 'Register an `Injector` that will allow state to be injected into widgets.' %}

Currently, the application's `main` module is only responsible for creating the `Projector`, which provides the bridge between the application code and the DOM.

{% include_codefile 'demo/initial/biz-e-corp/src/main.ts' %}

Now, we need to update `main` to construct and populate the `ApplicationContext` as well as register that context so that it is accessible to the rest of the application.

{% instruction 'Import the `ApplicationContext` module and add this code to `main`:' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:10-29 %}

{% aside 'Loading data' %}
In a real-world application, this data would probably be loaded via a call to a web-service or a local datastore. To learn more, take a look at the [data stores tutorial](../comingsoon.html).
{% endaside %}

This is the same data that we used in the `App` module to initialize the `WorkerProperties`, but it is now in a more appropriate location. In general, the `main` module of an application should be concerned with initializing application-wide state. Also, as we mentioned earlier, the `App` class only needed the `WorkerProperties` because its children needed them.

Now that we have the `ApplicationContext`, it is time to allow it to be used by widgets. To do that, we need to create an `Injector` and add it to the application's central widget registry. `Injectors` are created using the `Injector` factory function from `@dojo/widget-core`.

{% instruction 'Add the following imports to the `main` module.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' lines:2-3 %}

{% instruction 'Now, add the following after the `applicationContext` declaration.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:31 %}

This statement does two things. First, it uses the `Injector` factory function to wrap the `applicationContext` with the `BaseInjector`, a lightweight component allows any object that extends the `Evented` base class to be injected via a `Container`. We will talk more about `Containers` in the next section. This statement also registers the `Injector` with the application's central registry. The registry provides a way to register a widget via a label, making it accessible to other parts of the application. You can learn more in the [registry tutorial](../comingsoon.html).

Now that the `Injector` is defined and registered, it is time to create the components that will use it. In the next section, we will create a special type of non-visual widget called a `Container` that will allow state to be injected into the `WorkerForm` and `WorkerContainer` widgets.

{% section %}

## Creating state containers

{% task 'Create `Container` widgets that will allow state to be injected into widgets' %}

On their own, `Injectors` are not able to help use very much because widgets expect state to be pushed into them (via their properties), but state must be pulled from an `Injector`. `Containers` are designed to do that - they pull state from injectors and push it into widgets.

Normally, a separate `Container` is created for each widget that needs to have state injected. In the demo application, we have two widgets that rely on application state - `WorkerContainer` and `WorkerForm`. Let's start with the `WorkerContainer`. `Containers` are given the same name as the widget that they contain with the suffix `Container` appended. To keep things organized, they are also stored in a different sub-package - `containers` instead of `widgets`.

{% instruction 'Add the following imports to the `WorkerContainerContainer` in the `containers` sub-package' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerContainerContainer.ts' lines:1-4 %}

The first import gives the module access to the `Container` factory function which will be used to construct the container. The other imports allow the module to use the use the `ApplicationContext` to extract state, combine that state with the `WorkerContainerProperties` that are passed into the `WorkerContainer` from its parent, and the `WorkerContainer` class that will be wrapped by the container.

Next, we need to address the fact that the container has two places to get properties from - its parent widget and the `ApplicationContext`. To tell the container how to manage this, we will create a function called `getProperties`.

{% instruction 'Add the `getProperties` function to the `WorkerContainerContainer` module.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerContainerContainer.ts' lines:6-8 %}

The `getProperties` function receives two parameters - and instance of an `Evented` class that holds the state information (`ApplicationContext` in this example) and an object that implements the `WidgetProperties` interface, or one of its descendants (we are using `WorkerContainerProperties`). The `ApplicationContext` is retrieved from the `Injector` and the second is provided by the widget's parent. The `getProperties` function must then return an object that holds the properties that will be provided to the widget itself. In this example, we are ignoring the properties provided by the parent and returning the `workerData` held by the `ApplicationContext`, but more complicated use-cases where both sources are used to generate the properties are also possible.

{% aside 'Additional injection options' %}
`Injectors` are capable of injecting more than just properties into a widget. A `getChildren` mapping function can also provided to the `Container`, allowing children to be injected into the widget as well. Just like the `getProperties` function, the `getChildren` function will receive the children from the parent widget and the injector. It then returns the final array of children that will be provided to the widget.
{% endaside %}

{% instruction 'Finish the `WorkerContainerContainer` by adding the following code.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerContainerContainer.ts' lines:10-12 %}

These final lines define the actual `WorkerContainerContainer` class and export it as the module default. The `Container` function creates the class by taking in three parameters - the widget's class definition (alternatively, a widget's registry key can be used), the registry key for the `Injector`, and an object literal that provides the mapping functions used to reconcile the two set of properties and children that the container can receive (one from the `Injector` and one from the parent widget). The returned class is, in fact, a widget (i.e. it descends from `WidgetBase`) and, therefore, can be used just like any other widget.

The other container that we need is the `WorkerFormContainer`.

{% instruction 'Add the following code to the `WorkerFormContainer` module in the `containers` sub-package %}

{% include_codefile 'demo/finished/biz-e-corp/src/containers/WorkerFormContainer.ts' %}

This module is almost identical to the `WorkerContainerContainer` except that additional properties are required by the `WorkerForm` to allow it to signal the user has entered information into the form. The `ApplicationContext` contains two methods for managing these events - `onFormInput` and `onFormSave`. These methods need to be passed into the `WorkerForm` to handle the events, but they need to execute in the context of the `ApplicationContext`. To handle this, `bind` is called on each of the methods to explicitly set their execution contexts.


At this point, we have create the `ApplicationContext` to manage state, an `Injector` to inject state into the application's widgets, and `Containers` to manage how properties and children from the injector and parent widgets are combined. In the next section, we will integrate these components into our application.

{% section %}

## Using state containers

{% task 'Integrate containers into an application.' %}

As mentioned in the previous section `Containers` are specialized form of widget since they descend from `WidgetBase`. Given that, they can be used just like any other widget. In our demo application, we can take advantage of that fact by simply replacing the `WorkerForm` and `WorkerContainer` with their container equivalents.

{% instruction 'Replace the imports in the `App` module with the following.' %}

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/App.ts' lines:1-6 %}

There are two major changes to the `App` modules imports. First, the widgets (`WorkerForm` and `WorkerContainer`) have been replaced by their container equivalents (`WorkerFormContainer` and `WorkerContainerContainer`). The second change is that all of the objects related to state management have been removed, `StatefulMixin`, `WorkerFormData`, and `WorkerProperties`. These are no longer needed since the `App` class no longer needs to manage state.

Since the `StatefulMixin` is no longer required, `App` can now descend directly from `WidgetBase`.

{% instruction 'Remove `AppBase` and change `App` to descend from `WidgetBase`.' %}

The new class declaration for `App` should be:

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' line:18 %}

Also, the property and methods within `App` that we setting and managing state can be removed.

{% instruction 'Remove the following code from the `App` class.' %}

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/App.ts' lines:20-48 %}

The final change to `App` is to update the `render` method to use the containers. Since the containers already know how to set their state and respond to events, no properties need to be passed to them by the `App` widget.

{% instruction 'Replace the `render` method with the following code.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/App.ts' lines:10-16 %}

With this last change, the `App` class is now only nine lines of code. All of the state-management logic is still part of the application, but it has been factored out of the `App` class, which did not need it.

Notice that throughout all of these changes, the `WorkerForm` and `WorkerContainer` were not changed at all. This is an important thing to keep in mind when designing widgets - a widget should never be concerned about where its properties come from, that is what containers are for. By keeping the containers and widgets separate, we have ensure that they each have a narrowly defined set of responsibilities, making them both easier to reuse, test, and maintain.

{% section %}

## Summary

Since Dojo 2 widgets are TypeScript classes, they are capable of filling a large number of roles, including state management. With complex widgets, however, combining the responsibilities to manage the widget's visual representation as well as the state of its children can make them difficult to manage and test. Dojo 2 defines `Injectors` and `Containers` as a way to externalize state management from the app and centralize that management into classes that are designed specifically to fill that role.

If you would like, you can download the [demo application](../assets/1010_form_widgets-finished.zip).

{% section 'last %}
