---
layout: cookbook
category: rendering
title: Get the rendered dimensions of an element
overview: Use built-in Dojo 2 methods to retrieve the rendered dimensions of a page element
---

## Objective

This recipe demonstrates how to get the rendered dimensions of an element on the page.

## Procedure

1. Import the `Dimensions` meta provider:

```ts
import Dimensions from '@dojo/widget-core/meta/Dimensions';
```

2. Implement a `render` method. You can retrieve a virtual DOM node by its `key` property value:

```ts
protected render() {
    const result = this.meta(Dimensions).get('child-element');

    return v('div', [
        v('div', {
            key: 'child-element'
        }, [
            `Dimensions: ${JSON.stringify(result)}`
        ])
    ]);
}
```

3. Observe the resulting dimensions are:

```json
{
  "offset": {
    "height": 18,
    "left": 8,
    "top": 8,
    "width": 1540
  },
  "position": {
    "bottom": 26,
    "left": 8,
    "right": 1548,
    "top": 8
  },
  "scroll": {
    "height": 18,
    "left": 0,
    "top": 0,
    "width": 1540
  },
  "size": {
    "width": 1540,
    "height": 18
  }
}
```

## Additional resources

See the [Dojo 2 Meta Configuration](https://github.com/dojo/widget-core#meta-configuration) documentation for more information