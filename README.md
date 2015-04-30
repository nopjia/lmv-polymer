# LMV Polymer

Experimental UI prototype for LMV using Polymer

See live samples at [lmv.rocks](http://lmv.rocks/)
![lmv-ui](https://git.autodesk.com/github-enterprise-assets/0000/2078/0000/1884/31b3e17a-ef89-11e4-963b-e9c61825b4c7.png)

## About

The LMV (for Large Model Viewer), or also officially known as [the View and Data API](http://developer-autodesk.github.io/), is Autodesk's WebGL rendering engine, optimized for displaying large engineering and architectural models and the associated metadata. Learn more about the API [here](http://developer-autodesk.github.io/). 

[Polymer](http://www.polymer-project.org/) is Google's experimental library built on top of [Web Components](http://webcomponents.org/), a collection of next-gen web standards that allows you to build modular, encapsulated, and reusable custom HTML elements.

Warning: Polymer is currently in 0.5 Developer Preview. The upcoming [0.8 Alpha Release](https://www.polymer-project.org/0.8/) is the first step in providing a stable API, but it will not be compatible with 0.5. Fork at your own risk!

This project is an attempt to offer a collection of web components that uses the LMV API, so that other developers can use these to build custom LMV applications of their own.

For example, to include the viewer, it is as easy as:
```
<body>
  <lmv-viewer url="https://lmv.rocks/data/engineraw/0.svf"></lmv-viewer>
</body>
```

## Installation

1. Install [Node.js](https://nodejs.org/)
1. `npm install`
1. `bower install`

## Run Locally

`gulp serve`

## Build

`gulp`

---
Copyright © 2015 Nop Jiarathanakul
