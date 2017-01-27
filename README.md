# dojo.io

[![Build Status](https://travis-ci.com/SitePen/dojoio.svg?token=iyehyStnJABkD5DAaT6V&branch=master)](https://travis-ci.com/SitePen/dojoio)

Published to [GitHub Pages](https://sitepen.github.io/dojoio/)

## Quick Start

1. `npm install`
2. `npm run build`
3. `npm run serve`
4. open [http://localhost:8888](localhost:8888)

## Adding Content

### Writing a Blog

Blogs are built using hexo and are located in `site/source/_posts`

TODO add more information

### Adding a static page

Static pages are build from markdown located in `site/source`

TODO provide addition information

### Writing a Tutorial

TODO We need to answer were tutorials should be located and if they're more similar to blogs or static pages

## APIs

### Listing API Versions

TODO not yet implemented

Get a list of unbuilt versions with

```
npm run api list [package name]
```

### Building APIs

TODO not yet implemented

APIs are built using `typedoc`.

```
npm run api build [package name] 2.0.0
```

A shallow copy of the repo is cloned into a temp directory, is built using `typedoc` and output to `_dist`.

### Validating up-to-date API documentation

TODO not yet implemented

API builds generate metadata including the git hash which they wre built against. To determine if a build is current
or needs to be regenerated use

```
npm run api current [pacakge name] [version]
```

## Deployment

### Local Deployment

TODO not yet implemented

Deploy locally using `npm run package`

### Deploy to Production

TODO not yet implemented

Deploy to the `gh-pages` branch using `npm run publish`

## Travis Support

TODO not yet implemented

This site is built for continious deployment from TravisCI. This requires it to have write access to the `gh-pages`
 branch of this project to fulfill automatic deployment duties. Access tokens should be encrypted with TravisCI and
 supplied through an environment variable used in deployment.

