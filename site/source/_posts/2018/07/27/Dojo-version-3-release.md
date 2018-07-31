---
title: Dojo Version 3.0
date: 2018-07-27 08:00:00
authorId: devpaul
featured_image: featured.jpg
---
{% asset_img featured.jpg feature-full %}

## Building on Success

Some changes are happening with Dojo. As the project continues to stabilize around a set of modules and APIs, we are continually evaluating feedback from the community as well as our processes.

<!-- more -->

First things first, when we released the next generation of Dojo, we wanted to strongly disambiguate between the legacy Dojo toolkit by naming it Dojo 2. Now that we have released Dojo 2 and are moving on with further releases we are going to drop the version number, and from now on we refer to it as Dojo.

Also of note during the Dojo 2 cycle, we identified that pain points were going to become bottlenecks and affect the momentum of the project. Central to these issues was the complexity of managing the eight projects that make up the basis of the dojo framework: core, has, i18n, routing, shim, stores, test-extras, and widget-core. We found that managing these projects individually required a great deal of coordination when publishing and working with their inter-dependencies.

## So We Made a Change

Now that the core Dojo packages are stable, we decided to consolidate these packages into a single one with [@dojo/framework](https://github.com/dojo/framework). In doing this, we have hopefully improved the Dojo project in a few ways:

* End users no longer have to worry about the current working set of package versions, there is just one package and version.
* [A single place to raise issues and feature requests](https://github.com/dojo/framework/issues).
* A stronger focus on how dojo as a framework fits together to provide the best possible experience, over the old siloed packages approach.
* Simplifying our management and release process allowing us to iterate quicker

## Migration

The new @dojo/cli-upgrade-app package aims to provide users with a friction-free upgrade path between major Dojo versions starting at 2.x. For more information see the [v3 migration guide](https://github.com/dojo/framework/blob/55042dfbb8b7c9b46012be3351fd7fa064e0fa5a/docs/V3-Migration-Guide.md).

## Support

In other news, our official chat support is now on Discord, so head on over to the [Dojo Discord channel](https://discord.gg/M7yRngE) and also check out updated examples on [CodeSandbox](https://codesandbox.io/s/github/dojo/dojo-codesandbox-template).
