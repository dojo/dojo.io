---
layout: cookbook
category: modern-web-apps
title: Access drag information
overview: Retrieve drag related information for elements on the page
---

## Objective

This recipe demonstrates a technique for accessing drag related information for elements on the page.

## Procedure

1. Import the drag meta API:

```ts
import { Drag } from '@dojo/widget-core/meta/Drag';
```

2. Fill in your `render()` method:

```ts
protected render() {
    const {isDragging, delta} = this.meta(Drag).get('draggable');

    return v('div', [
        v('div', {
            draggable: true,
            key: 'draggable'
        }, [ 'Drag me!' ]),

        v('p', [
            `Is Dragging?: ${isDragging}`
        ]),

        v('p', [
            `Delta: ${JSON.stringify(delta)}`
        ])
    ]);

}
```

## Additional resources

The [drag documentation](https://github.com/dojo/widget-core#drag) has an alternative code example to access drag information.