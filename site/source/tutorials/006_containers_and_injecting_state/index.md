---
layout: false
title: Containers and Injecting State
overview: In this tutorial, you will learn what a Container and Injector are and how to use them to manage external state and inject this into the parts of the widget tree.
---

# Containers and Injectors, working with State.

## Overview
This tutorial will extend on the [previous](../005_form_widgets/) tutorial where we demonstrated how to create form widgets and lift up state to a common shared parent. In this tutorial, we will extract that state from the application managing it externally using `Containers` to connect our widgets to an `Injector` that will provide inject configured state.

## Prerequisites
You can [download](../assets/005_form_widgets-initial.zip) the demo project to get started.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

## Creating our Application Context
The first step for creating our application context is to identify the state that we need to extract to be managed outside of the widget hierarchy. This should be simple enough thanks to lifting up the state in the previous tutorial.

// create new module `ApplicationContext` that has an API required to work with the application state.

Now we can take the state that we lifted up in our previous example and use it to create an `applicationContext`

// show creating the application context in main.ts

## Registering an Injector

Now that we have out application context we need use this to create an `Injector` and register this with the registry (for more details check out our [registry tutorial](../comingsoon.html).

To do this we need to import the `BaseInjector` and the `Injector` mixin that can be used to create the injector class to define against a known label with the registry.

// Add the imports for BaseInjector, Injector and registry. Create the Injector using the context and define against registry.

## Creating State Containers

// Talk about creating the container modules and how to inject properties using the get properties mapper.

## Adding Containers to App

// Briefly cover how the widgets can be swapped out with Containers

## Summary

Summarise lift state outside of the widget components, registering an injector with an context that can hold state and/or a functional API and swapping out the existing widgets for the newly created containers.