---
layout: cookbook
category: modern-web-apps
title: Use built-in Dojo ponyfills
overview: Use a built-in Dojo ponyfill within your application
---

## Objective

This recipe demonstrates how to use built-in Dojo [ponyfills](https://github.com/sindresorhus/ponyfill) within your app. This recipe will focus on the `Array.from` ponyfill.

## Procedure

1. Import the `Array.from` function:

```ts
import { from } from '@dojo/shim/array';
```

2. Use the imported function:

```ts
from('hello'); // ["h", "e", "l", "l", "o"]
```

## Additional resources

* Explanation on [what a ponyfill is](https://github.com/sindresorhus/ponyfill)
* [Dojo Shim](https://github.com/dojo/shim/) GitHub project