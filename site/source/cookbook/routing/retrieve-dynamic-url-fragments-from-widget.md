---
layout: cookbook
category: routing
title: Get the dynamic components of a URL from within a widget
overview: Access URL parameters from within a widget
---

## Objective

This recipe demonstrates how you can inspect dynamic URL parameters through the routing ecosystem in Dojo 2. This recipe also shows how to provide these dynamic URL parameters to a widget.

## Procedure

1. Include a dynamic path in your routing configuration:

```ts
const routingConfig = [{
    path: 'contact/{id}',
    outlet: 'contact page'
}];
```

Note: You can learn how to apply the above routing configuration within a Dojo 2 app in the ['Render URL aware widgets' recipe](https://dojo.io/cookbook/routing/render-widget-url).

2. Define an outlet and provide a callback function which returns the properties the wrapped widget expects:

```ts
const ContactWidgetOutlet = Outlet(ContactWidget, 'contact page', ({params}) => {
    return {
        id: params.id
    };
});
```

3. Visit the URL: `http://localhost:9999/#contact/person-1`

4. Your `ContactWidget` receives the object which the outlet returns:

```ts
class ContactWidget extends WidgetBase {
    render() {
        return v('div', [this.properties.id]); // 'person-1'
    }
}
```

5. Observe the callback passed to the `Outlet()` function is invoked with an object argument containing a `params` property.

## Further reading

- The [Dojo 2 Routing](https://dojo.io/tutorials/1030_routing/) tutorial covers routing in more depth
- The [Render a widget against a URL](https://dojo.io/cookbook/widgets/render-built-in-dojo-widget) recipe includes minimal code to handle widget based routing
