---
title: Dojo Version 4.0
authorId: paul
---

## Being a Better Dojo

We believe that developer ergonomics and strong community support are fundamental reasons for choosing any framework. If you can't be comfortable and efficient working with a system why choose it in the first place? It's what leads us to engage with our community and constantly look ahead to a better, brighter Dojo.

Two of the most considerable undertakings this release will allow the Dojo framework to focus on delivering a consistent and positive development experience. First, the underlying [Virtual DOM Engine][vdom PR] has been completely rewritten to allow vdom nodes and widgets to both be rendered as first-class citizens.

 This has opened up the opportunity to make a number of improvements, like replacing the `ProjectorMixin` with an easier to use `renderer`. The `ProjectorMixin` was always one of the more confusing aspects that was immediately felt by new developers. We believe the `renderer` is more direct and consistent with how the vdom uses widgets throughout Dojo.

Next, we have consolidated and removed a number of modules in the Dojo framework that have been kept around to provide tooling or legacy support. Modules like `List`, `DateObject`, `Task`, and `request` were tools brought over from the old Dojo Toolkit that had proved to be useful in the past. But, the more we've used Dojo with TypeScript and modern concepts, the less we find a need for these tools. So we made the decision to say goodbye to a lot of old, familiar friends to better focus on creating the best possible virtual DOM framework.

Dojo 4 adds dozens of other improvements that make it easier and more expressive. 

* better ways of working with [`Outlet`s][Outlet PR]
* a new [`StoreProvider` widget][StoreProvider PR] making store data easier to access in widgets
* more descriptive error and warning messages

You can read more about all of the new features in detail in the [Dojo 4 Migration Guide][Migration Guide].

## Migration

The [`@dojo/cli-upgrade-app`][cli-upgrade] tool has been updated to allow for a smooth transition between Dojo 3 and Dojo 4. Simply upgrade Dojo's cli and widget packages to 4.0 and run `npm install @dojo/cli-upgrade-app@4 --no-save` and run `dojo upgrade app`. For more information please see the [migration guide][Migration Guide].

## Support

Love what we're doing or having a problem? We ❤️ our community. Reach out to us on [Discord], check out our [roadmap] and see where Dojo is headed, and try out the new Dojo on [CodeSandbox]. Hope to see you soon!

[vdom PR]: https://github.com/dojo/framework/issues/54
[StoreProvider PR]: https://github.com/dojo/framework/issues/76
[Outlet PR]: https://github.com/dojo/framework/pull/63
[Migration Guide]:https://github.com/dojo/framework/blob/47dddefb4e237069b31cc45bc4216182fc2017b3/docs/V4-Migration-Guide.md
[cli-upgrade]: https://www.npmjs.com/package/@dojo/cli-upgrade-app
[Discord]: https://discord.gg/M7yRngE
[roadmap]: https://dojo.io/community/
[CodeSandbox]: https://codesandbox.io/s/github/dojo/dojo-codesandbox-template
