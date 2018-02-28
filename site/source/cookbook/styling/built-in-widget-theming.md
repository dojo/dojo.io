---
layout: cookbook
category: styling
title: Style a built-in widget using themes
overview: Style a built-in Dojo 2 widget using the built-in theming functionality
---

## Objective

The recipe explains how to style a built-in Dojo 2 widget using the theming functionality built into Dojo 2.

## Procedure

1. Create a stylesheet which will style the Dojo 2 widget, for example in: `styles/themes/dark/button.m.css`:

```css
.root {
    background-color: black;
    color: white;
}
```

The selector must match an existing themeable selector which the widget offers. In this case, the `root` selector provided by the [Dojo 2 button](https://github.com/dojo/widgets/tree/master/src/button#theming) widget is styled and overridden.

2. Create a `theme.ts` file, for example in `styles/themes/dark/theme.ts`:

```ts
import * as Button from './button.m.css';

export default {
    'dojo-button': Button
}
```

The theme file must export an object of key-value pairs. The key represents the name of the widget, and the value is the respective CSS module which styles the widget. Built-in Dojo 2 widgets must have their key prefixed with `'dojo-'`.

Note: see the [discover built-in Dojo 2 widgets](https://dojo.io/cookbook/widgets/discover-built-in-dojo-widgets) recipe to learn more about built-in widgets.

3. Import your theme and the button widget:

```ts
import Button from '@dojo/widgets/button/Button';
import Theme from '../styles/themes/dark/theme';
```

4. Render the `Button` widget, and pass a property of `theme` with a value of your imported theme file:

```ts
w(Button, {
    theme: Theme
}, ['A button'])
```

The built-in Dojo 2 button is styled with your custom CSS and the `root` selector is overridden with your definition.

## Additional resources

* The [Dojo Theming tutorial](https://dojo.io/tutorials/007_theming/) explains how to theme widgets in greater detail.
* The [simple styling](https://dojo.io/cookbook/styling/simple-styling) recipe demonstrates a basic technique for styling widgets
* The [create a themeable widget](https://dojo.io/cookbook/styling/create-a-themeable-widget) recipe covers how to create a widget which can be themed by an external consumer
