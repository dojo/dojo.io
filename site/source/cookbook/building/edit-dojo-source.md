---
layout: docs
category: building
title: Edit the Dojo 2 source code
overview: Edit the Dojo 2 source code for experimentation and debugging
---

## Objective

You may wish to modify source code in Dojo 2 to verify whether something is a bug in your application code, or within Dojo 2. Alternatively, you may wish to make a contribution to the project and assert your changes are working from the perspective of a Dojo 2 application.

This recipe demonstrates how to edit the Dojo 2 source code, and see the change within your app.

## Procedure

1. Download part of the Dojo 2 source code:

```sh
git clone --depth 1 https://github.com/dojo/widget-core
```

2. Make the change you require within widget-core, in this example, the `render` invocation within the Dojo 2 framework is instrumented with console timing functions.

Change this code:

```ts
// src/WidgetBase.ts
let dNode = render();
```

Into this:

```ts
// src/WidgetBase.ts
console.time('Render');
let dNode = render();
console.timeEnd('Render');
```

3. Build widget-core:

```sh
cd widget-core
npm i
./node_modules/.bin/grunt  release --pre-release-tag=beta3 --dry-run --skip-checks

# Verify you have a dist folder containing a built widget-core
ls dist
```

4. Within your Dojo 2 app, run this command:

```sh
# Needs to be the path to the built version of widget-core
npm i ../widget-core/dist/dojo-widget-core-0.3.1-beta3.1.tgz

# Verify the compiled JavaScript file includes the console timing instrumentation code
open node_modules/@dojo/widget-core/WidgetBase.js

# Build the app
dojo build -w
```

5. Navigate to `http://localhost:9999/` and verify you see at least one `Render: 0.135009765625ms` message in the DevTools console.
