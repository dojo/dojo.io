---
layout: cookbook
category: styling
title: Style a virtual DOM node with simple CSS classes
overview: Apply a class to a node and style it
---

## Objective

This recipe demonstrates a simple technique for styling widgets.

## Procedure

1. Create a `styles/HelloWorld.m.css` CSS file and add a style rule:

```css
.root {
    color: blue;
}
```

2. Import your CSS:

```ts
import * as css from './styles/HelloWorld.m.css';
```

3. Use the `classes` property to apply a CSS class to a virtual DOM node:

```ts
return v('div', { classes: css.root }, [ 'Hello' ]);
```


## Additional resources

The [Dojo Theming tutorial](https://dojo.io/tutorials/007_theming/) covers more advanced techniques of styling widgets