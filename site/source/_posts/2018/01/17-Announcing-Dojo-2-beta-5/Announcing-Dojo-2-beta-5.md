---
title: Announcing Dojo 2 beta 5!
date: 2018-01-17 09:00:00
authorId: dylan
featured_image: featured.png
---

Dojo is a modern, reactive framework authored with ES2017 and TypeScript, and optimized with the needs of enterprise application development in mind.

If you're learning about Dojo 2 for the first time, please read our overview about the [Dojo 2 beta 4 release](https://dojo.io/blog/2017/12/04/Announcing-Dojo-2-beta-4/).

{% asset_img featured.png feature-full %}

<!-- more -->

## Getting Beta 5

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

TODO: List major changes (why, and that it's been split up)

### Improvements to using Custom Elements/Web Components

TODO: Explain

### widget-core performance and memory improvements

TODO: Explain, provide metrics?

### New widgets

TODO: Details about the addition of the Progress and Toolbar widgets

### Updated examples

TODO: Summary of examples and what was updated

### Theme creation and new dojo/themes package

TODO: Explain  Improvements to tooling around theme creation

### Migrate to TypeScript 2.6

TODO: Explain, fully strict, etc.

## What's next?

We are nearly there for the initial 2.0 release. For RC1 in just a few weeks, you can look forward to:

TODO: Explain these items

*  More end developer tooling improvements
	* dojo/cli-build-app Finish re-architecture of the build system
	* dojo/cli-build-widget Focused build process for Dojo 2 widgets as web components
    * dojo/devtool A development tool for Dojo 2 (Chrome and Firefox)
    * dojo/diagnostics A diagnostic API for debugging Dojo 2 applications
* dojo/widget-core Finish DOM abstraction
* dojo/widgets Standardize widget events
* Dojo 1 flat theme interoperability

At the moment, we are planning for RC1 in early February.

## Getting involved

If you want to get involved, you can see an overview of the parts of Dojo 2 at [dojo/meta](https://github.com/dojo/meta).  In all of our repositories we use the labels [`good first issue`](https://github.com/dojo/meta/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) and [`help wanted`](https://github.com/dojo/meta/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) to help guide you on a good place to get started.
