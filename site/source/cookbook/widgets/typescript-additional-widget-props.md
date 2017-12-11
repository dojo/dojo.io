---
layout: cookbook
category: widgets
title: Allow a widget to receive additional properties in TypeScript
overview: Provide an interface for a widget in TypeScript so it can receive additional properties
---

## Objective

When you create a custom widget in TypeScript, you may only pass down known properties to it. This recipe demonstrates how to extend a custom widget to accept additional properties.

This code to pass down properties to a widget results in a TypeScript error:

```ts
w(Header, {
    property: 'value'
});
```

Error:

> Object literal may only specify known properties, and 'property' does not exist in type 'Readonly<WidgetProperties>'

This code to access properties from a parent also errors:

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

The TypeScript errors are resolved, and you now get autocomplete after typing in `this.properties.` as TypeScript is able to infer which properties are available in the widget.

## Additional resources

* [TypeScript generics documentation](https://www.typescriptlang.org/docs/handbook/generics.html)