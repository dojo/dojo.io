---
layout: false
title: Working with a Virtual DOM
overview:
---

* what can I do with the DOM?
  * create, move, and destroy elements
  * manipulate attributes and properties
  * elements contain other elements
  * represent what is rendered to the page
* what is bad about DOM?
  * manipulation triggers reflow - slow
    * easy to trigger multiple reflows per rendering cycle, hurting rendering performance
  * inconsistent API
* what is good about virtual DOM?
  * efficiently change DOM
  * batch render operations to align with page refreshes
  * lightweight - cheap to create and destroy
  * simpler, more consistent API
* components of virtual DOM
  * projector
  * vnodes
  * DOM nodes
* constraints of working with virtual DOM1
  * can't change event handlers
  * must be able to uniquely identify nodes
  * only considers differences from its previous render
    * ignores manual manipulation of nodes

