---
title: Dojo 5
date: 2019-01-28 08:00:00
authorId: unknown
featured_image: featured.jpg
---
{% asset_img featured.jpg feature-full %}

Dojo version 5 has arrived!

We're excited to announce the 5.0.0 release of Dojo. This version builds on previous releases with a vast array of bug fixes and improvements throughout the framework.

### Conditional Polyfills - Serving Less JavaScript

One of our primary goals for modern Dojo is to improve performance by serving minimal JavaScript bundles by default. For version 5, we're happy to announce an out of the box solution to optimize user experience for dealing with bundling and loading polyfills in Dojo applications.

By using `@dojo/framework/shim` ponyfills for [`WebAnimations`](WebAnimationsAPI), [`IntersectionObserver`](IntersectionObserverAPI), [`ResizeObserver`](ResizeObserverAPI), and [`fetch`](FetchAPI) the Dojo build produces separate "platform" bundles that will be **only** be loaded based on two key conditions:

1) The shim module is imported somewhere in an application.
1) A users browser does not natively support the browser feature.

In short, if your application does not use the browser feature or you use a browser with native support, the polyfill will not be loaded! This means serving less JavaScript  and improving your application performance without compromising on features.

### Better Build Time Rendering (BTR)

Build time rendering provides the rendering of your application to HTML during the build and in-lines critical CSS. This allows an application to effectively render static HTML pages and provide some advantages of server-side rendering (SSR) such as performance and search engine optimization without the complexities of running a server to support full SSR. Build time rendering has been available via the Dojo [cli-build-app](CliBuildAppReadme)  command since our initial 2.0.0 release.

The 5.0.0 release brings a more robust, flexible and feature-rich build time render by running your application at build time in a browser environment.

Routing support has also been extended to support a `HistoryManager` using the browser [history API](HistoryAPI) via the `@dojo/framework/routing/history/StateHistory`. For `StateHistory` BTR produces a static html file for each of the paths defined in the build time rendering configuration.

To configure build time rendering to create static pages for the BTR paths, ensure you are using the `StateHistory` in your application and update your BTR config to specify paths without a `#` prefix.

```json
"build-app": {
	"build-time-render": {
		"root": "app",
		"paths": [
			"home",
			"about",
		]
	}
}
```

### Introducing Dojo Blocks

Leveraging the improved BTR, Dojo Blocks open the door for creating rich static websites by enabling code to be executed in Node.js at build time and cached in the appropriate bundle for runtime.

For example, a Dojo Block module could read a group of markdown files, transform them into VNodes, and make them available to render in the application, all at build time. The result of this Dojo Block module is then cached into the application bundle for use at runtime in the browser.

A Dojo Block module gets used like any other [meta](MetaReadme) in any Dojo widget, as a result there is no extensive configuration or alternative authoring patterns needed.

For example, a block module could read a text file and return the content to the application:

```ts
// src/read-file.block.ts
import * as fs from 'fs';
import { resolve } from 'path';

export default (path: string) => {
	path = resolve(__dirname, path);
	return fs.readFileSync(path, 'utf8');
}
```

Using the `text.block.ts` module in your application with the [`Block` meta](https://github.com/dojo/framework/blob/master/src/widget-core/meta/Block.ts):

```ts
// src/MyBlockWidget.ts
import Block from '@dojo/framework/widget-core/meta/Block';
import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';

import readFile from './read-file.block';

export default class MyBlockWidget extends WidgetBase {
	protected render() {
		const message = this.meta(Block).run(readFile)('../content/hello-dojo-blocks.txt');
		return v('div', [ message ]);
	}
}
```

This widget runs the `read-file.block.ts` module at build time, loading the file path passed which is used as the children in the widget. The rendered application's HTML and CSS is written to the built `index.html`:

```html
<html>
<head>
	<title>Dojo Blocks</title>
	<meta name="theme-color" content="#222127">
	<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
	<div id="root"><div>Hello Dojo Block World!</div></div>
	<script type="text/javascript" src="bootstrap.js"></script></body>
</html>
```

### Simplifying Testing with Assertion Templates

Assertion Templates allow you to build expected render functions to pass to `h.expect()`. The idea behind Assertion Templates is to always assert against the entire render output, and modify portions of the assertion itself as needed.

To use Assertion Templates, first import the module:

```ts
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';
```

In your tests you can then write a base assertion which would be the default render state of your widget.

Given the following widget:

```ts
class NumberWidget extends WidgetBase<{ num?: number }> {
	protected render() {
		const { num } = this.properties;
		const message = num === undefined ? 'no number passed' : `the number ${num}`;
		return v('div', [
			v('span', [ message ])
		]);
	}
}
```

The base assertion might look like:

```ts
const baseAssertion = assertionTemplate(() => {
	return v('div', [
		v('span', { '~key': 'message' }, [ 'no number passed' ]);
	]);
});
```

and in a test would look like:

```ts
it('should render no number passed when no number is passed as a property', () => {
	const h = harness(() => w(NumberWidget, {}));
	h.expect(baseAssertion);
});
```

Now let's see how we would test the output when the `num` property is passed to the `NumberWidget`:

```ts
it('should render the number when a number is passed as a property', () => {
	const numberAssertion = baseAssertion.setChildren('~message', [ 'the number 5' ]);
	const h = harness(() => w(NumberWidget, { num: 5 }));
	h.expect(numberAssertion);
});
```

Here we're using the `setChildren()` API on the `baseAssertion`, and we're using a special `~` selector to find a node with a key of `~message`. The `~key` property is a special property on Assertion Templates and will be erased at assertion time so it doesn't show up when matching the renders. This allows you to decorate the Assertion Templates to easily select nodes, without having to augment the actual widgets render function.

Once we have the `message` node we then set the children to the expected `the number 5`, and use the resulting template in `h.expect`. It's important to note Assertion Templates always return a new Assertion Template when setting a value, this ensures you don't accidentally mutate an existing template (causing other tests to potentially fail), and allows you to compose layered Templates incrementally building on each other.

### Improved Stores Middleware

Middleware for Dojo stores has always been executed after a process has completed or throws an error, enabling users to make decisions based on the result and perform some additional actions. However, this was limiting middleware from running before or effectively wrapping a process. Version 5 of Dojo introduces `before` and `after` middleware to perform such actions around processes completely. [Read more on the `@dojo/framework/stores` readme](StoresReadme).

This is a breaking change. However, if your application was already using `createCallbackDecorator` to create your middleware, then they should continue to work with your application in version 5 of Dojo application as the `createCallbackDecorator` function has been adapted to transform existing middleware API to the new API.

### Extended TypeScript Support

Dojo now supports TypeScript versions from 2.6.x to 3.2.x, please see our [TypeScript and Dojo compatibility matrix](TypeScriptSupport) for more information.

### Update to Dojo 5.0.0

Visit the [Dojo version 5 migration guide](MigrationGuide) for detailed information and guidance on updating your application. Updating from 4.0.x to 5.0.0 should require running one command for most users.

After installing the latest version of the `@dojo/cli-upgrade-app`, run the following command:

```sh
dojo upgrade app
```

### Beyond version 5

We are working on a detailed road map for the next major release, however in the meantime check out our [future road map](RoadMap) for ideas we want to investigate over the next 12 months.

### Support

See the [release notes](ReleaseNotes) for more details on version 5 of Dojo.

Love what we’re doing or having a problem? We ❤️ our community. Reach out to us on [Discord](Discord), check out our [roadmap](https://dojo.io/community/) and see where Dojo is headed, and try out the new [Dojo on CodeSandbox](Codesanbox). We look forward to your feedback.

[CliBuildAppReadme]: https://github.com/dojo/cli-build-app#build-time-render-object
[FetchAPI]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[IntersectionObserverAPI]: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
[ResizeObserverAPI]: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
[WebAnimationsAPI]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
[HistoryAPI]: https://developer.mozilla.org/en-US/docs/Web/API/History
[MetaReadme]: https://github.com/dojo/framework/blob/master/src/widget-core/README.md#meta-configuration
[StoresReadme]: https://github.com/dojo/framework/blob/master/src/stores/README.md#middleware
[TypeScriptSupport]: https://github.com/dojo/framework#typescript-and-dojo-compatibility-matrix
[MigrationGuide]: https://github.com/dojo/framework/blob/master/docs/V5-Migration-Guide.md
[RoadMap]: https://github.com/dojo/meta/wiki/Roadmap#future-ideas
[Codesanbox]: https://codesandbox.io/s/github/dojo/dojo-codesandbox-template
[Discord]: https://discord.gg/M7yRngE
[ReleaseNotes]: https://github.com/dojo/framework/releases/tag/v5.0.0

