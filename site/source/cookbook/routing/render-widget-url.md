---
layout: cookbook
category: routing
title: Render URL aware widgets
overview: Render a widget when it matches a particular URL
---

## Objective

This recipe demonstrates how to render one or many widgets based on a URL match.

## Procedure

1. Add the necessary imports in your `main` file:

```ts
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';
import { registerRouterInjector } from '@dojo/routing/RouterInjector';
import { Outlet } from '@dojo/routing/Outlet';
import { w } from '@dojo/widget-core/d';
```

2. Create a `ContactWidget` and wrap this widget with an `Outlet`:

```ts
const ContactWidgetOutlet = Outlet(ContactWidget, 'contact page');
```

3. Define and register your routing configuration in your main file:

```ts
const routingConfig = [{
    path: 'contact',
    outlet: 'contact page'
}];

const registry = new Registry();
const router = registerRouterInjector(routingConfig, registry);
const Projector = ProjectorMixin(HelloWorld);
const projector = new Projector();

projector.setProperties({ registry });
projector.append();
router.start();
```

4. Render the outlet, instead of your widget:

```ts
render() {
    return v('div', [
        w(ContactWidgetOutlet, {})
    ]);
}
```

5. Visit the URL: `http://localhost:9999/#contact` in a browser and observe your contact widget renders on the page

The widget `ContactWidgetOutlet` only renders if the `path` associated with the `'contact page'` outlet matches in the URL.

## Further reading

The [Dojo 2 Routing](https://dojo.io/tutorials/1030_routing/) tutorial covers routing in more depth.
