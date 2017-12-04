---
layout: cookbook
category: widgets
title: Pass and receive properties with widgets
overview: Pass down properties to a widget and receive them from within a widget
---

## Objective

This recipe demonstrates how to pass properties down to a widget and how to receive properties from within a widget.

## Code example

To pass properties down to a widget named `MyCustomWidget`, use the second argument of the `w` function:

```ts
import { w } from '@dojo/widget-core/d';

w(MyCustomWidget, {
    property: 'value',
    numbers: [1, 2, 3]
});
```

Dojo 2 widgets automatically have access to properties passed down from a parent. The properties can be accessed within the widget as `this.properties`.

```ts
class MyCustomWidget extends WidgetBase {
    render() {
        const {property, numbers} = this.properties;
        return v('div', [property]);
    }
}
```

## Additional resources

* Learn about more advanced forms of injecting state into widgets in the [State Management tutorial](https://dojo.io/tutorials/1010_containers_and_injecting_state/)
