---
layout: docs
---

# @dojo/streams

[![Build Status](https://travis-ci.org/dojo/streams.svg?branch=master)](https://travis-ci.org/dojo/streams)
[![codecov](https://codecov.io/gh/dojo/streams/branch/master/graph/badge.svg)](https://codecov.io/gh/dojo/streams)
[![npm version](https://badge.fury.io/js/%40dojo%2Fstreams.svg)](https://badge.fury.io/js/%40dojo%2Fstreams)

An implementation of the [WHATWG Streams Spec](https://streams.spec.whatwg.org/).

## Usage

To use `@dojo/streams`, install the package along with its required peer dependencies:

```bash
npm install @dojo/streams

# peer dependencies
npm install @dojo/core
npm install @dojo/has
npm install @dojo/shim
```

## Features

- [ReadableStream](#readablestream)
- [WritableStream](#writablestream)

Two main objects in this module are `ReadableStream` and `WritableStream`.

### ReadableStream

A [readable stream](https://streams.spec.whatwg.org/#rs-model) represents a source of data, from which you can read.

```typescript
const reader = readableStream.getReader();

reader.read().then(
  ({ value, done }) => {
    if (done) {
      console.log("The stream was already closed!");
    } else {
      console.log(value);
    }
  },
  e => console.error("The stream became errored and cannot be read from!", e)
);
```

### WritableStream

A [writable stream](https://streams.spec.whatwg.org/#ws-model) represents a destination for data, into which you can write.

```typescript
const writer = writableStream.getWriter();
writer.write('data');
writer.close();
```

## How do I contribute?

We appreciate your interest!  Please see the [Dojo 2 Meta Repository](https://github.com/dojo/meta#readme) for the
Contributing Guidelines and Style Guide.

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `grunt dev` or `grunt dist`.

### Testing

Test cases MUST be written using [Intern](https://theintern.github.io) using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

To test locally in node run:

`grunt test`

To test against browsers with a local selenium server run:

`grunt test:local`

To test against BrowserStack or Sauce Labs run:

`grunt test:browserstack`

or

`grunt test:saucelabs`

## Licensing information

© 2004–2018 [JS Foundation](https://js.foundation/) & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
