# dojo.io

[![Build Status](https://travis-ci.org/dojo/dojo.io.svg?branch=master)](https://travis-ci.org/dojo/dojo.io)

This repository is the source of the [dojo.io](https://dojo.io/) website, including the documentation, tutorials, and the blog.

Published to GitHub Pages and [Dojo.io](http://dojo.io).

## Quick Start to run the Dojo.io website locally

1. `npm install`
1. `npm run build`
1. `npm run serve`
1. open [http://localhost:8888](localhost:8888)

## Development

To have hexo and the docviewer rebuild when files change:

1. `npm run watch`

## Adding Content

### Writing a Blog

Blogs are built using [hexo](https://hexo.io/) and are located in [`site/source/_posts`](https://github.com/dojo/dojo.io/tree/master/site/source/_posts)

### Adding a static page

Static pages are built from markdown located in [`site/source`](https://github.com/dojo/dojo.io/tree/master/site/source). Please see [`site/source/tutorials`](https://github.com/dojo/dojo.io/tree/master/site/source/tutorials) for examples of static
 content.

### Writing a Tutorial

Tutorials are located in [`site/source/tutorials`](https://github.com/dojo/dojo.io/tree/master/site/source/tutorials) and are similar to static pages. They use the tutorial layout 
 (`layout: tutorial`) and have code content provided in the `demo` subdirectory that is archived during the tutorials
 build process (`grunt tutorials`).

 If the `finished` directory of the tutorial should be built and tested as part of the CI build, it needs
 to be added to the list of `TUTORIAL` values in [.travis.yml](./.travis.yml)

## API Documentation

API documentation is generated in each package using the `intern-dev-api` from [@theintern/dev](https://github.com/theintern/dev). A viewer application in this site loads API information from the package repos and renders it live.

## Deployment

This site is built for continuous deployment via Travis-ci. This requires Travis to have write access to this
repository so it can automatically deploy to the `gh-pages` branch.

*On a Master Branch Commit*:

1. A change is checked in to the `master` branch
1. Travis decrypts the `deploy_key.enc` file to `deploy_key`
1. Travis begins a build by running `grunt`
1. The build syncs the origin's [`gh-pages`](https://github.com/dojo/dojo.io/tree/gh-pages) branch to a temporary directory
1. Hexo builds against the [`gh-pages`](https://github.com/dojo/dojo.io/tree/gh-pages) branch
1. Tutorial files are packaged and added
1. On master, travis runs [`grunt publish`](https://github.com/dojo/dojo.io/blob/3b971259134fb0292fd5521d2074c3895a6423a8/.travis.yml#L50) and pushes changes to [`gh-pages`](https://github.com/dojo/dojo.io/tree/gh-pages)

*On a Non-Master Branch Commit*:

The same steps as above are followed except Travis does not decrypt the `deploy_key` and does not attempt
 to publish any changes. Automated scripts should not take any action requiring authentication to git or GitHub
 because credentials will not exist.

### Automated Deploy to Production

Travis automatically builds and deploys the master branch to `gh-pages` on each push.

NOTE: pushing a commit with `[skip ci]` will disable the Travis build and prevent the site from updating. A
 maintainer can instruct Travis to manually build latest.

