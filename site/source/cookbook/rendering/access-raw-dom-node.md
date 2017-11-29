---
layout: docs
category: rendering
title: Access a raw DOM node
overview: Access a raw DOM node to retrieve styling information
---

## Objective

This recipe demonstrates a technique of getting raw DOM elements via the Dojo 2 API and then extracting computed styling information from such elements.

## Procedure

1. Create a `meta/getStyle.ts` file:

```ts
import MetaBase from '@dojo/widget-core/meta/Base';

class getStyle extends MetaBase {
  get(key: string, style: string) {
    const node = this.getNode(key);

    if (node) {
      const computedStyle = window.getComputedStyle(node);
      return computedStyle[style];
    }
  }
}

export default getStyle
```

The `getStyle` function does the following:

* Extends from `'@dojo/widget-core/meta/Base'` which provides access to DOM node utility functions
* Retrieves a DOM node based on the passed in key
* Extracts the computed style of the selected DOM node

2. First import the `getStyle` function:

```ts
import getStyle from '../meta/getStyle';
```

3. To use the `getStyle` function from a widget, use the `meta` method:

```ts
render() {
  const style = this.meta(getStyle).get('node', 'color');
  console.log(`The color is: ${style}`);

  return v('div', {
    key: 'node'
  }, ['Hello']);
}
```

Observe: `The color is: rgb(0, 0, 0)` is logged to the DevTools console.

## Additional resources

The [Dojo 2 Meta Configuration](https://github.com/dojo/widget-core#meta-configuration) documentation offers extra information on meta configuration.