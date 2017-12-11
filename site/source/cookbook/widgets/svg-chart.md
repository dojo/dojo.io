---
layout: cookbook
category: widgets
title: Build an SVG chart
overview: Build a simple SVG chart 
---

## Objective

This recipe demonstrates how to build a simple SVG bar chart within Dojo 2.

## Code example

Add this code to your render method:

```ts
render() {
    return v('svg', {
        preserveAspectRatio: 'none',
        viewBox: '0 0 800 800'
    }, [
        v('g', [
            v('rect', {
                x: '20',
                y: '20',
                width: '50',
                height: '200',
                fill: 'green'
            }),
            v('rect', {
                x: '100',
                y: '120',
                width: '50',
                height: '100',
                fill: 'red'
            }),
            v('rect', {
                x: '180',
                y: '170',
                width: '20',
                height: '50',
                fill: 'blue'
            })
        ])
    ])
}
```

Observe a bar chart with three vertical bars is drawn on your page.

