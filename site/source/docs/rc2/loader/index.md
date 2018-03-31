---
layout: docs
---

# @dojo/loader

[![Build Status](https://travis-ci.org/dojo/loader.svg?branch=master)](https://travis-ci.org/dojo/loader)
[![codecov.io](http://codecov.io/github/dojo/loader/coverage.svg?branch=master)](http://codecov.io/github/dojo/loader?branch=master)
[![npm version](https://badge.fury.io/js/%40dojo%2Floader.svg)](https://badge.fury.io/js/%40dojo%2Floader)

This package provides a JavaScript AMD loader useful in applications running in either a web browser, node.js or nashorn.

`@dojo/loader` does not have any dependencies on a JavaScript framework.

- [Usage](#usage)
- [Support](#support)
- [Features](#features)
- [How do I contribute?](#how-do-i-contribute)
  - [Code Style](#code-style)
  - [Installation](#installation)
  - [Testing](#testing)
- [Licensing information](#licensing-information)

## Note

We strongly recommend using the `@dojo/cli` build tools for a Dojo 2 application over a runtime loader such as `@dojo/loader`. 

## Usage

To use `@dojo/loader`, install the package:

```bash
npm install @dojo/loader
```

## Support

| Environment	| Version	|
|---------------|----------:|
| IE			| 10+		|
| Firefox		| 30+		|
| Chrome		| 30+		|
| Opera			| 15+		|
| Safari		| 8, 9		|
| Android		| 4.4+		|
| iOS			| 7+		|
| Node			| 0.12+		|
| Nashorn		| 1.8+		|

## Features

- AMD loading
- CJS loading (in a node environment)
- Plugins:
	- [text](https://github.com/dojo/core/blob/master/src/text.ts)
	- [has](https://github.com/dojo/core/blob/master/src/has.ts)
- Loading in a Nashorn environment

Use a script tag to import the loader. This will make `require` and `define` available in the global namespace.

``` html
<script src='node_modules/@dojo/loader/loader.min.js'></script>
```

The loader can load both AMD and CJS formatted modules.

There is no need to use the Dojo 1.x method of requiring node modules via `dojo/node!` plugin anymore.

## How do I contribute?

We appreciate your interest!  Please see the [Guidelines Repository](https://github.com/dojo/guidelines#readme) for the
Contributing Guidelines.

### Code Style

This repository uses [`prettier`](https://prettier.io/) for code styling rules and formatting. A pre-commit hook is installed automatically and configured to run `prettier` against all staged files as per the configuration in the project's `package.json`.

An additional npm script to run `prettier` (with write set to `true`) against all `src` and `test` project files is available by running:

```bash
npm run prettier
```

### Installation

To start working with this package, clone the repository and run `npm install`.

In order to build the project run `grunt dev` or `grunt dist`.

### Testing

Test cases MUST be written using Intern using the Object test interface and Assert assertion interface.

90% branch coverage MUST be provided for all code submitted to this repository, as reported by istanbul’s combined coverage results for all supported platforms.

## Licensing information

© 2004–2018 [JS Foundation](https://js.foundation/) & contributors. [New BSD](http://opensource.org/licenses/BSD-3-Clause) license.
