---
layout: cookbook
category: styling
title: Create a themeable widget
overview: Create a themeable widget which can be consumed and styled elsewhere
---

## Objective

This recipe demonstrates how to create a widget which a consumer can theme.

## Procedure

1. Add the necessary imports:

```ts
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import * as css from './styles/Header.m.css';
```

2. Define your new widget:

```ts
@theme(css)
class Header extends ThemedMixin(WidgetBase) {
    protected render() {
        return v('div', {
            classes: [ this.theme(css.root) ]
        }, [
            'The header'
        ]);
    }
}

export default Header;
```

Notes:

* This widget definition extends from the `ThemedMixin`
* The reference to `this.theme(css.root)` specifies the `root` class as a themeable class

3. When you render your Header widget defined above, you can override the `root` class by defining your own theme:

```ts
w(Header, {
    theme: CustomTheme
});
```

There is a dedicated recipe on how to [create the `CustomTheme`](https://github.com/dojo/dojo.io/tree/master/site/source/cookbook/styling/built-in-widget-theming.md) variable in the above code snippet.

## Additional resources

* The [Dojo Theming tutorial](https://dojo.io/tutorials/007_theming/) explains how to theme widgets in greater detail.
* The [simple styling](https://github.com/dojo/dojo.io/tree/master/site/source/cookbook/styling/simple-styling.md) recipe demonstrates a basic technique for styling widgets
