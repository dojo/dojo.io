---
title: Your first Dojo 2 application
layout: tutorial
editorUrl: https://embed.plnkr.co/DWwvSO/?show=src/widgets/HelloWorld.ts,preview&preview=index.html
overview: In this tutorial, you will learn how to the create your first Dojo 2 application and use it to print a simple message in the browser.
---

# Your first Dojo 2 application

## Overview
In this tutorial, you will learn how to the create your first Dojo 2 application and use it to print a simple message in the browser.

## Prerequisites
With the Dojo 2 tutorial series, you may work with the examples following two different paths:

* A browser embedded editor
* A local installation

The browser embedded editor is intended to make it easy to quickly see the examples in action, but does not match a normal development environment, and does not provide all of the benefits of TypeScript.

If you prefer a local installation, please visit the [Dojo 2 Installation Guide](../000_local_installation/) before proceeding further with this tutorial.

Whether you are working locally or using the embedded editor, you need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

## Demo files
If you are following along locally, you can [download](../assets/001_static_content-initial.zip) the demo project to get started.

## Printing static content

Okay, now it is time to start customizing the application. To begin, let's remove the content that is already there. There are two places we need to go to do this.

First, jump over to the `index.html` file in the `src` directory and remove the `<p>` tag and its content, "Welcome to biz-e-corp". This is rendering the first line of text on the web page.

Notice that, whether you are working locally or online, the page has automatically updated for us. That means that we can immediately see the impact of the change without having to stop our work and refresh or rebuild the application.

Now, let's remove the "Hello, Dojo World!" message. To do that, open up the `HelloWorld.ts` file. If you are working locally, it is located in `/src/widgets`. If, however, you are using the embedded editor then it is pinned to the bottom of your browser. You should see something like this:

```typescript
import { v } from '@dojo/widget-core/d';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

export default class HelloWorld extends WidgetBase<WidgetProperties> {
	protected render(): DNode {
		return v('div', [ 'Hello, Dojo World!' ]);
	}
}
```

Some of this code may not make sense now, but over the next few tutorials, you will find out what all of it means. For now, let's focus on this line:

```typescript
return v('div', [ 'Hello, Dojo World!' ]);
```

The `v` function simply instructs Dojo 2 to create a HTML element, in this case a `<div>` element with the text "Hello, Dojo World!" inside of it. Now, let's replace the `<div>` tag with an `<h1>` tag. We will build a view that allows the user to view Biz-E Corp's workers, so we will add the content "Biz-E Bodies" to the document. When you are finished, click on show solution to see the results.

{% solution showSolution1 %}
```typescript
export default class HelloWorld extends WidgetBase<WidgetProperties> {
	render(): DNode {
		return v('h1', [ 'Biz-E Bodies' ]);
	}
}
```
{% endsolution %}

Now, let's look at the `v` function again. We're intentionally avoiding something like `document.createElement` to create DOM ([Document Object Model](https://en.wikipedia.org/wiki/Document_Object_Model)) elements. However, we are not directly creating a DOM element. Instead, we are creating a representation of the view in TypeScript and letting Dojo 2 efficiently determine how to convert it into DOM elements that are rendered onto the page. This rendering technique is called using a "virtual" DOM.

In traditional web applications, keeping the DOM and JavaScript application logic in sync led to significant complexity and inefficiency for non-trivial applications. When building applications with numerous changes to state and data, the virtual DOM approach can greatly simplify your application logic and improve performance. A virtual DOM serves as an intermediary between your application logic and what is rendered in the real DOM on the page.

Within Dojo 2, we leverage the [Maquette](http://maquettejs.org/) virtual DOM library to determine the most efficient way to interact with the DOM elements in your view. An additional benefit of the virtual DOM is that it facilitates a reactive programming style which simplifies your application. To learn more about the virtual DOM or reactive programming in Dojo 2, check out the [Working with a Virtual DOM](../comingsoon.html) and [Reactive Programming](../comingsoon.html) articles in the reference section. For now, let's get back to our application and make some more changes.

If we want to create a `h1` element with additional attributes, then these attributes can be passed in the second argument to the `v` function. Updating our `v` function call, with a `title` attribute would look like this:

```typescript
v('h1', { title: 'I am a title!' },[ 'Biz-E Bodies' ]);
```

Notice that we have added a parameter between the tag and content parameters. The object used as the second parameter can set any attribute on the element being created. This method of using JavaScript or TypeScript to create DOM elements is called [HyperScript](https://github.com/hyperhype/hyperscript) and is shared by many virtual DOM implementations.

Congratulations! You are off to a good start on your journey to master Dojo 2. In the [next tutorial](../002_creating_an_application/), we will start to get familiar with the major components of a Dojo 2 application.

If you would like, you can download the completed [demo application](../assets/001_static_content-finished.zip) from this tutorial.
