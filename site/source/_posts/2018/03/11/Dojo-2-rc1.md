---
title: Dojo 2 Release Candidate 1 is now available!
date: 2018-03-11 09:00:00
authorId: dylan
featured_image: featured.png
---

We're pleased to announce that Dojo 2 release candidate 1 is now available!

We first started brainstorming ideas for Dojo 2 back in 2010! While development of Dojo 2 did not quite take as long as Diablo 3 or Duke Nukem Forever, we followed a very deliberate journey along the way. Conceived initially as merely a modern clean-up for Dojo 1.x, with the introduction of ES6, TypeScript, web components, and an array of other features, we realized that we wanted to take a different path and create an approach to building modern apps that would not just be a slight clean-up of Dojo 1 or a clone of other current frameworks, but a productive and efficient development experience and front-end architecture.

{% asset_img featured.png feature-full %}

<!-- more -->

The result of these years of rewriting and rethinking is something that we believe offers a compelling way to build modern applications with TypeScript, leveraging a dizzying array of modern standards and best practices including but not limited to ES2015+, TypeScript, custom elements (web components), Progressive Web Apps (PWA), reactive virtual DOM, Intersection Observers, routing, accessibility (a11y), internationalization (i18n), CSS modules, data stores, and much more.

When Dojo began in 2004, there was no significant JavaScript ecosystem, and the standards process was not evolving rapidly. Much has changed in 14 years!

As such, if a viable foundational approach exists that we can leverage or extend beyond the core of Dojo 2, we chose that route rather than creating our own. By leveraging tools like webpack for building and optimizations, various shims for custom elements and Intersection Observers, Globalize and cldr.js for internationalization, and more. On top of this foundation, we've built a reliable and consistent out of the box approach that makes it easy to get started building applications. Dojo 2 does not require each developer to make every architectural choice up front, but still provides easy ways to override our suggested approach when you prefer an alternative.

There are already plenty of [articles that compare frameworks](https://www.sitepen.com/blog/2017/06/13/if-we-chose-our-javascript-framework-like-we-chose-our-music/), but needless to say, we took a long look at everything else because we want Dojo to be part of the ecosystem rather than its silo. By leveraging ES modules, TypeScript interfaces, and custom elements, we provide a robust level of interoperability with other frameworks and libraries.

Our focus on developer ergonomics is to get thousands of small details to feel just right. For example, instead of manually worrying about code splitting, we handle this optimization out of the box with zero configuration. Or when you want to style a component, the list of class names available to that component is type safe, saving time in looking up the relevant class names from your CSS file.

So what are Dojo's primary focus and advantages? It's an ergonomic way to build reactive enterprise web apps with TypeScript and numerous modern web standards and best practices, with an easy to use widget system and widget library, and other vital architectural components including routing, data stores, and much more.

## Author widgets with `@dojo/widget-core`

Dojo has always emphasized the creation of widgets, and Dojo 2's [`@dojo/widget-core`](http://github.com/dojo/widget-core) package creates an environment that provides developers with simple ergonomics to allow them to build robust applications. Leveraging a modern and reactive, uni-directional approach to data binding with a virtual DOM, `@dojo/widget-core` streamlines the process of creating widgets and apps.

There are many scenarios where it is challenging to preserve a reactive architecture when working with properties of DOM nodes, so `@dojo/widget-core` provides meta abstractions to help deal with DOM nodes without breaking the flexibility of a reactive architecture.

`@dojo/widget-core` embraces the future of the web platform with out of the box meta implementations for Intersection Observers, Web Animations, and other APIs, with plans shortly for additional emerging standards such as ResizeObserver.

The following example renders a list with images. By leveraging the Intersection Observer meta, the image `src` gets added only when the item is in the viewport, which prevents needlessly downloading images until the user scrolls to them.

```typescript
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import { Intersection } from '@dojo/widget-core/meta/Intersection';

interface ImageProperties {
	image: string;
}

class Image extends WidgetBase<ImageProperties> {
	protected render() {
		const { image } = this.properties;
		const { isIntersecting } = this.meta(Intersection).get('root');
		const properties = isIntersecting ? { key: 'root', src: image } : { key: 'root' };

		return v('img', properties);
    }
}

interface ImageListProperties {
	images: string[];
}

export class ImageList extends WidgetBase<ImageListProperties> {
	protected render() {
		const { images } = this.properties;
			return v('div', images.map((image) => {
				return v('ul', { key: image }, [ w(Image, { image } )]);
		}));
	}
}
```

Note that if you prefer React's JSX syntax, you can replace Hyperscript with TSX in the `render` function, e.g.:

```typescript
protected render() {
	const { images } = this.properties;
	const items = images.map((image) => (
		<ul key={image}>
			<Image image={image}/>
		</ul>
	));
	return <div>{items}</div>;
}
```

## Dojo loves Custom Elements

A top priority for Dojo is interoperability with the web platform, both by leveraging current and emerging standards and providing a mechanism to coexist with other frameworks efficiently. The Custom Elements portion of the Web Components standard is one area to encourage interoperability between UI component libraries and frameworks.

The [Custom Elements Everywhere](https://custom-elements-everywhere.com/) project was released last year to highlight framework support for custom elements, and Dojo currently has a perfect score. Within Dojo 2, you may use custom elements, express Dojo 2 widgets as custom elements, and easily export Dojo 2 widgets as custom elements via one of our `@dojo/cli` commands, making it easy to share and distribute custom elements for easy use across projects and frameworks! So if you're in an organization where some teams use Angular, some use React, some use Vue, and some use Dojo, we provide a future today where you can write a component once and share it across those teams!

By default, Dojo's custom elements are built for evergreen browsers to reduce overall bundle size, meaning that most basic widgets are <20KB (gzipped) which includes all of the `@dojo` runtime needed to support the custom element.

The `customElement` decorator annotates the widget class to convert it to a custom element:

```typescript
interface HelloWorldWidgetProperties {
	onClick: (event: Event) => void;
	foo: string;
	bar: string;
}

@customElement<HelloWorldWidgetProperties>({
	tag: 'hello-world',
	attribute: [ 'foo', 'bar' ],
	events: [ 'onClick' ]
})
class HelloWorldWidget extends WidgetBase<HelloWorldWidgetProperties> {
// ...
}
```

To compile a Dojo widget into a web component, run the following command:

```
npx @dojo/cli build widget --elements src/HelloWorld
```

For ease of use, all [`@dojo/widgets`](http://github.com/dojo/widgets) are compiled to custom elements and published to npm for easy import into your projects.

Learn more about creating your first Dojo widgets in the [first Dojo 2 application tutorial](https://dojo.io/tutorials/001_static_content/).

## The Dojo CLI

CLI tools provide an easy way to work with frameworks, a trend that was popularized in the JS community by Ember. The [Dojo CLI](http://github.com/dojo/cli) is a collection of packages, providing a CLI architecture which enables a modular approach to create and work with commands.

One of our goals in creating an easy out of the box experience with Dojo is to abstract users away from complex configuration by providing intelligent defaults internally. These defaults are easily overridden by experienced users who prefer something beyond our recommended default options.

To install the Dojo CLI, run the following command:

`npm install -g @dojo/cli`

The [`@dojo/cli-build-app`](http://github.com/dojo/cli-build-app) package provides powerful tools to code split dynamically imported widgets automatically. Support is planned for the near future to enable users to specify this purely by configuration.

`@dojo/cli-build-app` also offers basic support for Build Time Rendering. During an application's build step, the command renders the application, extracts the resulting HTML into the application's index.html, and inlines critical CSS. Build time rendering is an early minimal viable version with more refinements to come. To enable build time rendering, add the following configuration to your project's `.dojorc`, include a root element with an `id` (referenced as the `root` in the configuration below) in the `index.html` and use `projector.merge` over `projector.append`:

```typescript
{
  "build-app": {
    "build-time-render": {
      "root": "app"
    }
  }
}
```

Use `@dojo/cli-build-app` in your Dojo 2 project by adding it as a dev dependency to your project's `package.json`.

Learn more about creating your first Dojo application in the [Dojo local installation tutorial](https://dojo.io/tutorials/000_local_installation/).

## State management

No modern framework would be complete without a recommended approach to state management.

Managing state can become difficult to coordinate when an application becomes complicated with multiple views, widgets, components, and models. With each of these attempting to update attributes of state at varying points within the application lifecycle things can get confusing. When state changes are difficult to understand or non-deterministic, it becomes increasingly difficult to identify and reproduce bugs or add new features.

`@dojo/stores` is a predictable, consistent state container for JavaScript applications with inspiration from Redux and Flux architectures. However, the [`@dojo/stores`](http://github.com/dojo/stores) package aims to provide more built-in support for common patterns such as asynchronous behaviors, undo support and more!

The `@dojo/stores` package provides a centralized store, designed to be the single source of truth for an application. It operates using uni-directional data flow, so all application data follows the same lifecycle, ensuring the application logic is predictable and easy to understand.

Key features of `@dojo/stores` include:

* Application state store designed to work with a reactive component architecture
* Out of the box support for asynchronous commands
* All state operations are recorded per process and undoable via a process callback
* Supports the optimistic pattern with the ability to roll back on a failure
* Fully serializable operations and state

When managing application state with the `@dojo/stores` package, there are three core but simple concepts - Operations, Commands, and Processes.

* Operation: Granular instructions to manipulate state based on JSON Patch
* Command: Simple functions that ultimately return operations needed to perform the required state change
* Process: A function that executes a group of commands that usually represent a complete application behavior

Dojo 2 also makes it easy to support other patterns such as those popularized by Unstated. Less complex applications can simply lift state up to parent widgets and use local state.

## Documentation and examples

To get started, we have a [series of Dojo tutorials and documentation](https://dojo.io/docs/) that range from the very basics to more complicated topics such as lazy loading, web animations and more. In addition to these, all Dojo 2 packages have detailed READMEs.

We've created a variety of examples of Dojo 2 usage:

* [TodoMVC](https://dojo.github.io/examples/todo-mvc/) - TodoMVC is the canonical example used to demonstrate fundamental web application paradigms
* [TodoMVC kitchen sink](https://dojo.github.io/examples/todo-mvc-kitchensink/) - Our extension of TodoMVC used to illustrate a selection of Dojo 2 specific capabilities such as theming and internationalization.
* [RealWorld](https://github.com/gothinkster/dojo2-realworld-example-app) - A full web application example with authentication, code splitting, state management, routing and more.
* [HNPWA](https://dojo-2-hnpwa-d668d.firebaseapp.com/) - The spiritual successor to TodoMVC, Hacker News PWA is designed to demonstrate progressive web app capabilities with a focus on providing a fast, reliable experience with rich offline support
* [Custom element menus](https://dojo.github.io/examples/custom-element-menu/) - Demonstrates using Dojo 2 widgets both natively and as a custom element without needing to adapt the authoring pattern.

To learn more about Dojo 2 and get started, check out the [Dojo 2 tutorial series](https://dojo.io/tutorials/).

## What's next?

In the release candidate stage, we'll fix any critical issues reported and then have another release candidate. After a week with no critical blocking issues, we'll announce 2.0.0!

We also hope to have Dojo 2 available on CodeSandbox in time for the 2.0.0 release as well!

### Versions

After that, we'll be following semantic versioning for subsequent releases. 2.0.y will include bug fixes, 2.x.0 will provide additions, and 3.0.0 will be the next release with any breaking changes. When we are ready for 3.0.0, all packages will be updated to that version to keep them synchronized. As such, expect 3.0.0 to arrive within a few months rather than ten years!

### Feedback and help wanted

We still have quite a bit of work to do to update and refine our examples and documentation, so if you see an issue, please let us know, or better yet, create a pull request!
There's still much we want to complete after 2.0.0, but we're ready for you to start using Dojo, give us feedback, and let us know where we should prioritize our efforts.

Let us know what you think either on [Gitter](https://gitter.im/dojo/dojo2), [Twitter](https://twitter.com/dojo/) or [Discourse](https://discourse.dojo.io/).
