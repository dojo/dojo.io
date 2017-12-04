---
layout: cookbook
category: widgets
title: Render a list from an array
overview: Render an array of items as a HTML list
---

## Objective

This recipe demonstrates how to render one or many items part of an array.

## Code example

```ts
export class HelloWorld extends WidgetBase {
    private _people = [{
        name: 'person 1'
    }, {
        name: 'person 2'
    }];

    render() {
        const people = this._people.map((person) => v('li', [person.name]));
        return v('ul', people);
    }
}
```

This code example above does the following:

1. Defines a `_people` array containing two objects
2. The `render` method maps over the array to create a `people` array containing two virtual DOM nodes
3. The `people` array of virtual DOM nodes is passed as a child property to the `ul` node
