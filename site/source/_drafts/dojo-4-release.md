---
title: Dojo Version 4.0
authorId: paul
---
 “Developer ergonomics improvements and automatic build time optimisations and code splitting”

## Being a Better Dojo

We believe that developer ergonomics and strong community suport are fundamental reasons for choosing any framework. If you can't be comfortable and efficient working with a system why choose it in the first place? It's what leads us to engage with our community and constantly look ahead to a better, brighter Dojo.

Two of the most considerable undertakings this release will allow the Dojo framework to focus on delivering a consistent and positive development experience. First, the underlying [Virtual DOM Engine](https://github.com/dojo/framework/issues/54) has been completely rewitten to allow vdom nodes and widgets to both be rendered as first-class citizens. This has opened up the opportunity to make a number of improvements like replacing the `ProjectorMixin` with an easier to use `renderer`. The `ProjectorMixin` was always one of the more confusing aspects that was immediately felt by new developers. We believe the `renderer` is more direct and consistent with how the vdom uses widgets throughout Dojo.

Next, we have consolidated and removed a number of modules in Dojo framework that have been kept around to provide tooling or legacy support. Modules like `List`, `DateObject`, `Task`, and `request` were tools brought over from the old Dojo Toolkit that had proved to be useful in the past. But, the more we've used Dojo with TypeScript and modern concepts, the less we find a need for these tools. So we made the decision to say goodbye to a lot of old, familiar friends to better focus on creating the best possible virtual DOM framework.

been a complete rewrite of the underlying [Virtual DOM Engine](https://github.com/dojo/framework/issues/54) and a pruning of 

* Goodbye ProjectorMixin
* Consilidating dojo/framework
    * A number of modules have been removed that provided legacy support to es5 browsers.
    * Of note: dojo/core/request : use fetch polyfill; async interfaces Task; utilities and collections: List, DateObject, Observable
* Outlets are now Widgets
    * removed onEnter and onExit to make routes static. Will help w/ automatic code-splitting to improve performance and time-to-interaction
* Updates to testing (unit, functional builds)
* StoreProvider widget: https://github.com/dojo/framework/issues/76
* @watch() for internal properties https://github.com/dojo/framework/issues/74
* improved and added error & warning messages

## Migration

* brief instructions `npm install @dojo/cli-upgrade-app --no-save` and run `dojo upgrade app`
* Update cli commands and if you're using `@dojo/widgets` or `@dojo/interop` upgrade those to 4.0
* See the [migration guide]() // TODO LINK

## Support

* [Discord](https://discord.gg/M7yRngE)
* Checkout our [roadmap](https://dojo.io/community/)
