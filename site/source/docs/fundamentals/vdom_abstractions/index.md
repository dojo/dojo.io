---
layout: docs
category: fundamentals
title: vDOM Abstractions - w and v in the d module
overview: Abstracting the DOM allows us to create presentation components programmatically. Dojo 2 provides a layer of abstraction between the DOM and its virtual counterpart as it exists in JavaScript as well as a layer of abstraction between this virtual DOM and Dojo 2 components - using a common syntax in a common module.
---

# vDOM Abstractions

## `@dojo/widget-core/d.ts`

Creating the DOM structure to support the syntax, style, and structure required to display a custom component may require a significant number of nodes. Because of this, many virtual DOM implementations have chosen single-letter function names to reduce typing and add clarity when reading code.

This module, named for what would be the single-letter shorthand function name for "Dojo 2" contains two single-letter functions each named for their purpose:

- `v`: used to create an abstract version of a DOM node
- `w`: used to create an abstract version of a widget

## Common variables

A node can be thought of as an object of a certain type, customized through properties, dispatching events through callbacks, with zero or more children. Condensing this down into a function where each argument can be isolated gives us a type, a set of properties, and a list of children.

Because Dojo 2 is [built on TypeScript](../typescript_and_dojo_2/), splitting arguments into these parts allows static type enforcement that can be based on the type of node being created. It also helps explain why `v` and `w` are separate functions, as each function enforces a different set of constraints on its arguments.

## `v` for vDOM

Dojo 2's virtual DOM function expects to receive the tag name, properties, and children as its three arguments. Only the tag name is required and other arguments may be omitted as long as properties and children are called in that order.

```ts
v('article');
// represents <article></article>
v('article', { id: 'first' });
// represents <article id="first"></article>
v('article', { id: 'first' }, [ v('p') ]);
// represents <article id="first"><p></p></article>
v('ul', [ v('li') ]);
// represents <ul><li></li></ul>
```

Within the properties argument are common properties a DOM node would have with the `classes` key using a `{ string: boolean }` syntax.

```ts
v('article', {
  id: 'first',
  classes: {
    insightful: true
  }
});
// represents <article id="first" class="important"></article>
```

Event handlers are passed directly within the properties, start with `on`, and can use the `bind` property to establish context when executed.

```ts
const hello = {
  subject: 'World'
};

v('button', {
  bind: hello,
  onclick() {
    console.log('Hello', this.subject);
  }
});
```

In these example, children have always been passed as `v` calls but may actually be, in addition, the result of `w` calls, strings, `null`, or `undefined`.


```ts
v('ul', [
  v('li', [ 'Bread' ]),
  v('li', [ 'Bacon' ]),
  v('li', [ 'Lettuce' ]),
  v('li', [ 'Tomato' ])
]);
// represents <ul><li>Bread</li><li>Bacon</li><li>Lettuce</li><li>Tomato</li></ul>
```

## `w` for widget

Dojo 2's widget function expects to receive as its type a class conforming to a lightweight interface of which two instance variables are important: `properties` and `children`. A `w` call receiving a class will use the types assigned to these two properties when enforcing what is passed to its other arguments.

Unlike `v`, the second argument must be the properties and is not optional, though the child array is optional.

```ts
w(Button, {
  disabled: true
}, [ 'Click me!' ]);
```

As an alternative, `w` also accepts a string which will derive the widget type instead through that widget's [registry](../../../tutorials/1020_registries/). When this is done, type enforcement can be done through `w`'s generic which will use that type's `properties` and `children` to enforce what is passed in those arguments.

```ts
w<ButtonProperties, ButtonChildren>('CustomButton', {
  disabled: true
}, [ 'Click me!' ]);
```

Like `v`, children passed to this function may be the results of `v` or `w` calls, as well as strings, `null`, or `undefined`. But these children will be added to the resulting virtual DOM tree at the point that the widget decides, including placing them at different points in its hierarchy or omitting them altogether. Documentation for each widget should be consulted to see how these children are used.
