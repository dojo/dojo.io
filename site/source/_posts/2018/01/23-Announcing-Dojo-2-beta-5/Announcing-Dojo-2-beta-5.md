---
title: Announcing Dojo 2 beta 5!
date: 2018-01-23 09:00:00
authorId: dylan
featured_image: featured.png
---

Dojo is a modern, reactive framework authored with ES2017 and TypeScript, and optimized with the needs of enterprise application development in mind.

If you're learning about Dojo 2 for the first time, please read our overview about the [Dojo 2 beta 4 release](https://dojo.io/blog/2017/12/04/Announcing-Dojo-2-beta-4/).

{% asset_img featured.png feature-full %}

<!-- more -->

## Getting beta 5

Beta 5 is currently tagged as `latest` in npm, so simply updating to the latest version will provide you with the Beta 5 release.  We also have a release tag of `beta5` in npm if you want to focus just on using Beta 5.

This will be the final beta release for Dojo 2! As we make releases of packages in anticipation of Release Candidate 1, we will not publish those packages to `latest` until Release Candidate 1 is available.

## Just getting started

If you want to get started with Dojo 2, the best way is to take a look at our [tutorials](/tutorials/) or even take a look at Dojo 2 in action with our [example applications](https://dojo.github.io/examples/) (source on [GitHub](https://github.com/dojo/examples)).  Good starting tutorials are:

* [Dojo 2 local installation](/tutorials/000_local_installation/)
* [Your first Dojo 2 application](/tutorials/001_static_content/)
* [Creating widgets](/tutorials/003_creating_widgets/)

## New in beta 5

Since the beta 4 release, we have made a number of improvements. The biggest changes and additions are mentioned here, with a complete list of changes

### Initial re-architecture of the build system

Prior to beta5, the structure of the build commands was focused around the tooling and not around the actual creation of applications. So we completed a re-architecture and restructuring of the commands to align more to their use. Specifically, `@dojo/cli-build-webpack` is deprecated and replaced with:

* [`@dojo/cli-build-app`](https://github.com/dojo/cli-build-app/) A command that builds an application
* [`@dojo/cli-build-widget`](https://github.com/dojo/cli-build-widget/) A command that build a widget, including support for web components
* Other commands may be planned for the future

This refactoring is mostly complete for Beta 5, with a few remaining items to complete for release candidate 1.

Usage of the build system is reflected in updates to the [Dojo 2 tutorials](https://dojo.io/tutorials/).

### Improvements to using Custom Elements/Web Components

[Added a decorator for the custom element descriptor](https://github.com/dojo/widget-core/pull/792). There is no longer a requirement for a separate module any more!

### `widget-core` changes

* [Focus meta](https://github.com/dojo/widget-core/pull/808)
* [Always render decorator](https://github.com/dojo/widget-core/pull/824)
* [Registry decorator](https://github.com/dojo/widget-core/pull/801)

The primary breaking change in `widget-core` is that [`HNode` was renamed to `VNode`](https://github.com/dojo/widget-core/pull/806)

### New widgets

Two new widgets were added in Beta 5:

* [Progress](https://github.com/dojo/widgets/issues/385) (`@dojo/widgets/progress/Progress`)
* [Toolbar](https://github.com/dojo/widgets/issues/386) (`@dojo/widgets/toolbar/Toolbar`)

These widgets may be viewed in the [widget showcase](https://dojo.github.io/examples/widget-showcase/).

### Stores

A number of refinements were made since the initial `@dojo/stores` release in Beta 4:

* [Add a basic `onChange` mechanism](https://github.com/dojo/stores/commit/b6165e6fd670874726e67ab166cb888967785d19)
* Improvements to providing type definitions for [state](https://github.com/dojo/stores/pull/143) and [payload](https://github.com/dojo/stores/pull/152)

See the [@dojo/stores readme](https://github.com/dojo/stores) for more information about this package.

### Updated examples

Our collection of [Dojo 2 examples](http://github.com/dojo/examples/) were updated for beta 5.

In particular, the [kitchen sink version of ToDoMVC](https://github.com/dojo/examples/blob/master/todo-mvc-kitchensink) now uses `@dojo/stores`.

Also the [Dojo 2 HNPWA](https://dojo-2-hnpwa-d668d.firebaseapp.com/) example was accepted and is now available.

### ESM packages

Dojo packages now ship ES modules alongside UMD! In the future we will be leveraging ESM for evergreen browser builds with webpack.

### Theme creation

A new [`cli-create-theme`](https://github.com/dojo/cli-create-theme) package has been added to make it easier to create a custom theme.

### Migrate to TypeScript 2.6

[TypeScript 2.6](https://blogs.msdn.microsoft.com/typescript/2017/10/31/announcing-typescript-2-6/) was released and introduced a number of significant improvements to the language, in particular the strictness of certain types of typings. These changes helped us further refine the type definitions and find a few bugs along the way. Dojo 2 beta 5 ships all of its packages leveraging TypeScript 2.6, and all packages conform to `strict` type mode.

## What's next?

We are nearly there for the initial 2.0 release. For RC1 in just a few weeks, you can look forward to:

*  More end developer tooling improvements
	* `dojo/cli-build-app` Finish re-architecture of the build system
	* `dojo/cli-build-widget` Focused build process for Dojo 2 widgets as web components
* `dojo/themes` A new package for Dojo 2 themes
* `dojo/widget-core` Finish DOM abstraction
* `dojo/widgets` Standardize widget events
* Additional theme to provide Dojo 1 flat theme style interoperability

At the moment, we are planning for RC1 in early February.

We are also working on additional features post Dojo 2.0:

* Development and diagnostic tools
* `dojo/dgrid` Powerful data grid widget


## Getting involved

If you want to get involved, you can see an overview of the parts of Dojo 2 at [dojo/meta](https://github.com/dojo/meta).  In all of our repositories we use the labels [`good first issue`](https://github.com/dojo/meta/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) and [`help wanted`](https://github.com/dojo/meta/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) to help guide you on a good place to get started.
