---
title: Announcing Version 4 of Dojo
date: 2018-10-04 08:00:00
authorId: devpaul
featured_image: featured.jpg
---
{% asset_img featured.jpg feature-full %}

## Being a Better Dojo

Developer ergonomics and strong community support are fundamental reasons for choosing any framework. If you cannot be comfortable and efficient working with a system why choose it in the first place? It's what leads us to engage with our community and constantly look ahead to a better, brighter Dojo.

Two of the most considerable undertakings in this release focus on delivering a consistent and positive development experience. First, the underlying [Virtual DOM Engine][vdom PR] was rewritten to allow vdom nodes and widgets to get rendered as first-class citizens.

The new Virtual DOM system has opened up the opportunity to make many improvements, like replacing the `ProjectorMixin` with an easier to use `renderer` API. The `ProjectorMixin` was one of the more confusing aspects for developers new to Dojo. `renderer` is more direct and consistent with how the vdom uses widgets throughout Dojo.

Next, we have consolidated and removed many modules in the Dojo framework that were kept around to provide tooling or legacy support. Modules like `List`, `DateObject`, `Task`, and `request` were tools brought over from the old Dojo Toolkit that had proved useful in the past. However, the more we've used Dojo with TypeScript and modern concepts, the less we find a need for these tools. So we decided to say goodbye to a lot of old, familiar friends to better focus on creating the best possible virtual DOM framework.

Dojo Version 4 adds dozens of other improvements that make it easier and more expressive. 

Within `@dojo/framework`, we've made many improvements:

* TypeScript forwards compatibility from 2.7 to 3.0.
* [Ground up rewrite of the VDOM engine][vdom PR].
* Support for accessing meta information for nodes passed as children.
* Return `v()` nodes directly from new vdom `renderer`.
* Fix support for adding classes to SVG nodes.
* Better composition of v and w nodes, using `v()` and `w()`.
* Support dynamically imported widgets directly in `w()`.
* `onAttach` callback for the `dom()` pragma.
* New `watch` decorator to invalidate when a widget property is set.
* Improved route matching algorithm.
* [More flexible `Outlet`][Outlet PR], using a render prop.
* `ActiveLink` widget that applies classes when considered active.
* Local storage dojo/stores middleware.
* New [`StoreProvider`][StoreProvider PR] for injecting application state.

Numerous changes also improve the Dojo CLI:

* Automatic code splitting by top level routes.
* Development server now supports HTTPS.
* Dojo configuration support in the package.json.
* Proxy support with development server.
* Updated templates from cli-create-app, optionally with TSX.
* History API fallback for routing.
* Automatic parsing, hashing and bundling of resources from index.html.
* Include assets from catch all `assets` directory.
* Externals support with build app with dojo configuration.
* New application analyzer, with support for multiple bundles.

You can read more about all of the new features in detail in the [Dojo 4 Migration Guide][Migration Guide].

## Migration

The [`@dojo/cli-upgrade-app`][cli-upgrade] tool was updated to allow for a smooth transition between Dojo 3 and Dojo 4. Simply upgrade Dojo's cli and widget packages to 4.0 and run `npm install @dojo/cli-upgrade-app@4 --no-save` and run `dojo upgrade app`. For more information, please see the [migration guide][Migration Guide].

## Support

Love what we're doing or having a problem? We ❤️ our community. Reach out to us on [Discord], check out our [roadmap] and see where Dojo is headed, and try out the new Dojo on [CodeSandbox]. We look forward to your feedback!

[vdom PR]: https://github.com/dojo/framework/issues/54
[StoreProvider PR]: https://github.com/dojo/framework/issues/76
[Outlet PR]: https://github.com/dojo/framework/pull/63
[Migration Guide]:https://github.com/dojo/framework/blob/47dddefb4e237069b31cc45bc4216182fc2017b3/docs/V4-Migration-Guide.md
[cli-upgrade]: https://www.npmjs.com/package/@dojo/cli-upgrade-app
[Discord]: https://discord.gg/M7yRngE
[roadmap]: https://dojo.io/community/
[CodeSandbox]: https://codesandbox.io/s/github/dojo/dojo-codesandbox-template
