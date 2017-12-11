---
layout: cookbook
category: widgets
title: Lazy load a widget
overview: Lazy load a widget on demand and exclude it from the main JavaScript bundle
---

## Objective

This recipe demonstrates the following:

1. How to declare a lazily loaded widget - this is done within step 2 in the procedure section
2. How to exclude a widget from the main JavaScript bundle - this is handled automatically through the Dojo CLI build tool based on the registry definition
3. How to download a widget on demand, at the point at which it is needed in the application lifecycle

## Procedure

1. Render your widget using a string based identifier, instead of rendering the class directly:

```ts
render() {
    return v('div',[
        // w(MyLazyWidget, {}) // Don't do this
        w('my-lazy-widget', {}) // Do this
    ]);
}
```

2. In your `main` file, import and configure a registry:

```ts
import { Registry } from '@dojo/widget-core/Registry';

const registry = new Registry();

registry.define('my-lazy-widget', async () => {
    const response = await import('./widgets/MyLazyWidget');
    return response.default;
});
```

3. Finally, use the `setProperties` method of your existing `projector` to associate the projector with the registry:

```ts
projector.setProperties({ registry });
```

The widget definition of '`MyLazyWidget`' is excluded from the main output bundle. A separate network request is made to `MyLazyWidget.js` on-demand, at the point at which it is rendered in the application runtime.

# Further reading

The [Dojo 2 Registries tutorial](https://dojo.io/tutorials/1020_registries/#1) covers lazy loading of widgets in greater detail.
