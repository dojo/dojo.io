---
layout: docs
category: widgets
title: Force a widget to re-render itself
overview: Use the invalidate method to force a widget to re-render itself
---

## Objective

This recipe demonstrates how a widget can force itself to re-render when it is clicked on.

## Code example

This code example does the following:

1. Defines a `HelloWorld` widget
2. Invokes the method `this.invalidate()` within a click handler

```js
class HelloWorld extends WidgetBase {
    render() {
        return v('div', {
            onclick: this.invalidate
        }, ['Hello!']);
    }
}
```

All Dojo 2 widgets extend from `WidgetBase` and inherit an `invalidate` method.

When a widget is invalidated, its `render()` method is invoked.

## Additional resources

* The [Responding to events](https://dojo.io/tutorials/004_user_interactions/) tutorial demonstrates this technique with a partical use case