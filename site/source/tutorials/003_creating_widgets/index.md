---
layout: tutorial
title: Creating widgets
editorUrl: https://embed.plnkr.co/9dfUeb/?show=src/widgets/Worker.ts,preview&preview=index.html
---

# Creating widgets

## Overview
In this tutorial, you will learn how to create and style custom widgets in Dojo 2.

## Prerequisites

With the Dojo 2 tutorial series, you may work with the examples following two different paths:

* A browser embedded editor
* A local installation

The browser embedded editor is intended to make it easy to quickly see the examples in action, but does not match a normal development environment, and does not provide all of the benefits of TypeScript.

If you prefer a local installation, please visit the [Dojo 2 Installation Guide](../comingsoon.html) before proceeding further with this tutorial.

Whether you are working locally or using the embedded editor, you need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

## Demo files
If you are following along locally, you can [download](../assets/003_creating_widgets-initial.zip) the demo project to get started.

## Creating the application widget
In the [first tutorial](../001_static_content) in this series, we created an application with a single widget, which we modified to show the title of our Biz-E Bodies view. In this tutorial, we're going to expand our application to show each worker's portrait as well as their name. Before we get to that we have some refactoring to do. Our demo application is currently hard-wired to render our single widget, which has been renamed to the more appropriate `Banner` in this tutorial. This can be found in the `main.ts` file here:

```ts
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import Banner from './widgets/Banner';

const root = document.querySelector('my-app') || undefined;

const Projector = ProjectorMixin(Banner);
const projector = new Projector();

projector.append(root).then(() => {
	console.log('Attached!');
});
```

This line:

```ts
const Projector = ProjectorMixin(Banner);
```

tells the application to use the `Banner` widget as the source of the virtual DOM elements for rendering the application. To add a second widget, we are going to create a new widget called `App` that represents the entire application that we are building. To start that process, go into the empty `App.ts` file located in the `src/widgets` directory. First, we need to add the required dependencies to create the `App` widget.. Add these lines at the top of the file.

```ts
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
```

The `WidgetBase` class will be used as the base class for our `App` widget. `WidgetBase` (and its descendants) work with the `WidgetProperties` interface to define the publicly accessible properties of the widget. Finally, the `v` and `w` functions are used to render virtual DOM nodes (with the `v` function) or widgets (via `w`). Both virtual DOM nodes and widgets are rendered generate `DNode`s, the base type of all virtual DOM nodes in Dojo 2.

Our next dependency to load is the Banner widget that we created in the first tutorial. To import it, add the following statement to `App.ts`:

```ts
import Banner from './Banner';
```

With all of the dependencies in place, let's create the `App` widget itself:

```ts
export default class App extends WidgetBase<WidgetProperties> {
}
```

Notice that the `App` class is extending `WidgetBase`, a [generic class](https://www.typescriptlang.org/docs/handbook/generics.html#generic-classes) that accepts the `WidgetProperties` interface. This will give our class several default properties and behaviors that are expected to be present in a Dojo 2 widget. Also, notice that we are have added the `export` and `default` keywords before the `class` keyword. This is the ES6 standard approach for creating modules, which Dojo 2 leverages when creating a widget - the widget should be the default export in order to make it as convenient as possible to use.

Our next step is to override `WidgetBase`'s `render` method to generate the application's view. The `render` method has the following signature `render() : DNode`, which means that our render method has to return a `DNode` (an abstraction for an [HyperScript](https://github.com/hyperhype/hyperscript) node) so that the application's projector knows what to render. The normal way to generate this `DNode` is by calling either the `v` or `w` functions. To start, let's use the simplest `render` method by adding this to the `App` class:

```ts
render(): DNode {
	return v('div', []);
}
```

This method will generate a `div` virtual node with no children. To render the `Banner` as a child of the div, we'll use the `w` function that is designed to render widgets. Update the `render` method to the following:

```ts
render(): DNode {
	return v('div', [
		w(Banner, {})
	]);
}
```

Notice that the `w` function takes two parameters - a widget class and an object literal. That literal must implement the interface that was passed to `WidgetBase` via TypeScript generics. In this case, the `Banner` class uses `WidgetProperties` which has the following definition:

```ts
export interface WidgetProperties {
	key?: string;
	bind?: any;
}
```

Both of these properties are optional, so we can pass an empty object for now.

Our `App` class is now complete and ready to replace the `Banner` class as the root of the application. To do that, we will edit `main.ts`. The first update will replace the `import` statement from the `Banner` class to the new `App` class:

```ts
import App from './widgets/App';
```

The only other change we need to make is to pass the `App` class into the `ProjectorMixin` function call on line 6:

```ts
const Projector = ProjectorMixin(App);
```

With that change, the `App` widget is ready to serve as the root of our application. Let's test everything by building and running the project. If you are working locally, run the following command:

```bash
dojo build --watch
```

then open up a web browser and navigate to [`http://localhost:9999`](http://localhost:9999). You should see the Biz-E Bodies title that we started with, but if you examine the actual DOM, you will see that the Banner's `<h1>` tag has been wrapped by the App's `<div>`, so everything appears to be working.

In the next section, we'll create the `Worker` widget that will show the portrait and name of our Biz-E bodies.

## Creating the Worker widget
Now it is time to create our Worker widget. This widget will only render static content. We will use its properties to allow the application to customize what is rendered. Our goal is to end up with something that looks like this:

![worker_widget](resources/worker.png)

The first step is to create the worker widget. We will put the implementation in `widgets/Worker.ts`. As with the `App` widget that we created earlier, we need to add some initial dependencies and the class declaration to `widget/Worker.ts`:

```ts
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';

export default class Worker extends WidgetBase<WidgetProperties> {
	render(): DNode {
		return v('div', []);
	}
}
```

This is nearly identical to the `App` widget with one exception: we are not importing the `w` function as the `Worker` widget will not contain any child widgets.

Our next step is to extend the `render()` method to customize the widget's appearance. To accomplish this, we are going to need two children. One `<img>` tag to show the portrait and a `<strong>` tag to display the worker's name. Try and implement that using the URL "images/worker.jpg" (for the embedded editor, use: "https://dojo.io/tutorials/003_creating_widgets/demo/finished/biz-e-corp/src/images/worker.jpg") for the image's source and print the first and last names. If you need help, or want to check your solution, click the button below to see our solution.

{% solution showSolution1 %}
```ts
render(): DNode {
	return v('div', [
			v('img', { src: 'images/worker.jpg' }, []),
			v('div', [
				v('strong', [ 'lastName, firstName' ])
			])
		]
	);
}
```
{% endsolution %}

Before we continue to refine this widget, let's review our progress by adding the `Worker` widget to the app. Within `App.ts`, import the `Worker` widget and then update the `App`'s render method to render it. The `Worker` will be another child of the `App`, so we just need to add another entry to the children array. Try that now and, when done, check your answer by clicking on the "Show solution" button.

{% solution showSolution2 %}
```ts
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import Worker from './Worker';

export default class App extends WidgetBase<WidgetProperties> {
	render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(Worker, {})
		]);
	}
}
```
{% endsolution %}

Now run the application with `dojo build --watch` and navigate to [`http://localhost:9999`](http://localhost:9999). We have succeeded in rendering the widget, but there seems to be some styling issues. We'll come back to that in a bit. For now, let's continue refining the `Worker` widget to allow the application to configure it before it is rendered. In Dojo 2, this is done by creating an interface that extends `WidgetProperties` and using that to pass configuration information into the widget.

Return to `widgets/Worker.ts` and add an interface with the custom properties that we need:

```ts
export interface WorkerProperties extends WidgetProperties {
	firstName?: string
	lastName?: string
}
```

Then change the generic parameter passed into `WidgetBase` with the new interface:

```ts
export default class Worker extends WidgetBase<WorkerProperties>
```

The `WorkerProperties` interface adds two new optional properties that we'll be able to use. Now that these are available, let's use them to make the name of the worker dynamic. Inside of the render method, add the following code to create some local constants for the first and last names:

```ts
const {
	firstName = 'firstName',
	lastName = 'lastName'
} = this.properties;
```

This code retrieves the appropriate property and provides a reasonable default, in case the widget doesn't receive a value. We can now update the generated virtual DOM with those values by updating the returned value from the render method with those property values.

The new `render` method should look like this:

```ts
render(): DNode {
	const {
		firstName = 'firstName',
		lastName = 'lastName'
	} = this.properties;

	return v('div', [
			v('img', { src: 'images/worker.jpg' }, []),
			v('div', [
				v('strong', [ `${lastName}, ${firstName}` ])
			])
		]
	);
}
```

The final step in creating this widget is to update the `render` method in the `App` class to pass in some properties. In a full Dojo 2 application, these values would normally be retrieved from a store, but for now, we'll just use static properties. To learn more about working stores in Dojo 2, take a look at the [dojo/stores](../comingsoon.html) tutorial in the advanced section.

In `App.ts`, update the line that is rendering the `Worker` to contain values for the `firstName` and `lastName` properties:

```ts
w(Worker, { firstName: 'Tim', lastName: 'Jones' })
```

If you are following along locally, you should already see the new values. However, if you shut down the build watcher, you can start it up again by running `dojo build --watch` and navigating to `http://localhost:9999`.

At this point, we have a good start to our widget, but it still doesn't look very good. In the next section we'll address that by learning how to use CSS to style our widgets.

## Styling widgets with CSS modules
In the first tutorial, we were able to adjust the look of the `Banner` widget by directly manipulating the `styles` property of the generated virtual DOM. While this was effective, it is generally considered better to use external CSS files to establish the look and feel of an application. Dojo leverages [CSS Modules](https://github.com/css-modules/css-modules) to provide all of the flexibility of CSS, plus two additional benefits: type support in TypeScript and localized styling rules to help prevent inadvertent rule collisions.

To allow our Worker widget to be styled, we need to modify the Widget class. First, apply a [decorator](https://www.typescriptlang.org/docs/handbook/decorators.html) to the class to modify the widget's constructor and prepare its instances to work with CSS modules. Also, apply a "mixin" to the Worker widget. A mixin is not intended to be used on its own, but instead works with a base class to add useful functionality. Add the following import to the top of `widgets/Worker.ts`:

```ts
import { theme, ThemeableMixin } from '@dojo/widget-core/mixins/Themeable';
```

We also need to `import` our CSS:
```ts
import * as styles from '../styles/worker.css';
```

`worker.css` contains CSS selectors and rules to be consumed by the widget and its components.

With the imports in place, we can add the **@theme** decorator and apply the mixin to the `Worker` class in `widgets/Worker.ts`:

```ts
const WorkerBase = ThemeableMixin(WidgetBase);

@theme(styles)
export default class Worker extends WorkerBase<WorkerProperties>
```

Next, let's add our CSS rules in `src/styles/` which will allow us to style the `Worker` widget:

```css
.worker {
	width: 27%;
	margin: 0 3%;
	text-align: center;
	display: inline-block;
}

.image {
	width: 100%;
}
```

`dojo build --watch` will detect these new rules and generate the type declaration files automatically, allowing us to apply them to the `Worker` widget. Return to `widgets/Worker.ts` and update the render method:

```ts
render(): DNode {
	const {
		firstName = 'firstName',
		lastName = 'lastName'
	} = this.properties;

	return v('div', {
		classes: this.classes(styles.worker)
	}, [
			v('img', {
				classes: this.classes(styles.image),
				src: 'images/worker.jpg' }, []),
			v('div', [
				v('strong', [ `${lastName}, ${firstName}` ])
			])
		]
	);
}
```

If you return to the browser, you'll see that the widget now has the styles applied and looks a little better. While you are there, open up the developer tools and look at the CSS classes that have been applied to the widget's components. Notice that we don't have class names such as `.worker` or `.image` like we used in the CSS file, rather we have something like `.worker__image__3aIJl`. This obfuscation is done by the `dojo build` command when it compiles the project to ensure that CSS selectors are localized to a given widget. There are also ways to provide global styling rules (called "themes"). To learn more about those, take a look at the [Theming an Application](../comingsoon.html) tutorial in the Cookbook section.

We've almost achieved our goal of displaying a collection of Biz-E Bodies, but we have one thing remaining. We could certainly add additional `Worker` widgets to our application, but they would all be siblings of the `Banner` widget and could be difficult to style properly. In the next section, we'll create a simple container widget that will handle the layout of the `Worker` widgets.

## Moving the Worker into a container
The `WorkerContainer` has many of the same responsibilities of the `App` widget. It will be responsible for generating both virtual DOM nodes directly as well as rendering widgets. Similar to the `Worker` widget, we will apply some styling to it. Putting this all together, add the following to `widgets/WorkerContainer.ts`:

```ts
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { w, v } from '@dojo/widget-core/d';
import Worker from './Worker';
import { theme, ThemeableMixin, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import * as styles from '../styles/workerContainer.css';

const WorkerContainerBase = ThemeableMixin(WidgetBase);

const WorkerContainerBase = ThemeableMixin(WidgetBase);

@theme(styles)
export default class WorkerContainer extends WorkerContainerBase<ThemeableProperties> {
	render(): DNode {
		return v('div', {
			classes: this.classes(styles.container)
		}, []);
	}
}
```

Now we can update the `render` method to include some workers. Add the following to the top of the `render` method:

```ts
const workers: DNode[] = [
	w(Worker, {
		firstName: 'Tim',
		lastName: 'Jones'
	}),
	w(Worker, {
		firstName: 'Alicia',
		lastName: 'Fitzgerald'
	}),
	w(Worker, {
		firstName: 'Hans',
		lastName: 'Mueller'
	})
];
```

Replace the empty array in the `v` function's third argument with this array:

```ts
return v('div', {
	classes: this.classes(styles.container)
}, workers);
```

Now it is time to add the `container` CSS rule inside `styles/workerContainer.css`:

```css
.container {
	width: 80%;
	margin: 0 auto;
}
```

Finally, let's update the `App` class to replace the `Worker` widget with the new `WorkerContainer`.

```ts
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { v, w } from '@dojo/widget-core/d';
import Banner from './Banner';
import WorkerContainer from './WorkerContainer';

export default class App extends WidgetBase<WidgetProperties> {
	render(): DNode {
		return v('div', [
			w(Banner, {}),
			w(WorkerContainer, {})
		]);
	}
}
```

The application now renders three workers in the `WorkerContainer` widget, allowing us to control how they are laid out without impacting the overall application.

## Summary
In this tutorial, we have created and styled widgets within Dojo 2. Widgets are classes that derive from `WidgetBase<WidgetProperties>`. This base class provides the basic functionality for generating visual components in a Dojo 2 application. By overriding the `render` method, a widget can generate the virtual DOM nodes that control how it is rendered.

Additionally, we learned how to style widgets by using CSS modules. These modules provide all of the flexibility of CSS with the additional advantages of providing strongly typed and localized class names that allow a widget to be styled without the risk of affecting other aspects of the application.

If you would like, you can download the [demo application](../assets/003_creating_widgets-finished.zip).

In the [next tutorial](../004_user_interactions), we'll explore the rich set of widgets included with Dojo 2 to create applications quickly and efficiently.
