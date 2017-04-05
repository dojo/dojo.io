# dojo.io

[![Build Status](https://travis-ci.org/dojo/dojo.io.svg?token=iyehyStnJABkD5DAaT6V&branch=master)](https://travis-ci.org/dojo/dojo.io)

Published to [GitHub Pages](https://dojo.github.io/dojo.io/) and [Dojo.io](http://dojo.io)

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

This site is built for continuous deployment via Travis-ci. This requires Travis to have write access to this
repository so it can automatically deploy to the `gh-pages` branch.

*On Master Branch Commit*:

1. a change is checked in to the `master` branch
1. Travis decrypts the `deploy_key.enc` file to `deploy_key`
1. Travis begins a build by running `npm run ci`
1. The build syncs the origin's `gh-pages` branch to a temporary directory
1. Hexo builds against the `gh-pages` branch
1. Tutorial files are packaged and added
1. Travis pushes changes to `gh-pages`

*On Non-Master Branch Commit*:

The same steps as above are followed except Travis does not decrypt the `deploy_key` and does not attempt
 to push any changes. Automated scripts should not take any action requiring authentication to git or GitHub
 because credentials will not exist.

*On Nightly Cron*:

API documentation will be built on a nightly cron by Travis. This is a WIP.

1. Travis triggers a build on the master branch through a cron job
1. Travis decrypts the `deploy_key.enc` file to `deploy_key`
1. Travis begins a build by running `npm run cron`
1. The build syncs the origin's `gh-pages` branch to a temporary directory
1. The build script uses GitHub's APIs to check for new releases
1. If a new release is found, Travis clones the repository and builds API documentation
1. The built API documentation is moved to the site
1. Each watched project is checked and API documentation is built
1. Travis pushes changes to `gh-pages`

### Creating a Staging Environment

This section discusses how to get a complete staging environment working on a `dojo/dojo.io` fork using GitHub and 
 Travis. It is **not necessary** to do this when simply developing content as there is a local development environment
 available that you can run on your machine and see changes. You would typically set up a staging environment when you
 need to test updates to the continuous deployment scripts or want to host a preview of the site on GitHub.
 
These instructions assume you already have an account on GitHub and Travis and have installed the 
 [Travis command line client](https://blog.travis-ci.com/2013-01-14-new-client/).

1. Fork the `dojo/dojo.io` repo to your GitHub account
1. Enable builds for the fork on Travis
1. [Generate a new SSH Key](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/).
   We'll call the public key `deploy_key.pub` and the private key `deploy_key`.
1. On GitHub go to your repo's Deploy Keys (under Settings)
1. Click *Add deploy key*, paste the contents of `deploy_key.pub`, and check *Allow write access*
1. Ensure travis has the proper settings for your repository by running `git config travis.slug`. An empty config value
   is ok (This step is most important for people with commit access to dojo/dojo.io).
1. Log in to travis using the command line client: `travis login`
1. Encrypt `deploy_key` (the private key) using `travis encrypt-file deploy_key`
1. Commit the newly created `deploy_key.enc` file to your repository and push to GitHub
1. Commits to master will now be build and deployed to your repositories GitHub pages

You should not be set up to build a staging environment automatically using Travis and GitHub. The recommended
development pattern is

* Work on a branch
* When you want Travis to publish merge to your local master branch
* Make sure you never overwrite your `deploy_key.enc`
* Push and watch the magic!

### Deploy to Production

TODO not yet implemented

Deploy to the `gh-pages` branch using `npm run publish`

## Travis Support

TODO not yet implemented

This site is built for continious deployment from TravisCI. This requires it to have write access to the `gh-pages`
 branch of this project to fulfill automatic deployment duties. Access tokens should be encrypted with TravisCI and
 supplied through an environment variable used in deployment.
