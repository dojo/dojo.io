---
layout: cookbook
category: routing
title: Generate dynamic hyperlinks
overview: Generate dynamic hyperlinks with the built-in Link component
---

## Objective

This recipe demonstrates how to generate hyperlinks based on your routing configuration.

## Code example

1. Assuming a routing configuration like this:

```ts
[{
    path: 'products',
    outlet: 'products',
    children: [{
        path: '{product}',
        outlet: 'product'
    }]
}];
```

Note: You can learn how to apply the above routing configuration within a Dojo 2 app in the ['Render URL aware widgets' recipe](https://dojo.io/cookbook/routing/render-widget-url).

2. You can generate a hyperlink using the built-in `Link` component.

```ts
import { w } from '@dojo/widget-core/d';
import { Link } from '@dojo/routing/Link';

render() {
    return w(Link, {
        to: 'product',
        params: {
            product: 'laptop-55'
        }
    }, [ 'View Laptop #55 ']);
}
```

The above `Link` component renders an anchor tag element like this:

```html
<a href="#products/laptop-55">View Laptop #55</a>
```

## Further reading

[Dojo 2 Application Routing](https://dojo.io/tutorials/1030_routing) covers routing in more detail.
