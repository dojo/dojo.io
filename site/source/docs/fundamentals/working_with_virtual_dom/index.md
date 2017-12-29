---
layout: docs
category: fundamentals
title: Working with a Virtual DOM
overview: Dojo 2 applications use a Virtual DOM to efficiently manage updating the page. This article describes what a Virtual DOM is and the advantages that it brings.
---

# Working with a virtual DOM

Almost all client-side web applications interact with the web page in some way. Traditionally, this has been accomplished by using the [Document Object Model (DOM) API](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model). While this works well, increased consumer expectations combined with higher levels of application complexity have made it difficult to build high performance applications that directly interact with the page via the DOM. Dojo 2 addresses this challenge by using an abstraction layer, called a virtual DOM, to remove the responsibility for manipulating the page structure from the application. In this article, we will discuss what the virtual DOM is and how Dojo 2 uses it to streamline the process of creating highly performant applications.

## Responsibilities of the Document Object Model (DOM) API

To understand the advantages of a virtual DOM, it is important to understand the role that the DOM itself plays in a web application. The DOM consists of a series of objects, methods, and properties that allow an application to interact with the elements that make up a web page. The DOM `document` is a tree structure that represents the elements that make up a web page. By adding, deleting, and moving elements from the `document`, the appearance and behavior of the page can be altered. Additionally, the DOM contains methods that allow the properties of page elements to be manipulated, providing a way to control the appearance and behavior of individual elements within the page.

For example, if we started with an empty web page, and needed to add an `h1` header containing the page's title, then we could do that with the following statements:

```ts
  const pageTitle = document.createElement('h1');
  pageTitle.innerHTML = 'Welcome to Biz-E-Corp!';
  pageTitle.classList.add('title');
  document.body.appendChild(pageTitle);
```

This example starts by creating the `h1` element and then setting two properties - the `innerHTML` property specifies the element's contents and the `classList.add()` method adds a CSS class to the element to alter its appearance. Finally, the element is added to the `document`'s `body` element via a call to that element's `appendChild` method.

The DOM APIs are well-known and reliable, but it can be challenging to use them efficiently. This challenge is caused by the way in which web browsers coordinate changes in the DOM and the page. Whenever a DOM change alters the visible layout of the page, the browser must redetermine the location of each element and redraw them. This means that mundane changes to the DOM can significantly degrade application performance.

## Advantages of virtualizing the DOM

> "We can solve any problem by introducing an extra level of indirection" - David J. Wheeler

Ensuring that the DOM is updated efficiently is a critical component to maximizing web application performance. Doing that consistently across a large application, however, can be very challenging. Rather than relying on engineering knowledge to remember to always manage DOM operations efficiently, Dojo 2 provides an abstraction layer to manage DOM updates automatically. This abstraction layer is called a *virtual* DOM.

A virtual DOM has several advantages when compared to traditional DOM manipulation. A virtual DOM improves developer productivity by allowing them to interact with a simple, consistent API in a declarative manner. It also improves performance by gathering DOM updates into batches and applying them at the optimum time. Finally, applications using a virtual DOM use resources more efficiently since applications interact with lightweight representations of DOM elements instead of the DOM elements themselves.

The DOM API has existed for many years and has been continually expanded to keep up with the evolution of web browsers. This evolution has yielded a programming interface that is occasionally verbose and inconsistent. Virtual DOM libraries are able to reconsider the use-cases for managing page elements and expose a simpler set of interfaces for developers to work against. For example, consider the example in the preceeding section where we created an `h1` tag, set some properties on it, and add it to the page. In Dojo 2, this would be accomplished using the following code:

```ts
  v('h1', { class: 'title' }, [ 'Welcome to Biz-E-Corp' ]);
```

A single line of code is all that is required to accomplish what the DOM API required four lines to do. While lines of code is not the only way to measure productivity, frequently used APIs greatly benefit engineering productivity when they are efficient and consistent. By providing a simple, declarative API, rendering code is typically much cleaner and easier to comprehend.

One critical difference between the DOM and virtual DOM examples is that the DOM example maintains access to the element that was created via the `pageTitle` variable. Retaining this reference is often done when an element may need to be modified later. With a virtual DOM, maintaining state in this way is not necessary because the application never manipulates the state of the DOM directly. It is only responsible for generating a representation of the page at any given time. A component of the virtual DOM called a [projector](http://maquettejs.org/docs/typedoc/interfaces/_maquette_.projector.html) is responsible for determining the changes that are required to the page.

{% aside 'Virtual DOM projectors' %}
A virtual DOM renders content to the web page using the DOM just like any other web application. A **projector** is a component of the virtual DOM that synchronizes the virtual DOM nodes and the DOM.
{% endaside %}

Consider an example where a reusable page title component is required. This widget must be able to vary the content inside of an `h1` element. Using the DOM, we might end up with a method like this:

```ts
  updateTitle(title: string): void {
    this.pageTitle.innerHTML = title;
  }
```

This code requires the widget instance to track the DOM element that contains the title text and set the correct property whenever it is called. In contrast, the same thing is done in Dojo 2 with this method:

```ts
  render(): DNode {
    return v('h1', { class: 'title' }, [ this.title ]);
  }
```

Do you notice the similarity between this and the original statement that returned static content? Since the projector automatically determines the differences, the application does not have to track changes - it simply describes the elements as they should exist. This greatly reduces the API required to describe the content of a web page.

### Efficiently manage DOM changes

Almost all interactions with a web application cause a visual update of some kind. Many of these updates require the page's DOM structure to be changed by adding, deleting, or moving elements. When this occurs, the web browser must recalculate the position of every element and then re-render them. When performed too often, this process can degrade the performance and responsiveness of the application. Consider this example that is adding a series of items to a list:

```ts
  const ul = document.getElementById('theList');
  for (let i = 0; i < 5; i++) {
    const li = document.createElement('li');
    li.value = i;
    li.innerHTML = i;
    ul.appendChild(li);
  }
```

This code will cause the browser to recalculate the flow of the page's elements five times - once per item added to the list. There are ways to eliminate this, using `DocumentFragments` for example, but they often require additional code to be written that obscures the intent of the function. Since an application that uses a virtual DOM does not concern itself with intermediate changes, only the final result is required to be generated:

```ts
  const values = [0, 1, 2, 3, 4];

  v('ul', values.map(value => v('li', [ value ]));
```

This code returns the `ul` element with the required children in place. When the virtual DOM renders this update, it will determine how to most efficiently render this element.

The virtual DOM achieves its performance improvements by limiting the number of times the DOM is updated and, when it is updated, ensuring that the update is performed as efficiently as possible. For example, if creation of a `DocumentFragment` is considered most efficient by the Virtual DOM system, then it will internally create and insert content in that manner.

The projector does not update the DOM every time the virtual DOM structure changes. Instead, it informs the browser that an update is required by calling the [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) method on the browser's `window` object. This method accepts a callback function that is invoked when the browser is ready to repaint the page as part of its normal rendering process. By waiting until the browser needs to repaint the screen, the virtual DOM library limits the number of times the page must recalculate element positions to one time per rendering cycle.

To achieve the most efficient update possible, the projector stores a copy of the virtual nodes used to generate the current DOM structure and creates a mapping between the virtual nodes and the actual ones. When the page is re-rendered, the new virtual DOM is compared to the previous one. The differences between the two structures are used to create an update plan that causes as few changes to the DOM as possible, updating the rendered page. The new virtual DOM nodes are then mapped to the updated DOM and the projector waits for the next update.

## Constraints of the virtual DOM

While there are many advantages to working with a virtual DOM, there are some constraints that are necessary to achieve high rendering performance.

A virtual DOM only considers changes from the previous collection of virtual nodes that it rendered. This means that any changes to the page's DOM structure from other sources are ignored and can lead to rendering errors. This constraint allows the projector to reliably determine the differences in the page by comparing the virtual nodes from the previous render with current ones. Comparing these two object graphs can be done very quickly whereas comparing a virtual node structure with the actual DOM can be slow and inefficient.

In a virtual DOM every virtual node must be able to be uniquely identified. Since the stateless virtual DOM nodes are mapped to stateful DOM nodes, the virtual DOM library needs a way to map the virtual nodes to the actual ones. This can be done by ensuring that a node has no siblings of the same type, or by providing the virtual nodes with an identification key. By making the virtual nodes uniquely identifiable, the projector can efficiently determine which nodes have been added, removed, or modified.
