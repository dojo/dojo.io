---
layout: tutorial
title: Routing
overview: In this tutorial, you will learn how to use Dojo 2's declartive routing within your application.
---

{% section 'first' %}

# Appliction routing

## Overview
Add routing overview here.

## Prerequisites
You can [download](../assets/1030_routing-initial.zip) the demo project and run `npm install` to get started.

The `@dojo/cli` command line tool should be installed globally. Refer to the [Dojo 2 local installation](../000_local_installation/) article for more information.

You also need to be familiar with TypeScript as Dojo 2 uses it extensively. For more information, refer to the [TypeScript and Dojo 2](../comingsoon.html) article.

{% section %}

## Configuring the router

{% task 'Create the routing configuration' %}

Talk about how to and creating the routing configuration.

{% instruction 'Add the routing condfiguration to `main.ts`.' %}

{% include_codefile 'demo/finished/biz-e-corp/src/main.ts' line:1 %}

Next, we will add the basic application menu.

{% section %}

## Routing outlets

{% task 'Creatng the routing outlets required.' %}

Describe what a routing outlet is, a HOC that wraps visual components but will only render when the route matches an outlet configured in section one. Talk about index, component and error outlet components. Talk about separating the directories
for outlets.

## Adding Links

{% task 'Add a sidebar menu to the application.' %}

{% section %}

## Dynamic Outlet

{% task 'Add route that filters the workers by last name.' %}

Add the filtered outlet, talk about the mapping function that allows route params/querys/location to be mapped to a visual components properties.

## Summary


If you would like, you can download the completed [demo application](../assets/1030_routing.zip) from this tutorial.

{% section 'last' %}
