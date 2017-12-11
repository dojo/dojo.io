---
layout: cookbook
category: widgets
title: Render a built-in Dojo 2 widget
overview: Include a built-in Dojo 2 widget into your web application
---

## Objective

Render a built-in Dojo 2 Button widget.

## Procedure

1. Import the Button widget:

```ts
import Button from '@dojo/widgets/button/Button';
```

2. Import the widget render function:

```ts
import { w } from '@dojo/widget-core/d';
```

3. Render the widget within an existing user-defined widget:

```ts
render() {
    return w(Button, {
        type: 'submit'
    }, ['Submit this form'])
}
```

## Additional resources

* The [Working with forms](https://dojo.io/tutorials/005_form_widgets/) tutorial includes more examples of using built-in Dojo 2 widgets
* The [dojo/widgets](https://github.com/dojo/widgets/tree/master/src/button) repository has detailed documentation on the `button` widget
