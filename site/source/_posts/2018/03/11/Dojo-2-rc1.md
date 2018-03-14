---
title: Dojo 2 Release Candidate 1 is now available!
date: 2018-03-11 09:00:00
authorId: dylan
featured_image: featured.png
---

We're pleased to announce Dojo 2 release candidate 1 is now available!

We first started brainstorming ideas for Dojo 2 back in 2010. While development of Dojo 2 did not take quite as long as Diablo 3 or Duke Nukem Forever, we followed a very deliberate journey. Conceived initially as a modern clean-up for Dojo 1.x, with the introduction of ES6, TypeScript, web components, and an array of other features, we realized we wanted to take a different path and create an approach to building modern apps that would not just be a slight clean-up of Dojo 1 or a clone of other current frameworks, but a productive and efficient development experience and front-end architecture.

{% asset_img featured.png feature-full %}

<!-- more -->

The result of these years of rewriting and rethinking is something we believe offers a compelling way to build modern applications with TypeScript, leveraging a dizzying array of modern standards and best practices including but not limited to ES2015+, TypeScript, custom elements (web components), Progressive Web Apps (PWA), reactive virtual DOM, Intersection Observers, routing, accessibility (a11y), internationalization (i18n), CSS modules, data stores, and much more.

When Dojo began in 2004, there was no significant JavaScript ecosystem, and the standards process was not evolving rapidly. Much has changed in 14 years!

As such, if a viable foundational approach exists that we can leverage or extend beyond the core of Dojo 2, we will choose this route rather than creating our own. By leveraging tools like webpack for building and optimizations, various shims for custom elements and Intersection Observers, Globalize and cldr.js for internationalization and more. On top of this foundation, we have built a reliable and consistent out of the box approach making it easy to get started building applications. Dojo 2 does not require each developer to make every architectural choice up front, but still provides easy ways to override our suggested approach when you prefer an alternative.

There are plenty of [articles comparing frameworks](https://www.sitepen.com/blog/2017/06/13/if-we-chose-our-javascript-framework-like-we-chose-our-music/), but needless to say, we took a long look at everything else because we want Dojo 2 to be part of the ecosystem rather than its own silo. By leveraging ES modules, TypeScript interfaces, and custom elements, we provide a robust level of interoperability with other frameworks and libraries.

So what are Dojo's primary focus and advantages? It is an ergonomic way to build reactive enterprise web apps with TypeScript and numerous modern web standards and best practices, with an easy to use widget system and widget library, and other vital architectural components including routing, data stores, and much more.

## Author widgets with @dojo/widget-core

Dojo has always emphasized the creation of widgets, and Dojo 2's [`@dojo/widget-core`](http://github.com/dojo/widget-core) package creates an environment providing developers with simple ergonomics allowing them to build robust applications. Leveraging a modern and reactive, uni-directional approach to data binding with a virtual DOM, `@dojo/widget-core` streamlines the process of creating widgets and apps.

There are many scenarios where it is challenging to preserve a reactive architecture when working with properties of DOM nodes, so `@dojo/widget-core` provides meta abstractions to help deal with DOM nodes without breaking the flexibility of a reactive architecture.

`@dojo/widget-core` embraces the future of the web platform with out of the box meta implementations for Intersection Observers, and Web Animations. With plans to add support for more existing and upcoming living standards from WIGC via meta in the future.

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

## Css Modules and css-next

Dojo 2 uses [css modules](https://github.com/css-modules/css-modules), out of the box to provide localized class names as standard. This ensures that your styles do not leak out of your widgets and provides type-ahead capability when importing your css files into your widget.

[Css-next](http://cssnext.io/) enables allows Dojo 2 widgets to use cutting edge css syntax and features immediately, such as `calc`, `css-variables` and various color functions. These are all compiled down to browser friendly variants at build time so there's no need for a post processor such as SCSS or Less.

## Dojo loves Custom Elements

A top priority for Dojo is interoperability with the web platform, both by utilizing current and emerging standards and providing a mechanism to coexist with other frameworks efficiently. The Custom Elements portion of the Web Components standard is one area to encourage interoperability between UI component libraries and frameworks.

The [Custom Elements Everywhere](https://custom-elements-everywhere.com/) project was released last year to highlight framework support for using custom elements, and Dojo 2 currently has a perfect score.

You can do much more than simply use custom elements within a Dojo 2 project, you can compile your Dojo 2 widgets to custom elements via one of our `@dojo/cli` commands, making it shareable and easy to distribute Dojo 2 widgets across projects and frameworks. So if you are in an organization where some teams use Angular, some use React, some use Vue, and some use Dojo, we provide a future today where you can write a component once and share it across those teams!

By default, Dojo's custom elements are built for evergreen browsers to reduce overall bundle size, meaning most basic widgets are <20KB (gzipped) including all of the `@dojo` runtime needed to support the custom element.

The `customElement` decorator annotates the widget class and instructs the cli-build-widget command to convert it to a custom element:

```typescript
interface HelloWorldProperties {
	onClick: (event: Event) => void;
	foo: string;
	bar: string;
}

@customElement({
	tag: 'hello-world',
	attribute: [ 'foo', 'bar' ],
	events: [ 'onClick' ]
})
class HelloWorld extends WidgetBase<HelloWorldProperties> {
// ...
}
```

To compile a Dojo widget into a web component, run the following command:

```
npx @dojo/cli build widget --elements src/HelloWorld
```

For ease of use, all [`@dojo/widgets`](http://github.com/dojo/widgets) are compiled to custom elements and published to npm and easily imported into your projects.

Learn more about creating your first Dojo widgets with the [first Dojo 2 application tutorial](https://dojo.io/tutorials/001_static_content/).

## The Dojo CLI

CLI tools provide an easy way to work with frameworks, a trend  popularized in the JS community by Ember. The [Dojo CLI](http://github.com/dojo/cli) is a collection of packages, providing a CLI architecture enabling a modular approach to create and work with commands.

One of our goals in creating an easy out of the box experience with Dojo is to abstract users away from complex configuration by using intelligent defaults internally.

To install the Dojo CLI, run the following command: `npm install -g @dojo/cli`

There are currently six officially supported CLI command modules:

#### [@dojo/cli-create-app](http://github.com/dojo/cli-create-app)

Creates a skeleton Dojo 2 application to get started with development and includes all the Dojo 2 dependencies needed.

```shell
$ dojo create app --name my-first-dojo-2-app
```

#### [@dojo/cli-build-app](http://github.com/dojo/cli-build-app)

A command to build your Dojo 2 application with basic command line options to specify the target development or production, start the command in watch mode and even create a basic http server to serve the application locally.

cli-build-app also provides powerful tools to code split dynamically imported widgets automatically and Build Time Rendering.

#### [@dojo/cli-test-intern](http://github.com/dojo/cli-test-intern)

A unit and functional testing command for Dojo 2 application using [Intern](https://theintern.io/), with support to run tests on popular services such as Browserstack, Saucelabs and TestingBot.

#### [@dojo/cli-build-widget](http://github.com/dojo/cli-build-widget)

The cli-build-widget command enables consumers to build custom elements from one or more of their Dojo 2 widgets.

#### [@dojo/cli-create-widget](http://github.com/dojo/cli-create-widget)

Creates a skeleton Dojo 2 widget module and all associated meta files.

#### [@dojo/cli-create-theme](http://github.com/dojo/cli-create-theme)

Creates a skeleton Dojo 2 theme from your chosen project's dependencies.

Ultimately, each of the commands require zero configuration to get started, with only some advanced features requiring additional configuration via a project's `.dojorc` file.

To use any of the CLI commands in your Dojo 2 project by adding them as a dev dependency to your project's `package.json`.

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

* Operations: Granular instructions to manipulate state based on JSON Patch
* Commands: Simple functions ultimately returning operations needed to perform the required state change
* Processes: A function executing a group of commands usually representing a complete application behavior

Dojo 2 also makes it easy to support other patterns such as those popularized by Unstated. Less complex applications can simply lift state up to parent widgets and use local state.

## Documentation and examples

To get started, we have a [series of Dojo tutorials](https://dojo.io/tutorials/) and [reference documentation](https://dojo.io/docs/fundamentals/accessibility/index.html) ranging from the very basic to more complicated topics such as lazy loading, web animations and more. In addition to these resources, all Dojo 2 packages have detailed READMEs.

We've created a variety of examples of Dojo 2 usage:

* [TodoMVC](https://dojo.github.io/examples/todo-mvc/) - TodoMVC is the canonical example used to demonstrate fundamental web application paradigms
* [TodoMVC kitchen sink](https://dojo.github.io/examples/todo-mvc-kitchensink/) - Our extension of TodoMVC used to illustrate a selection of Dojo 2 specific capabilities such as theming and internationalization.
* [RealWorld](https://dojo.github.io/examples/realworld/) - A full web application example with authentication, code splitting, state management, routing and more.
* [HNPWA](https://dojo-2-hnpwa-d668d.firebaseapp.com/) - The spiritual successor to TodoMVC, Hacker News PWA is designed to demonstrate progressive web app capabilities with a focus on providing a fast, reliable experience with rich offline support
* [Custom element menus](https://dojo.github.io/examples/custom-element-menu/) - Demonstrates using Dojo 2 widgets both natively and as a custom element without needing to adapt the authoring pattern.

To learn more about Dojo 2 and get started, check out the [Dojo 2 tutorial series](https://dojo.io/tutorials/).

## What's next?

In the release candidate stage, we will fix any critical issues reported and then have another release candidate. After a week with no critical blocking issues, we will announce 2.0.0!

We also hope to have Dojo 2 available on CodeSandbox in time for the 2.0.0 release as well.

### Versions

After, we will be following semantic versioning for subsequent releases. 2.0.y will include bug fixes, 2.x.0 will provide additions, and 3.0.0 will be the next release with any breaking changes. When we are ready for 3.0.0, all packages will be updated to this version to keep them synchronized. As such, expect 3.0.0 to arrive within a few months rather than 10 years!

### Feedback and help wanted

We still have quite a bit of work to do to update and refine our examples and documentation, so if you see an issue, please let us know, or better yet, create a pull request!
There is still much we want to complete after 2.0.0, but we are ready for you to start using Dojo, give us feedback, and let us know where we should prioritize our efforts.

Let us know what you think either on [Gitter](https://gitter.im/dojo/dojo2), [Twitter](https://twitter.com/dojo/) or [Discourse](https://discourse.dojo.io/).
