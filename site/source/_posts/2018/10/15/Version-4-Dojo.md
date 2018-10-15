---
title: Announcing Version 4 of Dojo
date: 2018-10-15 12:00:00
authorId: devpaul
featured_image: featured.jpg
---
## Being a Better Dojo

Developer ergonomics, efficient source code, consistent and flexible architecture, interoperability and alignment with modern standards, and strong community support are fundamental reasons for choosing a framework. We’re constantly looking for ways to improve Dojo and provide the community with the best possible modern framework.

{% asset_img featured.png feature-full %}

<!-- more -->

## Dojo CLI Tooling

The main focus of version 4 of Dojo is improving application optimization and analyzing, focusing on tooling that can enable these features by default. Separating a Dojo application into bundles (often referred to as code splitting) has been possible since the initial Dojo release. Although this did not require you to change your source code, it did require adding some configuration to specify how your application should be bundled. We wanted to do better by default and in version 4, the [Dojo build tooling will automatically split an application based on its top-level routes](https://github.com/dojo/cli-build-app#code-splitting-by-route)!

The application template used by `cli-build-app` provides this functionality out of the box. In addition to this a bundle analyzer is automatically generated when running a build in production mode, providing even more insight into you bundles.

<img src="./bundleAnalyzer.png" alt="Dojo Bundle Analyzer" height="500" width="334" />

This is provided by the template app generated with `@dojo/cli-create-app`.

Even with version 4 of Dojo being a step in the right direction, there's much more we can and are planning to do including critical path bundling, bundle size analysis and budgets, lighthouse reports, and more.

Enabling you to create applications that perform better for your end users is very important to us, however, we also want to ensure that the development experience remains streamlined. As a result, we've made a number of changes to our build tooling to enable features such as HTTPS and proxy configuration support.

Other CLI improvements include the [support for externals](https://github.com/dojo/cli-build-app#externals-object), allowing non-modular libraries or standalone applications that cannot be bundled normally to be included in a Dojo application.

The automatic parsing, hashing and bundling of resources from index.html, and inclusion of assets from the catch-all `assets` directory. These changes support the creation of more complex applications.

## Performance First

To keep applications as small as possible, the CLI follows a few key principles:
Evergreen builds by default, with support for older browsers back to IE11 by explicit opt-in. This reverses behavior in the past of supporting all browsers by default, so that newer browsers get smaller and faster applications as they add support for features natively.

As part of our support for Progressive Web Apps (PWA), we optimize for the the [PRPL pattern](https://developers.google.com/web/fundamentals/performance/prpl-pattern/):

* Push critical resources for the initial URL route.
* Render initial route.
* Pre-cache remaining routes.
* Lazy-load and create remaining routes on demand.

The [HNPWA reference Dojo example](https://dojo-2-hnpwa-d668d.firebaseapp.com/) is less than 20KB gzipped and is among the fastest performance of any client-side JavaScript application framework!

The CLI tooling has three main pathways for the creation and building of apps, themes, and widgets.

## Dojo Framework

It has been a busy release for `@dojo/framework` also, which adds a range of new features plus a few changes to existing concepts and patterns. The focus has been cleaning up the existing codebase and creating better ergonomics for a few concepts.

The Virtual DOM engine has been redesigned and rewritten from the ground up. This was a large undertaking which identified and resolved a number of bugs in the old engine, enabled a number of new features, improved rendering performance and finally reduced the overall size of the framework!

The are a few improvements when using the `w()` and `v()` pragmas, including better composition of nodes, rendering a dynamic import directly using `w()` and enabling the use of `meta` for nodes that are passed as children to a widget.

The routing system within the framework received an improved route matching algorithm for this release. Additionally a [more flexible `Outlet`][Outlet PR] works via a render property. The `ActiveLink` widget also applies classes when an item is considered active.

dojo/stores adds middleware support for Local storage in this release, and a new [`StoreProvider`][StoreProvider PR] eases the injection of application state.

## Widgets

With the concentration on the CLI tooling and `@dojo/framework` itself, it has not left much time for `@dojo/widgets`. But.... yes but, as part of Dojo 4 there is a new data grid available, it's currently very basic in terms of features, but over the next few months we will be working on improving, with a focus on feedback from our users. This feedback will help us decide which features to work on next.

If our `@dojo/widgets` grid does not work for you yet, a new dgrid wrapper has been added to `@dojo/interop`. The wrapper can be used in combination with the CLI build externals to support using dgrid with Dojo version 4 and includes support with some of the most populate dgrid mixins.

The existing widgets received many accessibility, keyboard, and focus refinements.

## Migration

All of the breaking changes in Dojo 4, were carefully considered beforehand as we understand the impact that they can have on your decision to upgrade. To assist with the transition we have updated the CLI upgrade command, which will automatically upgrade your Dojo dependencies, upgrade your application code where possible and highlight areas in the application that require manual intervention. For more information on what has changed in Dojo 4, please see the [migration guide][Migration Guide].

TypeScript forwards-compatibility was updated from 2.7 to 3.0.

## Support

See the [release notes](https://github.com/dojo/framework/releases/tag/v4.0.0) for more details on version 4.0.0 of Dojo!

Love what we're doing or having a problem? We ❤️ our community. Reach out to us on [Discord], check out our [roadmap] and see where Dojo is headed, and try out the new Dojo on [CodeSandbox]. We look forward to your feedback!

[StoreProvider PR]: https://github.com/dojo/framework/issues/76
[Outlet PR]: https://github.com/dojo/framework/pull/63
[Migration Guide]:https://github.com/dojo/framework/blob/master/docs/V4-Migration-Guide.md
[cli-upgrade]: https://www.npmjs.com/package/@dojo/cli-upgrade-app
[Discord]: https://discord.gg/M7yRngE
[roadmap]: https://dojo.io/community/
[CodeSandbox]: https://codesandbox.io/s/github/dojo/dojo-codesandbox-template
