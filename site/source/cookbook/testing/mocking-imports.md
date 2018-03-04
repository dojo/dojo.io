---
layout: false
category: testing
title: Test and mock the imports of a widget
overview: Learn one strategy of mocking imports in a widget
---

## Objective

This recipe demonstrates one technique of:

1. Testing functionality in your widgets
2. Mocking imports which your widget relies upon

Note: This recipe demonstrates a vanilla approach of testing. It does not leverage the built-in testing ecosystem offered by Dojo 2 out of the box.

## Procedure

1. Create your widget:

```js
const { w } = require('@dojo/widget-core/d');
const { WidgetBase } = require('@dojo/widget-core/WidgetBase');
const MyCustomWidget = require('./MyCustomWidget');

class HelloWorld extends WidgetBase {
    render() {
        return w(MyCustomWidget, {
            onclick: () => {
                this.invalidate();
            }
        });
    }
}

module.exports = HelloWorld;
```

2. Import the dependencies for your test. This is the start of a new test file which has only one external dependency: `proxyquire`. The `proxyquire` module intercepts all of your module imports in a file, `proxyquire` then offers an API to mock each of these imports for the purpose of test isolation.

```js
const assert = require('assert');
const proxyquire = require('proxyquire').noCallThru();
```

3. Provide the stubs:

```js
let invalidateCalled = false;

const stubs = {
    '@dojo/widget-core/d': {
        w(...args) {
            return args;
        }
    },
    '@dojo/widget-core/WidgetBase': {
        WidgetBase: class {
            invalidate() {
                invalidateCalled = true;
            }
        }
    },
    './MyCustomWidget'() {}
};

```

These stubs are used in place of the actual imports. The stubs are key/value pairs:

* `key`: A string which represents the string identifier used in the original import
* `value`: A data type which is returned in place of the original imported module

4. Within your test file, require your widget through the `proxyquire` API and pass in the necessary stubs as defined in step 3:

```js
const HelloWorld = proxyquire('./HelloWorld', stubs);
```

5. Invoke the necessary methods on your widget so you can make assertions:

```js
const widget = new HelloWorld();
const render = widget.render();

assert.equal(invalidateCalled, false);
render[1].onclick();
assert.equal(invalidateCalled, true);
```

## Additional resources

[Intern](https://theintern.io/) is a feature rich testing framework which is bundled with Dojo 2 apps by default.
