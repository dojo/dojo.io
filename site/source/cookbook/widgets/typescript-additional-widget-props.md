---
layout: docs
category: widgets
title: Allow a widget to receive additional properties in TypeScript
overview: Provide an interface for a widget in TypeScript so it can receive additional properties
---

## Objective

When you create a custom widget in TypeScript, you may only pass down known properties to it. This recipe demonstrates how to extend a custom widget to accept additional properties.

This code errors in TypeScript:

```ts
w(Header, {
    property: 'value'
});
```

> Object literal may only specify known properties, and 'property' does not exist in type 'Readonly<WidgetProperties>'

This code also errors:

```ts
class Header extends WidgetBase {
    protected render() {
        const {property} = this.properties;
        return v('div', [ `Header Property: ${property}` ])
    }
}
```

> Type 'Readonly<WidgetProperties>' has no property 'property' and no string index signature.

## Code solution

1. To fix the issue mentioned above, first create a TypeScript interface:

```ts
interface HeaderProperties {
    property: string
};
```

2. Then apply your interface to your widget definition via TypeScript generics:

```ts
class Header extends WidgetBase<HeaderProperties> {
    protected render() {
        const {property} = this.properties;
        return v('div', [ `Header Property: ${property}` ])
    }
}
```

The TypeScript errors are resolved, and you now get autocomplete after typing in `this.properties` as TypeScript is able to infer what properties are available in the widget.

## Additional resources

* [TypeScript generics documentation](https://www.google.co.uk/url?sa=t&rct=j&q=&esrc=s&source=web&cd=1&ved=0ahUKEwi13sWUx9fXAhWK16QKHZ1-AosQFggoMAA&url=https%3A%2F%2Fwww.typescriptlang.org%2Fdocs%2Fhandbook%2Fgenerics.html&usg=AOvVaw1LHVA8NPdl-r11gwf7mxGg)