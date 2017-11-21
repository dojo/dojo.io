---
layout: docs
category: widgets
title: Get the dynamic components of a URL from within a widget
overview: Access URL parameters from within a widget
---

## Objective

This recipe demonstrates how you can inspect dynamic URL parameters through the routing ecosystem in Dojo 2. This recipe also shows how to provide these dynamic URL parameters to a widget.

## Procedure

1. Include a dynamic path in your routing configuration:

```js
const routingConfig = [{
    path: 'contact/{id}',
    outlet: 'contact page'
}];
```

2. Define an outlet and provide a callback function which returns the properties the wrapped widget expects:

```js
const ContactWidgetOutlet = Outlet(ContactWidget, 'contact page', ({params}) => {
    return {
        id: params.id
    };
});
```

3. Your `ContactWidget` receives the object which the outlet returns:

```js
class ContactWidget extends WidgetBase {
    protected render() {
        console.log(this.properties.id); // 'person-1'
        return v('div', []);
    }
}
```

3. Visit the URL: `http://localhost:9999/#contact/person-1`

4. Observe the callback passed to the `Outlet()` function is invoked with an object argument containing a `params` property.

## Further reading

- The [Dojo 2 Routing](https://dojo.io/tutorials/1030_routing/) tutorial covers routing in more depth
- The [Render a widget against a URL](https://github.com/dojo/dojo.io/tree/master/site/source/cookbook/widgets/render-built-in-dojo-widget.md) recipe includes minimal code to handle widget based routing
