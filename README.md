# LMV Polymer

Experimental UI prototype for LMV using Polymer

See live samples at [lmv.rocks](http://lmv.rocks/)
![lmv-ui](https://cloud.githubusercontent.com/assets/565791/7425569/e9b456e6-ef67-11e4-9c1d-9328b44df298.png)

## About

The LMV (for Large Model Viewer), or also officially known as [the View and Data API](http://developer-autodesk.github.io/), is Autodesk's WebGL rendering engine, optimized for displaying large engineering and architectural models and the associated metadata. Learn more about the API [here](http://developer-autodesk.github.io/).

[Polymer](http://www.polymer-project.org/) is Google's experimental library built on top of [Web Components](http://webcomponents.org/), a collection of next-gen web standards that allows you to build modular, encapsulated, and reusable custom HTML elements.

**Warning:** This project is using Polymer [0.5 Developer Preview](https://www.polymer-project.org/0.5/). Google has since released a stable [1.0 Production Release](https://www.polymer-project.org/1.0/), which is not backwards compatible with 0.5. Fork at your own risk!

## Installation

1. Install [Node.js](https://nodejs.org/)
1. `npm install`
1. `bower install`

## Run Locally

`gulp serve`

## Build

`gulp`

## The Future

This project is an attempt to offer a collection of web components that uses the LMV API, so that other developers can use these to build custom LMV applications of their own.

For example, to include the viewer, it is as easy as:
```html
<lmv-viewer url="https://lmv.rocks/data/engineraw/0.svf"></lmv-viewer>
```

Eventually, we want to be able to provide the LMV as web components instead of a javascript library. As a developer, you simply load our library of custom elements, insert the `lmv-viewer` element and any other elements you want, like `lmv-model-tree` or `lmv-animiation-view`, and they just work, without writing a line of javascript!

To demonstrate, here's a simple page with the viewer:
```html
<!DOCTYPE html>
<html>
<head>
  <title>LMV Test</title>

  <!-- include polyfill, eventually this will go away! -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/0.6.1/webcomponents.min.js"></script>

  <!-- include lmv-polymer elements -->
  <link rel="import" href="http://lmv.rocks/viewer/elements/elements.min.html">

  <style type="text/css">
    lmv-viewer { width: 600px; height: 400px; }  /* give it some size */
  </style>
</head>
<body>

  <!-- insert lmv-viewer element -->
  <lmv-viewer url="https://lmv.rocks/data/engineraw/0.svf"></lmv-viewer>

</body>
</html>
```

All of this is currently working now within the project. Feel free to take a look around and fork this project. However, it is still a long way to clean it up, package it, and turn it into a robust API. We're working on it! (or just me :sweat:)
