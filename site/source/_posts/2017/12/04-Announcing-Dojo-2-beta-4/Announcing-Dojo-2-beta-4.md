---
title: Announcing Dojo 2 beta 4!
date: 2017-12-04 18:00:00
authorId: kitsonk
featured_image: featured.png
---

Dojo is a modern, reactive framework authored with ES2017 and TypeScript, and optimized with the needs of enterprise application development in mind.

With a focus on leveraging cutting edge standards such as web components and intersection observers, as well as emerging patterns like CSS modules, progressive web apps, and the virtual DOM, Dojo  provides an excellent experience for engineers and end users.

Dojo’s out-of-the-box experience takes under a minute to get started  and provides a variety of features including user interface widgets backed by powerful and flexible internationalization and accessibility options.  Intent on avoiding framework lock-in, its robust architectural flexibility and its support for modern standards makes Dojo a strong contender for enterprise development teams.

The latest beta 4 release has several significant changes and updates from earlier versions. Here we highlight the current state of Dojo 2, as well as emphasize the recent changes and additions in beta 4.

{% asset_img featured.png feature-full %}

<!-- more -->

## Getting Beta 4

Beta 4 is currently tagged as `latest` in npm, so simply updating to the latest version will provide you with the Beta 4 release.  We also have a release tag of `beta4` in npm if you want to focus just on using Beta 4.

With Beta 3, we revised our package versions to make it easier to keep a compatible set of packages.  We are releasing all pre-release versions of Dojo 2 packages under major version `0`, but are introducing breaking changes in the minor release (e.g. `0.2.0` has breaking changes from `0.1.0`).  The versions we publish to npm rely upon a minor range.  You will see that some packages for Beta 4 are `0.3.#` and some are `0.2.#`, but all packages depend on a range where compatibility has been verified by the Dojo team.  This means you do not need to reply upon a specific release tag.  If you are managing your dependencies directly, you should ideally depend upon a minor release for packages (e.g. `~0.2.0`).

As we make releases of packages in anticipation of Beta 5, we will not publish those packages to `latest` until we release Beta 5.

## Just getting started

If you want to get started with Dojo 2, the best way is to take a look at our [tutorials](/tutorials/) or even take a look at Dojo 2 in action with our [example applications](https://dojo.github.io/examples/) (source on [GitHub](https://github.com/dojo/examples)).  Good starting tutorials are:

* [Dojo 2 local installation](/tutorials/000_local_installation/)
* [Your first Dojo 2 application](/tutorials/001_static_content/)
* [Creating widgets](/tutorials/003_creating_widgets/)

## Integrated virtual DOM

Directly integrating the virtual DOM is the biggest change for the beta 4 release.  Instead of depending on the [Maquette](https://maquettejs.org/) virtual DOM library, we realized that our specialized requirements and needs are better solved by direct integration.  So in Beta 4 we have replaced Maquette with `@dojo/widget-core/vdom`.

This change allows us to directly merge our abstraction of widgets and virtual DOM nodes that get rendered to the DOM.  This increases the performance of the widgeting system, and also led to other performance and memory improvements to the widgeting system.

This alone would not affect users of Dojo 2, but it allows us to address many features and refactor code that introduces some significant **breaking changes** in the beta 4 release.

Explore the widgeting system via the [Creating widgets](/tutorials/003_creating_widgets/) tutorial.

## Virtual DOM classes

One of the biggest usability issues with earlier Dojo 2 beta releases was managing CSS classes.  In Beta 4, we have changed this significantly, and while it is a **breaking change** we think the end result is _a lot_ more usable.

Previously, `classes` were actually an object map of keys with a boolean value.  If you were using the Dojo 2 theming system, you would use a function to specify your classes in a more functional way, which would automatically generate a memoized map.  If you were not using the theming system, you would need to memoize classes directly. While this approach might be ok to author, it was really challenging to test. It would look something like this:

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

The `classes` property is now just an array of strings.  Also the mixed in `.theme()` method more clearly express intent over the former `.classes()` name.  _Fixed_ classes are simply added to the array, instead of being supplied to a chained function.

The testing tooling (`@dojo/test-extras/harness`) has been updated to reflect these changes, making it easier to test widgets.  `Themeable` was renamed to `Themed` for improved mixin semantics.

## Widget lifecycle changes

We have a goal with Dojo 2 to provide straightforward and efficient APIs. One of the biggest lessons we learned with Dojo 2 was that the widget lifecycle was far too complex. The Dojo 2 widget system handles the vast majority of lifecycle changes and updates automatically. There are some scenarios where you many need to know when an item is added or removed from the DOM by the virtual DOM system.

In Beta 4, we have introduced the `onAttach` and `onDetach` lifecycle methods to WidgetBase.  They are designed to allow a widget developer to _hook_ when a widget instance is attached to the DOM or detached from the DOM.

To use the lifecycle methods, simply override `onAttach` or `onDetach`:

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

Earlier, less effective efforts to provide lifecycle methods are deprecated and will be removed in the future.

## Deferred properties

A virtual DOM node may have its property resolution deferred. Instead of providing an object of `VirtualDomProperties`, you may provide a function which accepts a boolean flag representing whether the virtual DOM node has been inserted into the DOM. This function returns an object of `VirtualDomProperties`.

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

The Dojo 2 widgeting system strives to provide sufficient tools and abstractions to avoid needing to directly manipulate the DOM.  Meta providers offer reactive ways to interact with features that would otherwise require direct DOM interaction.  Dojo 2 includes meta providers for Intersection Observers, dragging on an element, node dimensions, and the matching of a virtual DOM node.

In this vein, we have added a web animations meta provider in Beta 4.  It provides a way to easily animate DOM nodes in a reactive way, as just part of your widget's `.render()` function.  For example:

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

A primary objective for Dojo 2 is to embrace and leverage standards wherever possible to encourage interoperability. One such area is Web Components, where it is possible to both use Web Components within Dojo 2 applications, and also use Dojo 2 widgets as Custom Elements outside the context of a Dojo 2 application.  Beta 4 introduces several changes to the widgeting system to better support Dojo 2 widgets used as Custom Elements.  Earlier, it was challenging to have a Dojo 2 Custom Element efficiently use other Dojo 2 Custom Elements as children.  With Beta 4, this is no longer a problem.

If you write the following in TypeScript:

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

You could express the same using Custom Elements, independent of a Dojo 2 application:

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

We have a [live custom elements example](https://dojo.github.io/examples/custom-element-menu/), along with the example's [source code](https://github.com/dojo/examples/tree/master/custom-element-menu).

## Other widget system improvements

Additional widget system changes enable features and capabilities to make widgets more robust:

* Event listeners on virtual DOM nodes now allow the listeners to change between renders.
* Options for the _root_ of a `Projector` are more flexible, including being able to return a widget node, or an array of nodes. Changing the root of the projector after the first render is now supported.
* Several internal performance and memory improvements to the virtual DOM and widgeting system.

## New widgets

We have introduced two new widgets in Beta 4 and are considering more before the release of Dojo 2.  While our focus is providing solid patterns and examples for building widgets, it is very helpful to have _out-of-the-box_ widgets, especially for rapid prototyping.

We have introduced a new accordion pane widget (`@dojo/widgets/accordionpane/AccordionPane`):

<img src="./accordion.png" alt="The accordion pane widget" height="465" width="351" />

And we have introduced a tooltip widget (`@dojo/widgets/tooltip/Tooltip`):

<img src="./tooltip.png" alt="The tooltip widget" height="104" width="415" />

## Other widget improvements

We are working to standardize conventions in widgets. Some changes have landed for Beta 4, with additional refinements planned for Beta 5. In particular we have been rationalizing our styles, clearly delineating between themeable and structural styles, making it easier to theme existing widgets. We are also investigating approaches to better customize and extend the out of the box widgets.

## Stores re-architecture

The current API in Dojo 1 for managing state focused on a CRUD type API.  Originally in Dojo 2 we directly adapted that API as part of _stores_.  The concept of state containers has become a primary focus, so we created a solution that aligns to that architecture.

Instead of a CRUD type API, `@dojo/stores` focuses on three main concepts:

* _Operation_ which is a granular state mutation based on the JSON Patch API
* _Command_ a semantically aligned function which returns a set of operations to apply
* _Process_ a function that groups commands into a _process flow_ to represent a complete behavior

You can read more about the new API at [`dojo/stores`](https://github.com/dojo/stores).

## A new approach to shims and polyfills

We have rationalized the way we introduce environment compatibility, and improved the build system to further optimize this approach when building an application. We realize that some packages depend upon third-party polyfills, but we did not have a consistent way to introduce them and elide them if not needed.

Now `@dojo/shim/main` loads all polyfills needed for the expected base functionality and `@dojo/shim/browser` will load polyfills for a browser environment.  Most end developers will not need to worry about this as the other Dojo 2 packages will ensure that these modules get loaded.


If you are building an application targeting only certain platforms, any unneeded polyfills will simply result in a non-operation, but will still be included in the bundle. Beta 4 adds an additional static build optimization feature, where a specially formed pragma will denote the feature that the next import will be polyfilling. If that feature is not required based on the build targets, it will be removed from the build. More information can be found in the [elided imports documentation](https://github.com/dojo/webpack-contrib#elided-imports).

## Iterators

Previously we provided a functional replacement for `for...of` constructs, allowing developers to author code that worked in older environments. We also provided shims for `Symbol` and the built in ES6 iterators. TypeScript 2.3 added a down level emit for iterators. We have restructured our packages to use `for...of` instead of the `@dojo/shim/iterator.forOf()` function and will likely remove `forOf()` in the future. We recommend users of Dojo 2 also migrate to this syntax.

## TypeScript helpers

When emitting to JavaScript from TypeScript, each run-time module included all TypeScript helpers needed by that module. This increases the bundle size because these helpers would be duplicated many times. In Beta 4, we import helpers from `tslib` and automatically include these helpers once as part of the CLI build tool, eliminating any duplication of TS helper code.

## What's next?

We are planning many things for Beta 5, which will always chop and change a bit. You may look forward to:

* A re-architected build tool, which will include build time rendering to automatically identify critical path resources in the build, providing automatic code splitting and build optimization.
* More performance improvements for the widgeting system.
* More examples and applications of `@dojo/stores` based on the new architecture.
* Improvements to the tooling around widget themes

At the moment, we are planning for Beta 5 in December and a release candidate for Dojo 2 in January.

## Getting involved

If you want to get involved, you can see an overview of the parts of Dojo 2 at [dojo/meta](https://github.com/dojo/meta).  In all of our repositories we use the labels [`good first issue`](https://github.com/dojo/meta/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) and [`help wanted`](https://github.com/dojo/meta/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) to help guide you on a good place to get started.
