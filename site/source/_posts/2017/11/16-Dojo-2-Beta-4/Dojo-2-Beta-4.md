---
title: Dojo 2 Beta 4
date: 2017-11-16 16:56:19
authorId: kitsonk
featured_image: featured.png
---

The Beta 4 Release of Dojo 2 puts us on a clear path to releasing Dojo 2.  It has several significant changes and updates.

{% asset_img featured.png feature-full %}

<!-- more -->

## Integrated virtual DOM

This was the biggest fundamental change for the Beta 4 release.  We were really impressed with [Maquette](https://maquettejs.org/).  It was a focused, minimalistic, virtual DOM library.  We learned a lot from Maquette.  As we saw the roadmap for Maquette 3 materialise, we needed to re-evaluate our roadmap.  During the development of the widgeting system for Dojo 2, we really started to realise that _description_ of the virtual DOM and the _application_ were really linked.  We had created abstract objects, similar to the HyperScript nodes that Maquette used, but were specialised to our widgets and _standard_ DOM nodes.  We made the hard decision that we would continue to want features from a virtual DOM system that only be needed by Dojo 2, and therefore would unlikely to benefit a generic virtual DOM library.  We therefore made the hard decision to integrate the virtual DOM directly into `@dojo/widget-core`, where previously we had Maquette as a dependency.

This alone was essentially transparent to end developers of Dojo 2, but it allowed us to address a whole list of features we desired and refactoring of code that introduced some significant **breaking changes** in Beta 4.

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

This also means that the `@dojo/test-extras/harness` has also been updated to remove the memoised class functionality, making tests far easier to author, not having to worry about replicating the order of adding classes to an expected widget render.  Also, we renamed `Themeable` to `Themed` as we felt it was better semantics for our mixins.

## Widget lifecycle changes

We were never completely happy with the way end users to interact with the lifecycle of widgets.  We have long felt that one of the biggest challenges with Dojo 1 Dijits was a complicated lifecycle.  In general the Dojo 2 widgeting system takes care of everything and developers really shouldn't need to worry about the lifecycle and instead just worry about rendering when requested.  There are still use cases where a developer does need to know when the virtual DOM they render is added or removed from the DOM.

In Beta 4 we have introduced two lifecycle methods to `WidgetBase` which can be overridden.  They are called `onAttach` and `onDetach`.  They are designed to allow a widget developer to

Previously, we had other capabilities which provided functionality in this area, but we have deprecated those and will remove them in the future.

## Deferred properties

A virtual DOM node can now provide its properties in a way that are resolved in a deferred fashion, where instead of providing an object of `VirtualDomProperties`, you can provide a function which takes a boolean flag of if the virtual DOM node has been insterted into the DOM and returns an object of `VirtualDomProperties`.  The widget rendering system will then only call the function when it needs to be provided with the properties, instead of the properties having to be fully calculated at render time.

For example, you can now do something like this:

```typescript
import { v } from '@dojo/widget-core/d';
import WidgetBase from '@dojo/widget-core/WidgetBase';

export default class MyWidget extends WidgetBase {
    protected render() {
        return v('div', (inserted) => {
            return {
                classes: [ this.theme(css.root), css.rootFixed ],
                inserted
            };
        },
        [ 'Hello world!' ])
    }
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

## Other widget system improvements

There were other changes to the widgeting system which enable some features and capabilities we think can make widgets more robust:

* The way event listeners on virtual DOM nodes has changed, and we now allow the listeners to change between renders.  Previously this would have errored.
* There is a lot more flexibility about what the _root_ of a `Projector` can be, which includes being able to return a widget node, or an array of nodes.  Also, previously there were challenges with changing the root of the projector after the first render, which is now allowed.
* Better support for custom elements in the widgeting system including emitting the connected event and better working with children of custom elements.
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

How to manage data and state has continually evolved in Dojo 1 where most recently it focused on a fairly focused CRUD type interface to data.  Recently though, the concept of state containers has taken front and centre and we knew we wanted to create a solution that aligned to that architecture.  While our earlier beta releases contained an API very similiar to Dojo 1 _stores_ interfaces, we have rewritten `@dojo/stores` to adopt the state container API.

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

Previously we had provided a functional replacement for `for...of` constructs so that developers could author code that worked in older browsers as well as we provided shims for `Symbol` and the built in ES6 iterators.  In TypeScript 2.3 though, a down level emit for iterators was introduced.  We have restructured our packages to use

## TypeScript helpers

When emitting to JavaScript from TypeScript, all of our run-time modules included any of the TypeScript helpers.  This causes the bundle size to increase because these helpers would be written out multiple times.  In Beta 4, we have changed to import our helpers from `tslib` and automatically include these helpers once as part of the CLI build tool.

## What is next

We are planning quite a few things for Beta 5, which will always chop and change a little bit, but what to look forward to:

* A re-architected build tool, which will include build time rendering to automatically identify critical path resources in the build to provide automatic code splitting and build optimisation.
* More performance improvements for the widgeting system.
* More examples and applications of `@dojo/stores` based on the new architecture.
* Improvements to the tooling around widget themes
