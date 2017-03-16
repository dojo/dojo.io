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

To get a listing of all released versions for a project

```bash
	npm run api releases dojo <name>
```

To get a list of all versions of a project with unbuilt API documentation

```bash
	npm run api missing dojo <name>
```

### Building APIs

Building documentation for a project requires the project repository to be checked out to a temporary location and
	where its dependencies are added and `typedoc` is ran against the repository. It is a relatively resource intensive
	task.

```bash
	npm run api build dojo <name> <version>
```

This will build documentation to `_dist/api/<name>/<version>`

NOTE: It currently requires `typedoc` be installed globally on your system (`npm i typedoc -g`).

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

