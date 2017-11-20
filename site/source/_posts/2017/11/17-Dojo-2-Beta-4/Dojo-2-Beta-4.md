---
title: Dojo 2 Beta 4
date: 2017-11-17 18:00:00
authorId: kitsonk
featured_image: featured.png
---

The Beta 4 Release of Dojo 2 puts us on a clear path to releasing Dojo 2.  It has several significant changes and updates.

{% asset_img featured.png feature-full %}

<!-- more -->

## Getting Beta 4

Beta 4 is currently tagged as `latest` in npm, so all just updating to the latest version will provide you with Beta 4.  We also have a release tag of `beta4` in npm if you want to focus just on using Beta 4.

With Beta 3, we revised our package versions to make it easier to keep a compatible set of packes.  We are releasing all the pre-release versions of Dojo 2 packages under major version `0`, but are introducing breaking changes in the minor release (e.g. `0.2.0` has breaking changes from `0.1.0`).  The versions we publish to npm rely upon a minor range.  You will see that some packages for Beta 4 are `0.3.#` and some are `0.2.#`, but they all depend on a range of version they know they are compatible with.  This means you don't have to rely upon a release tag.  So ideally you would want to ensure if you are managing your dependencies directly, you depend upon a minor release (e.g. `~0.2.0`) for packages.

As we make releases of packages in anticipation of Beta 5, we will not publish those packages to `latest` until we release Beta 5.

## Integrated virtual DOM

This was the biggest fundamental change for the Beta 4 release.  Instead of depending on the [Maquette](https://maquettejs.org/) virtual DOM library, we realised that our specialised requirements and needs were better solved in the medium and long term by integrating it directly.  So in Beta 4 we have replaced Maquette with `@dojo/widget-core/vdom`.

This has allowed us to directly merge our abstraction of widgets and virtual DOM nodes with the virtual DOM nodes that get rendered to the DOM.  This increases the performance of the widgeting system, but also allowed us to make other performance and memory improvements to the widgeting system.

This alone would not have had an effect on users of Dojo 2, but it allowed us to address a whole list of features we desired and refactoring of code that introduced some significant **breaking changes** in Beta 4.

## Virtual DOM classes

We felt that one of the biggest usability issues we had with Dojo 2 had to do with dealing with classes.  In Beta 4, we have changed this significantly, and while it is a **breaking change** we think the end result is _a lot_ more usable.

Previously, `classes` were actually an object map of keys with a boolean value.  If you were using the theming system, you would use a function to specify your classes in a more functional way, which would generate a memoised map for you.  If you weren't you would have to do this yourself.  While it might be ok to author, it was really difficult to test.  It would look something like this:

```typescript
import { v } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import ThemeableMixin, { theme } from '@dojo/widget-core/mixins/Themeable';
import * as css from './styles/mywidget.m.css';

const ThemeableBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class MyWidget extends ThemeableBase {
    protected render() {
        return v('div', {
            classes: this.classes(css.root).fixed(css.rootFixed)
        }, [ 'Hello world!' ])
    }
}
```

With the changes in Beta 4, this gets written as:

```typescript
import { v } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import ThemedMixin, { theme } from '@dojo/widget-core/mixins/Themed';
import * as css from './styles/mywidget.m.css';

const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class MyWidget extends ThemedBase {
    protected render() {
        return v('div', {
            classes: [ this.theme(css.root), css.rootFixed ]
        }, [ 'Hello world!' ])
    }
}
```

The `classes` property is now just an array of strings.  Also we think that the mixed in method `theme()` is a lot more clear on what you are doing instead of `classes()`.  _Fixed_ classes are just simply added to the array, instead of being supplied to a chained function.

This also means that the `@dojo/test-extras/harness` has been updated to remove the memoised class functionality, making tests far easier to author, not having to worry about replicating the order of adding classes to an expected widget render.  Also, we renamed `Themeable` to `Themed` as we felt it was better semantics for our mixins.

## Widget lifecycle changes

We were never completely happy with the APIs we provided for end users to interact with the widget lifecycle.  We have long felt that one of the biggest challenges with Dojo 1 Dijits was a complicated lifecycle.  In general the Dojo 2 widgeting system takes care of everything and developers really shouldn't need to worry about the lifecycle and instead just worry about rendering when requested.  There are still use cases where a developer does need to know when the virtual DOM they render is added to or removed from the DOM.

In Beta 4 we have introduced two lifecycle methods to `WidgetBase`.  They are called `onAttach` and `onDetach`.  They are designed to allow a widget developer to _hook_ when a widget instance is attached to the DOM or detached from the DOM.

To use them, it simply requires overriding the `onAttach` or `onDetach` methods.  For example:

```typescript
import { v } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';

export default class MyWidget extends WidgetBase {
    protected onAttach() {
        // perform actions when attached
    }

    protected onDetach() {
        // perform actions when detached
    }

    protected render() {
        return v('div', { }, [ 'Hello world!' ])
    }
}
```

Previously, we had other capabilities which provided functionality in this area, but we have deprecated those and will remove them in the future.

## Deferred properties

A virtual DOM node can now provide its properties in a way that are resolved in a deferred fashion, where instead of providing an object of `VirtualDomProperties`, you can provide a function which takes a boolean flag of if the virtual DOM node has been inserted into the DOM and returns an object of `VirtualDomProperties`.

Because these functions will be called during the next `requestAnimationFrame` (when the projector is running in its default asynchronous mode), this feature can be used to better handle CSS transition states.  For example, you can now do something like this:

```typescript
import { v } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';

render() {
    return v('div', (inserted) => {
        return {
            classes: 'fadeInTransition',
            styles: {
                opacity: inserted ? '1' : '0'
            }
        };
    }, [ 'Hello World!' ]);
}
```

## Web animations meta provider

One of the goals of the Dojo 2 widgeting system is to provide sufficient tools and abstractions so that widget authors don't have to deal directly with the DOM.  Meta providers provide ways to interact with the DOM, sometimes in complex ways, without having to sweat the details.

In this vein, we have added a web animations meta provider in Beta 4.  It provides a way to easily animate DOM nodes in a reactive way, as just part of your render.  For example:

```typescript
import { v } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import WebAnimation from '@dojo/widget-core/meta/WebAnimation';

export default class AnimatedWidget extends WidgetBase {
    protected render() {
        const animate = {
            id: 'rootAnimation',
            effects: [
                { height: '10px' },
                { height: '100px' }
            ],
            controls: {
                play: true
            }
        };

        this.meta(WebAnimation).animate('root', animate);

        return v('div', {
            key: 'root'
        });
    }
}
```

## Custom Elements/Web Components

One of the main objectives for Dojo 2 was that there was a high level of interoperability with Web Components, both using Web Components in Dojo 2 applications but also being able to use Dojo 2 widgets easily as Custom Elements.  We made several changes to the widgeting system to better support Dojo 2 widgets used as Custom Elements, specifically making it efficient to use children Custom Elements of a Dojo 2 widget Custom Element.

So what you would write in TypeScript:

```typescript
class Example extends WidgetBase {

  private _onSelected(data: any) {
    console.log(data);
  }

  protected render() {
    return w(Menu, { onSelected: this._onSelected }, [
      w(MenuItem, { key: 'a', title: 'Menu Item A' }),
      w(MenuItem, { key: 'b', title: 'Menu Item B', selected: true }),
      w(MenuItem, { key: 'c', title: 'Menu Item C' })
    ]);
  }
}
```

Can be written as this using when using Custom Elements:

```html
<demo-menu id="menu">
  <demo-menu-item id="a" title="Menu Item A"></demo-menu-item>
  <demo-menu-item id="b" title="Menu Item B"></demo-menu-item>
  <demo-menu-item id="c" title="Menu Item C" selected></demo-menu-item>
</demo-menu>
<script>
  a.data = { foo: 'bar' };
  menu.addEventListener('selected', function(event) {
    const detail = event.detail;
    console.log(detail);
  });
</script>
```

We have an [live example](https://dojo.github.io/examples/custom-element-menu/) of this, along with the [source code on GitHub](https://github.com/dojo/examples/tree/master/custom-element-menu).

## Other widget system improvements

There were other changes to the widgeting system which enable some features and capabilities we think can make widgets more robust:

* The way event listeners behave on virtual DOM nodes has changed, and we now allow the listeners to change between renders.  Previously this would have errored.
* There is a lot more flexibility about what the _root_ of a `Projector` can be, which includes being able to return a widget node, or an array of nodes.  Also, previously there were challenges with changing the root of the projector after the first render, which is now allowed.
* Several internal performance and memory improvements to the virtual DOM and widgeting system.

## New widgets

We have introduced two new widgets in Beta 4 and are considering more before the release of Dojo 2.  Really we want to focus on trying to hone our patterns for widgets to provide examples for others to build widgets, but do know that especially for rapid prototyping it is helpful to have _out-of-the-box_ widgets.

We have introduced a new accordion pane widget (`@dojo/widgets/accordionpane/AccordionPane`):

<img src="./accordion.png" alt="The accordion pane widget" height="465" width="351" />

As well as we have introduced a tooltip widget (`@dojo/widgets/tooltip/Tooltip`):

<img src="./tooltip.png" alt="The tooltip widget" height="104" width="415" />

## Other widget improvements

We have also been trying to standardise our conventions in widgets in Beta 4, though we will likely have more changes for Beta 5.  In particular we have been rationalising our styles, making sure that themeable styles and the structural styles are clearly delineated, making it easier to theme existing widgets.  We have also been looking at the ways to better customise and extend the out of the box widgets.

## Stores re-architecture

The current API in Dojo 1 for managing state focused on a CRUD type API.  Originally in Dojo 2 we directly adapted that API as part of _stores_.  Recently though, the concept of state containers has taken front and centre and we knew we wanted to create a solution that aligned to that architecture.

Instead of CRUD type API, it focuses on three main concepts:

* _Operation_ which is a granular state mutation based on the JSON Patch API
* _Command_ a semantically aligned function which returns a set of operations to apply
* _Process_ a function that groups commands into a _process flow_ to represent a complete behaviour

You can read more about the new API at [`dojo/stores`](https://github.com/dojo/stores).

## A new approach to shims and polyfills

We have rationalised the way we introduce compatibility across environments as well as improvements to the build system to optimize these when building an application.  We realised that some packages were wanting to depend upon 3rd party polyfills but we did not have a consistent way to introduce them as well as elide them if not needed.

Now `@dojo/shim/main` loads all the polyfills needed to provide the expected base functionality and `@dojo/shim/browser` will load polyfills for a browser environment.  Most end developers will not need to worry about this as the other Dojo 2 packages will ensure that these modules get loaded.

Of course if you are building an application that is targetting only certain platforms, these polyfills will simply result in a non-operation, but will still be part of the bundle.  We have added an additional static build optimisation feature, where a specially formed pragma will denote the feature that the next import will be polyfilling, and if that feature is not required based on the build targets, it will be removed from the build.  More information can be found in the [documentation for the feature](https://github.com/dojo/webpack-contrib#elided-imports).

## Iterators

Previously we had provided a functional replacement for `for...of` constructs so that developers could author code that worked in older browsers as well as we provided shims for `Symbol` and the built in ES6 iterators.  In TypeScript 2.3 though, a down level emit for iterators was introduced.  We have restructured our packages to use `for...of` instead of the `@dojo/shim/iterator.forOf()` function and will likely remove `forOf()` in the future.  We recommend users of Dojo 2 also migrate to this syntax.

## TypeScript helpers

When emitting to JavaScript from TypeScript, all of our run-time modules included any of the TypeScript helpers.  This causes the bundle size to increase because these helpers would be written out multiple times.  In Beta 4, we have changed to import our helpers from `tslib` and automatically include these helpers once as part of the CLI build tool.

## What is next

We are planning quite a few things for Beta 5, which will always chop and change a little bit, but what to look forward to:

* A re-architected build tool, which will include build time rendering to automatically identify critical path resources in the build to provide automatic code splitting and build optimisation.
* More performance improvements for the widgeting system.
* More examples and applications of `@dojo/stores` based on the new architecture.
* Improvements to the tooling around widget themes
