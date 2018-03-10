---
title: Your first Dojo 2 application
layout: tutorial
overview: Create your first Dojo 2 application and use it to print a simple message in the browser.
paginate: true
---

{% section 'first' %}

# Your first Dojo 2 application

## Overview
In this tutorial, you will learn how to the create your first Dojo 2 application and use it to print a simple message in the browser.

## Prerequisites
You can [download](../assets/001_static_content-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../../docs/fundamentals/typescript_and_dojo_2/) article.

{% section %}

## Starting the development server

{% task 'Build and run the application.' %}

Before we start making changes, let's start the application with the development server so that we can observe the impact of our changes. Run the following command in the application's root directory:

`dojo build --mode dev --watch memory --serve`

or using the abbreviated parameters:

`dojo build -m dev -w memory -s`

Now, open up a web browser to [http://localhost:9999](http://localhost:9999) to view the current application.

In the next step, we will start to customize the application.

{% section %}

## Page content

{% task 'Change what is rendered to the page.' %}

To start customizing the application, let's remove the existing content. There are two places we need to go to do this. The first line, "Welcome to biz-e-corp" is being generated from `index.html`.

{% instruction 'Open `index.html` file in the `src` directory and remove the `<p>` tag and its content, "Welcome to biz-e-corp".' %}

Notice that the page has automatically updated for us. That means that we can immediately see the impact of the change without having to stop our work and refresh or rebuild the application.

Now, let's remove the "Hello, Dojo World!" message.

{% instruction 'Open `HelloWorld.ts`, located in `/src/widgets`.' %}

You should see something like this:

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/HelloWorld.ts' %}

Some of this code may not make sense now, but over the next few tutorials, you will find out what all of it means. For now, let's focus on this line:

{% include_codefile 'demo/initial/biz-e-corp/src/widgets/HelloWorld.ts' line:6 %}

The `v` function simply instructs Dojo 2 to create an HTML element, in this case a `<div>` element with the text "Hello, Dojo World!" inside of it. We will build a view that allows the user to view Biz-E Corp's workers, so let's update the tag and message to something more appropriate.

{% instruction 'Replace the `<div>` tag with an `<h1>` tag, and replace "Hello, Dojo World!" with "Biz-E-Bodies"' %}

{% instruction 'When you are finished, click on show solution to see the results.' %}

{% solution showsolution1 %}
```typescript
export default class HelloWorld extends WidgetBase {
	protected render() {
		return v('h1', [ 'Biz-E-Bodies' ]);
	}
}
```
{% endsolution %}

Now, let's look at the `v` function again. We are intentionally avoiding something like `document.createElement` to create DOM ([Document Object Model](https://en.wikipedia.org/wiki/Document_Object_Model)) elements. This is because we are not directly creating a DOM element. Instead, we are creating a representation of the view in TypeScript and letting Dojo 2 efficiently determine how to convert it into DOM elements that are rendered onto the page. This rendering technique is called using a *virtual* DOM.

In traditional web applications, keeping the DOM and JavaScript application logic in sync led to significant complexity and inefficiency for non-trivial applications. When building applications with numerous changes to state and data, the virtual DOM approach can greatly simplify your application logic and improve performance. A virtual DOM serves as an intermediary between your application logic and what is rendered in the real DOM on the page.

Dojo 2 leverages its own virtual DOM library, to determine the most efficient way to interact with the DOM elements in your view. An additional benefit of the virtual DOM is that it facilitates a reactive programming style which simplifies your application. To learn more about the virtual DOM or reactive programming in Dojo 2, check out the [Working with a Virtual DOM](../../docs/fundamentals/working_with_virtual_dom/) and [Reactive Programming](../../docs/fundamentals/reactive_programming/) articles in the reference section. For now, let's get back to our application and make some more changes.

In the final part of this tutorial, we will learn how to set properties on virtual DOM nodes.

{% section %}

## Virtual DOM properties

{% task 'Set properties on virtual DOM nodes.' %}

Now we will add some additional attributes to the `<h1>` element we created earlier in `HelloWorld.ts`. These attributes can be passed in the second argument to the `v` function.

{% instruction 'Update the `v` function call, with a `title` attribute like this.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/HelloWorld.ts' line:6 %}

{% aside 'Virtual Dom Properties and Attributes' %}
The vdom system will automatically add properties with a type of `string` as an attribute and other values as properties on the DOM node.
{% endaside %}

Notice that we have added a parameter between the tag and content parameters. The object used as the second parameter can set any attributes or properties on the element being created. This method of using JavaScript or TypeScript to create DOM elements is called [HyperScript](https://github.com/hyperhype/hyperscript) and is shared by many virtual DOM implementations.

{% section %}

## Summary

Congratulations! You are off to a good start on your journey to master Dojo 2. In [Components of a Dojo 2 application](../002_creating_an_application/), we will start to get familiar with the major components of a Dojo 2 application.

If you would like, you can download the completed [demo application](../assets/001_static_content-finished.zip) from this tutorial.

{% section 'last' %}
