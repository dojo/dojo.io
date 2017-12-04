---
layout: cookbook
category: widgets
title: Use JSX templating
overview: Use JSX templating to construct your virtual DOM
---

## Objective

This recipe demonstrates how to configure your Dojo 2 application to use [JSX templating](https://facebook.github.io/jsx/). Note, TSX is the TypeScript version of JSX.

## Procedure

1. Rename your `Widget.ts`/`Widget.js` file to `Widget.tsx`.

2. Add the following configuration to your `tsconfig.json` file:

```json
"include": [
  "./src/**/*.ts",
  "./src/**/*.tsx",
  "./tests/**/*.ts"
]
```

3. Add the `tsx` import into your file:

```ts
import { tsx } from '@dojo/widget-core/tsx';
```

4. Convert your `v()` virtual DOM node function calls to use JSX:

Change this:

```ts
render() {
  return (
    v('div', [ 'Hello' ])
  );
}
```

Into this:

```ts
render() {
  return (
    <div>
      Hello
    </div>
  );
}
```

## Additional resources

* The [JSX Support](https://github.com/dojo/widget-core#jsx-support) section in the widget core documentation also covers how to use JSX templating in your Dojo 2 app
* [JSX Documentation](https://www.typescriptlang.org/docs/handbook/jsx.html) in the TypeScript handbook