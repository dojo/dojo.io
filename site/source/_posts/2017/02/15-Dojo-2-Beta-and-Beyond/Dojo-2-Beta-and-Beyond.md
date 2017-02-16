---
title: 'Dojo 2: Beta and Beyond'
date: 2017-02-15 09:14:32
tags:
---
## The Site ##    {.main}

Dojo 2 is the most substantial [rethink](https://www.sitepen.com/blog/2016/06/09/dojo-is-doing-it-again/) to our powerful enterprise JavaScript toolkit in ten years. We [recently mentioned](https://www.sitepen.com/blog/2016/08/24/the-long-and-winding-road-to-dojo-2/) that Dojo 2 is nearing beta status for the majority of its modules. As we prepare for the Dojo 2 beta release, we have defined our goals and objectives for this release. We'll start with a few definitions: _**Package**_: stored as a Github repo, e.g. [dojo/stores](https://github.com/dojo/stores), a Dojo 2 package may be used on its own or as part of the Dojo 2 platform _**Module**_: an ES6 module (ESM), e.g. [dojo/store/MemoryStore](https://github.com/dojo/stores/blob/master/src/createMemoryStore.ts), found within a package _**Code Complete for Beta**_: a package, module, or feature where:

*   all standard features are code complete
*   all provided features are tested using [Intern](https://theintern.github.io/)
*   test code coverage is greater than 90%
*   in-code documentation (where applicable) is complete
*   there are no outstanding repo issues in Github, marked as a bug and assigned to a milestone
*   we have included example usage in an [example app](https://github.com/dojo/examples/)


![](http://www.sitepen.com/blog/wp-content/uploads/2016/11/Dojo2-Packages.jpg){.img}

## What will be in the Dojo 2 beta?

We are happy to include the following packages:

*   [dojo/actions](https://github.com/dojo/actions) - a command library
*   [dojo/app](https://github.com/dojo/app) - an application framework
*   [dojo/cli](https://github.com/dojo/cli) - the command line interface for creating and managing apps
*   [dojo/compose](https://github.com/dojo/compose) - a mixin/trait based composition library
*   [dojo/core](https://github.com/dojo/core) - the foundational code of the Dojo 2 platform (events, async patterns, etc.)
*   [dojo/dom](https://github.com/dojo/dom) - a set of APIs for manipulating the DOM
*   [dojo/has](https://github.com/dojo/has) - a feature detection library
*   [dojo/i18n](https://github.com/dojo/i18n) - a set of internationalization tooling
*   [dojo/interfaces](https://github.com/dojo/interfaces) - common interface definitions shared across Dojo 2 packages
*   [dojo/loader](https://github.com/dojo/loader) - a TypeScript based CJS and AMD loader
*   [dojo/routing](https://github.com/dojo/routing) - a routing service to build web applications
*   [dojo/shim](https://github.com/dojo/shim) - modules that provide polyfills of ES6+ functionality
*   [dojo/stores](https://github.com/dojo/stores) - data store API and implementation, including querying, transformation, and materialization
*   [dojo/widgets](https://github.com/dojo/widgets) - a set of rich UI elements

In order to make it easier to get started with Dojo 2, we will publish several example applications that demonstrate usage and best practices. Examples are found at:

*   [dojo/examples](https://github.com/dojo/examples) - a set of example applications

We will include the following modules for dojo/stores:

*   at least two store implementations (Memory and RESTful JSON) with local and cache abilities
*   initial data querying, transformation, and materialization capabilities

We will include the following for dojo/widgets:

*   at least six widget implementations (Button, TextInput, List, TabbedPanel, ResizePanel, and LayoutContainer)

We will also be working on the port of [dgrid](http://dgrid.io/) to Dojo 2 which will reach beta shortly after Dojo 2. If you want the latest up-to-date status information on what is in Dojo 2, please follow our [dojo/meta](https://github.com/dojo/meta) package.

## What does beta mean to the community?

During the beta, we reserve the right to alter the API of features where required. Our goal is to provide a stable API wherever possible. We acknowledge that the API will be adapting to breaking changes, improvements to the code, and addressing newly found bugs.

## Who should use the beta release?

The Dojo 2 beta is for early adopters and those looking to learn what is coming soon. If you are looking to build web apps with TypeScript in a powerful new way, then Dojo 2 is an excellent choice.

## What about dgrid 2?

dgrid 2 will reach beta after Dojo 2 is in beta. We aim to release dgrid 2, which leverages Dojo 2, at the same time as the Dojo 2 release. dgrid 2 is expected to leverage many of the features of Dojo 2, including dojo/compose, dojo/widgets, and dojo/stores. dgrid 2 will remain a separate package to serve as a reference for how to create a custom Dojo 2 package. We also aim to make it easier to leverage dgrid 2 independently of Dojo 2\. This will make it a straightforward process to leverage dgrid within frameworks such as Angular 2 or React+Redux, demonstrating interoperability across frameworks. ![](http://www.sitepen.com/blog/wp-content/uploads/2016/11/Dojo2-BETA.jpg)

## What happens after beta?

The beta phase will run until we have fixed all known issues marked as bugs that link to a milestone. We will permit low level or cosmetic bugs in the Release Candidate (RC). When we declare Dojo 2 to be an RC, we are announcing to the community that the code is stable enough to use for writing web apps. Once we are in the RC phase, we will attempt not to alter any of the public APIs. When we need to update an API after beta and before the first RC, we will publish a blog post (or similar) that details:

*   the previous API (with a code example)
*   the new API (with a code example)
*   how to move to the new API (with a code example)
*   the reason for the change
*   why the API should be free from additional alterations in the future

During the RC phase, we will complete a set of tutorials that explain the major functionality found in Dojo 2 and how to efficiently build Dojo 2 applications. Some packages may have many tutorials, while other packages that are not developer-facing may have more limited documentation. A video tutorial for dojo/cli is also planned. ![](http://www.sitepen.com/blog/wp-content/uploads/2016/11/Dojo2-Golden-Land.jpg)

## How do we get out of the RC phase and into the golden land of the official release?

Exiting RC will be a combined effort between the maintainers and the community. We will release Dojo 2 when the quality is high enough to meet the community's standards. We will aim for as few RC releases as necessary before the official release.

## Get involved

Dojo 2 is a major rethink of how we build modern web applications. It leverages the things we love about Dojo 1.x, along with a wide variety of modern best practices and features introduced by ES6+ and TypeScript. We aim to create an approach to building applications that is efficient, consistent, and stable in a world that is typically none of these. We're very excited about how far we've come, and how much we've been able to leverage given the major improvements to JavaScript engines and browsers over the past few years. We definitely need your help to finish the first Dojo 2 release! Please see [our guide](https://dojotoolkit.org/community/roadmap/) if you would like to get involved with helping to build or test Dojo 2.

* * *

## Learning more

<div style="margin-left: 20px;">[![Support Logo](http://www.sitepen.com/blog/wp-content/uploads/2016/06/SupportLogoBlogs2.jpg)](https://www.sitepen.com/support/index.html)

Get help from [SitePen Support](https://www.sitepen.com/support/index.html), our fast and efficient solutions to JavaScript development problems of any size.

[![Workshops Logo](http://www.sitepen.com/blog/wp-content/uploads/2016/06/workshopslogoblogs2.jpg)](https://www.sitepen.com/workshops/index.html)

SitePen workshops are a fun, hands-on way to keep up with JavaScript development and testing best practices. [Register](https://www.sitepen.com/workshops/index.html) for an online workshop, today!

[![Let's Talk! Logo](http://www.sitepen.com/blog/wp-content/uploads/2016/06/ConsultingLogoBlogs2.jpg)](https://www.sitepen.com/site/contact.html)

[Let's talk](https://www.sitepen.com/site/contact.html) about how we can help your organization improve their approach to automated testing.

[![Contact Us Logo](http://www.sitepen.com/blog/wp-content/uploads/2016/06/ContactLogoBlogs2.jpg)](https://www.sitepen.com/site/contact.html)

Have a question? We're here to help! [Get in touch](https://www.sitepen.com/site/contact.html) and let's see how we can work together.

</div>