---
title: Building Progressive Web Apps With Dojo
date: 2018-09-13 08:00:00
authorId: mattwistrand
featured_image: featured.jpg
---
{% asset_img featured.jpg feature-full %}

Within the past few years, new features get added to browsers at breakneck speed. The time between proposal and standardization has dropped from years to months, and browser vendors are eager to maintain similar turnaround times for implementing new standards. In many ways, it has never been a better time to be a web developer.

Networks, on the other hand, are neither universally reliable nor universally performant. As developers, we have a responsibility to ensure our users do not suffer from our technical decisions. One step we can take against this is by delivering our application using Progressive Web Applications (PWA) technologies which are resilient to network issues.

<!-- more -->

At its most basic definition, “Progressive Web  App” (or “PWA”) is an umbrella term for a web application that applies a set of techniques and technologies to mimic the responsiveness and feel of a native application. Since progressive web apps at their heart are regular web pages, they run in the browser and bypass any native app store.

Network resilience that we see in native apps is provided in PWAs by a technology called Service Workers. A Service Worker is a worker that sits as a proxy between the page and the server. They can intercept requests and cache results. We also get the ‘install to homescreen’ experience courtesy of what is called the web manifest file (manifest.json). This manifest instructs the browser that the page is a PWA that is installable and provides things like application colors and icons.

Dojo makes it easy to deliver an app-like, offline-first experience to your users using only configuration settings supplied in the application’s `.dojorc`. Suppose we are developing an application for rock climbers that delivers information on climbing routes within the U.S. National Parks. The application allows users to view and rate routes, add their routes, and track those routes they have climbed. Further, the application contains an admin area and a user preferences screen. Finally, since there is a good chance that users do not get reliable wireless access while climbing, we need to ensure they can view route details offline.

Before delving into PWA features, we lay out a basic `.dojorc`  that instructs the Dojo build to separate the user preference and admin areas into separate bundles that get loaded on-demand.

```json
{
	"build-app": {
		"bundles": {
			"settings": [ ... ],
			"admin": [ ... ]
		}
	}
}
```

## Adding a Web App Manifest
The next step is to add a [web app manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) that provides information about the application like a name and available icons to display on the users’ home screens. The manifest for our application contains a set of icons that can be displayed on the home screen, the name to display alongside the icon, a brief description, and the background color to display while the app is loading:

```json
{
	"build-app": {
		"bundles": { ... },
		"pwa": {
			"manifest": {
				"background_color": "#212329",
				"name": "National Parks Climbing",
				"short_name": "Climbing",
				"description": "A guide to climbing routes in the U.S. National Parks",
				"icons": [
					{ "src": "./icon-48x48.png", "sizes": "48x48", "type": "image/png" },
					{ "src": "./icon-96x96.png", "sizes": "96x96", "type": "image/png" },
					{ "src": "./icon-256x256.png", "sizes": "256x256", "type": "image/png" }
				]
			}
		}
	}
}
```

With the above configuration, the Dojo build generates a JSON file and inline it within the `<head>` tag of the `index.html`. Since iOS devices do not currently use PWA manifests to read app data, [iOS-specific tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html) get inlined as well. When the user adds the app to their home screen, either the name or the short name gets displayed (depending upon available space), along with one of the provided icons. We provide multiple sizes so that the user’s device can choose the most appropriate one to display.

> If you are as internationalization-minded as we are, you should notice that there is no mechanism to localize the web app manifest. So your app uses the same icon, name, description, etc., regardless of the user’s preferred language. As a result, you need a server-side solution to localize your manifest.

Our application can now get installed on users home screens like a native app, but we still need a way to display content even when offline. That is where service workers come into play.

## Adding a Service Worker
A service worker is essentially a proxy between the network and the application. It is a single JavaScript file that runs in a separate thread from the application itself, and it can intercept and modify network requests, cache responses, and control how the browser responds to those requests.

As with the PWA manifest, the application’s service worker gets generated entirely from options specified in the `.dojorc`, this time housed beneath the [`pwa.serviceWorker`](https://github.com/dojo/cli-build-app#pwaserviceworker-object) namespace. When Dojo builds the application, it generates both the service worker file and ensures it is registered when the application starts. At this point, the service worker gets registered, but by default, it does not control the application until the next refresh. This default may get overridden by setting `"clientsClaim": true` , which causes the service worker to take control immediately. That said, in most cases, this override is not necessary, and we recommend not setting it until you have proven you need it.

Once the service worker gets successfully installed, it can begin intercepting requests and caching responses. There are two types of caches involved: the precache that is populated when the service worker gets installed with the static assets required to render the application shell and the runtime caches that gets populated with responses from network requests sent while using the application. By default, all assets in the build pipeline get added to the precache, but this can be limited to a subset of bundles. Alternatively, specific bundles may deliberately get excluded from the precache as well.

Since we are only concerned with making climbing routes available offline, we exclude the admin and preferences bundles from the precache:

```json
{
	"build-app": {
		"bundles: { ... },
		"pwa": {
			"manifest": { ... },
			"serviceWorker": {
				"excludeBundles": [ "admin", "settings" ]
			}
		}
	}
}
```

While setting the precache is rather straightforward, controlling the runtime caches requires a little consideration. There are four strategies when determining how network requests should get handled:

* `networkFirst` instructs the service worker to attempt to load the resource over the network, falling back to the cache if the network is unavailable.
* `cacheFirst` instructs the service worker to deliver the resource from the cache, sending a network request only when the resource does not exist in the cache.
* `networkOnly` prevents the resource from ever being loaded from the cache.
* `staleWhileRevalidate` loads the resource from the cache while it gets simultaneously fetched over the network. This strategy is useful when a resource is updated frequently, but having the latest version is not crucial to the user experience.

Choosing the right strategy depends on the type of resource as well as on how the user needs to use that resource. For example, we know that the climbers using our application need the most up-to-date information on unexpected park closures or dangers like mountain lion sightings or lightning storms. We also know they want accurate data on route locations, access, difficulty levels, and that they also want any maps that depict those routes. At the same time, we recognize that loading maps or images over a poor network connection are not an option, so we want to limit any network requests to fetching the lower-cost text descriptions.

Armed with that knowledge, we can add sensible route handling to our config:

```json
{
	"build-app": {
		"bundles": { ... },
		"pwa": {
			"manifest: { ... },
			"serviceWorker": {
				"excludeBundles": [ ... ],
				"routes": [
					{
						"urlPattern": "\/parks",
						"strategy": "networkFirst",
						"expiration": {
							"maxEntries": 25,
							"maxAgeSeconds": 604800
						}
					},
					{
						"urlPattern": "images\/route-maps",
						"strategy": "cacheFirst",
						"expiration": {
							"maxEntries": 25,
							"maxAgeSeconds": 2592000
						}
					}
				]
			}
		}
	}
}
```

Let’s break this down. Runtime strategies get specified at the route level under the `pwa.serviceWorker.routes` array. Each route includes a `”urlPattern”` that is converted internally to a regular expression and matches specific request URLs. Since users need to have the latest text information on parks and routes, we use the `networkFirst` strategy to ensure that users can get the latest data whenever the network is available. We then limit that cache to 25 pages, each cached for seven days before being removed. Finally, we instruct the service worker to load the route maps from the cache whenever possible and limit that cache to 25 maps with each expiring thirty days out. Of course, in a real application, you want to adjust the expirations according to what users access and how often.

With that, you are ready to begin upgrading your Dojo application to a PWA! There are of course several additional configuration options for both the [manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest) and the [service worker](https://github.com/dojo/webpack-contrib/#service-worker-plugin), and you can even provide your service worker if the generated service worker does not meet your needs. Finally, if you want to get further background knowledge on  PWAs, both Jake Archibald’s [The Service Worker Lifecycle](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle) and MDN’s [Introduction to progressive web apps](https://developer.mozilla.org/en-US/Apps/Progressive/Introduction) are excellent places to start.
