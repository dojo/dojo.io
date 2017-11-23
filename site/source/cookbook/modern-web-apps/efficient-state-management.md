---
layout: docs
category: modern-web-apps
title: Manage state in your application
overview: Manage state to decrease complexity in your application
---

## Objective

This recipe demonstrates one technique for managing state in your Dojo 2 application which covers state injection into widgets.

## Procedure

1. Create a widget which uses a property from `this.properties`:

```ts
render() {
    return v('div', [ this.properties.message ]);
}
```

2. Wrap the widget created in step one with a `Container` by creating the file `src/containers/YourWidgetContainer.ts` and adding the following code:

```ts
import { Container } from '@dojo/widget-core/Container';
import YourWidget from './../widgets/YourWidget';

function getProperties(inject, properties) {
    return {
        message: inject.message
    };
}

const YourWidgetContainer = Container(YourWidget, 'app-state', {
    getProperties
});

export default YourWidgetContainer;
```

Here are two notes on step 2:

- `'app-state'` is a string based identifier which must match the identifier you pass to `registry.defineInjector` as shown in step 3
- The return value of the `getProperties` is passed onto the wrapped widget as `this.properties`.

3. In your `main` file, include the following code:

```ts
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { Registry } from '@dojo/widget-core/Registry';
import { Injector } from '@dojo/widget-core/Injector';
import YourWidgetContainer from './containers/YourWidgetContainer';

const registry = new Registry();
const myInjector = new Injector({
    message: 'This message is injected into the child widget'
});

registry.defineInjector('app-state', myInjector);

const Projector = ProjectorMixin(YourWidgetContainer);
const projector = new Projector();
projector.setProperties({ registry });

projector.append();
```

## Further reading

The [Dojo 2 State management tutorial](https://dojo.io/tutorials/1010_containers_and_injecting_state/) covers state management in more detail.