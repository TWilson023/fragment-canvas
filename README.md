# fragment-canvas

_Easily render a GLSL fragment shader on an HTML canvas._

**fragment-canvas** is a small package used for rendering fragment shaders on an HTML canvas, similar to those built with [Shadertoy](https://www.shadertoy.com/).

## Installation

`yarn add fragment-canvas` or `npm install fragment-canvas`

## Usage

To render a fragment shader to an existing canvas, create a new instance of `FragmentCanvas`:

```
const fc = new FragmentCanvas(canvas, options);
```
