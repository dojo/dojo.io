# What Are Intersection Observers?

It turns out that your page load time is through the roof, and it's all because of the images on your homepage. Your page could really benefit from lazy image loading, but figuring out if an HTML element is visible in the browser's viewport has historically been a difficult problem to solve.  [Intersection Observer](https://www.w3.org/TR/intersection-observer/) to the rescue!

The [Intersection Observer](https://www.w3.org/TR/intersection-observer/) was designed to simplify the process of determining the visibility of DOM elements relative to other elements or the document viewport.

# Why Intersection Observers

A few years ago, we had to rely on scroll and resize events and manually checking if element positions where within the document's viewport based on the scrolling offset. With a few elements to check, this could result in poor scrolling / resize performance, which means a poor user experience.

```javascript
function checkElementVisibility(element) {
  const { offsetWidth, offsetHeight } = element;

  let node = element;
  let offsetTop = 0;
  let offsetLeft = 0;

  while (node) {
    offsetTop += node.offsetTop;
    offsetLeft += node.offsetLeft;
    node = node.offsetParent;
  }
  return (
    offsetTop < window.pageYOffset + window.innerHeight &&
    offsetLeft < window.pageXOffset + window.innerWidth &&
    offsetTop + offsetHeight > window.pageYOffset &&
    offsetLeft + offsetWidth > window.pageXOffset
  );
}

function calculateVisibility() {
  const lazyImages = Array.from(
    document.querySelectorAll("img[data-lazy-src]")
  );

  for (let i = 0; i < lazyImages.length; i++) {
    const image = lazyImages[i];
    if (checkElementVisibility(image)) {
      console.log("loading image", lazyImages);
      image.src = image.getAttribute("data-lazy-src");
      image.removeAttribute("data-lazy-src");
    }
  }
}

window.addEventListener("scroll", () => {
  calculateVisibility();
});

window.addEventListener("resize", () => {
  calculateVisibility();
});

calculateVisibility();
```

See on [codesandbox.io](https://codesandbox.io/s/n0j32xk34m)

Compare this with an Intersection Observer, which will *proactively* emit events when the visibility status changes.

```javascript
const observer = new IntersectionObserver(changes => {
  for (const change of changes) {
    if (change.intersectionRatio > 0) {
      change.target.src = change.target.getAttribute("data-lazy-src");
      observer.unobserve(change.target);
    }
  }
});

const images = document.querySelectorAll("img[data-lazy-src]");
for (let i = 0; i < images.length; i++) {
  observer.observe(images[i]);
}
```

See on [codesandbox.io](https://codesandbox.io/s/94393mw9ow)

# Intersection Observers in Dojo 2

You saw how easy Intersection Observers are to use than the traditional event listeners, but Dojo 2 makes using Intersection Observers *even easier*. In Dojo 2, the [Intersection meta](https://github.com/dojo/widget-core/#intersection) takes care of all the logic around the intersection observer and allows you to concentrate on your business logic.

```typescript
interface LazyImageProperties {
  src: string;
  width: number;
  height: number;
}

export class LazyImage extends WidgetBase<LazyImageProperties> {
  private _loaded = false;

  protected render() {
    const { src, width, height } = this.properties;
    const { isIntersecting } = this.meta(Intersection).get("root");

    if (isIntersecting) {
      this._loaded = true;
    }

    return v("img", {
      key: "root",
      width,
      height,
      src: this._loaded ? src : null
    });
  }
}
```

See on [codesandbox.io](https://codesandbox.io/s/6jnykn4jln)

# Where to go next

We've only covered one use case of the Intersection Observer, but you can use this to also determine how *much* of an element is in the viewport. Cool effects, like animated headlines that animate as they appear, are a cinch with the Intersection Observer and Dojo 2!

Note: Although Intersection Observer is not yet supported natively everywhere, you can use a polyfill to add support.