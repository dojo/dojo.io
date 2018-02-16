# dojo.io

[![Build Status](https://travis-ci.org/dojo/dojo.io.svg?branch=master)](https://travis-ci.org/dojo/dojo.io)

This repository is the source of the [dojo.io](https://dojo.io/) website, including the documentation, tutorials, cookbook and the blog.

Published to GitHub Pages and [Dojo.io](http://dojo.io).

## Quick Start to run the Dojo.io website locally

1. `npm install grunt-cli -g`
1. `npm install`
1. `grunt`
1. `grunt webserv`
1. open [http://localhost:8888](localhost:8888)

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

API documentation is generated using the `grunt api` command to the `_dist/api/<project name>/<version>` directory. We currently use
[TypeDoc](https://github.com/TypeStrong/typedoc) to build projects released via GitHub to this location.

### Building APIs

Building documentation for a project requires the project repository to be checked out to a temporary location where its dependencies are added and `typedoc` is ran against the repository. It is a relatively resource intensive
 task.
 
Missing APIs are built using the `grunt api` task. You can build APIs for a specific project by selecting the 
 appropriate configuration. You can also limit what versions get built using semver matching or the "latest" keyword
 either in the grunt configuration of via the `--apiversion` command line argument.

```bash
grunt api:cli --apiversion="latest"
```

This will build API documentation to `_dist/api/<name>/<version>`

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

*On a Nightly Cron Job*:

API documentation will be built on a nightly cron by Travis. This is a WIP.

1. Travis triggers a build on the master branch through a cron job
1. Travis decrypts the `deploy_key.enc` file to `deploy_key`
1. Travis begins a build by running `grunt api`
1. The build syncs the origin's `gh-pages` branch to a temporary directory
1. The build script uses GitHub's APIs to check for new releases
1. If a new release is found, Travis clones the repository and builds API documentation
1. The built API documentation is moved to the site
1. Each watched project is checked and API documentation is built
1. Travis runs `grunt publish` and pushes changes to the `gh-pages` branch

### Creating a Staging Environment

This section discusses how to get a complete staging environment working on a `dojo/dojo.io` fork using GitHub and 
 Travis. It is **not necessary** to do this when simply developing content as there is a local development environment
 available that you can run on your machine and see changes. You would typically set up a staging environment when you
 need to test updates to the continuous deployment scripts or want to host a preview of the site on GitHub.
 
This process has been largely automated with the `grunt setup --repo='you/dojo.io'` command.
 
These instructions assume you already have an account on GitHub and Travis and have installed the 
 [Travis command line client](https://blog.travis-ci.com/2013-01-14-new-client/).

1. Fork the `dojo/dojo.io` repo to your GitHub account
1. Enable builds for the fork on Travis
1. [Generate a new SSH Key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/). Name the public key `deploy_key.pub` and the private key `deploy_key`
1. On GitHub go to your repo's Deploy Keys (under Settings)
1. Click *Add deploy key*, paste the contents of `deploy_key.pub`, and check *Allow write access*
1. Ensure Travis has the proper settings for your repository by running `git config travis.slug`. An empty config value
   is ok (This step is most important for people with commit access to the `dojo/dojo.io` repository).
1. Log into travis using the command line client: `travis login`
1. Encrypt `deploy_key` (the private key) using `travis encrypt-file deploy_key`
1. Commit the newly created `deploy_key.enc` file to your repository and push to GitHub
1. Commits to master will now be built and deployed to your repositories GitHub pages

You should now be set up to build a staging environment automatically using Travis and GitHub. The recommended
development pattern is:

* Work on a branch
* When you want Travis to publish merge to your local master branch
* Make sure you never overwrite your `deploy_key.enc`
* Push and watch the magic!

### Automated Deploy to Production

TODO: This feature has been temporarily disabled while completing work on dojo/dojo.io. It will work by deploying to the `gh-pages` branch using `grunt publish`.

