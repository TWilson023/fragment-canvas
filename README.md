# fragment-canvas

_Easily render a GLSL fragment shader on an HTML canvas._

**fragment-canvas** is a small package used for rendering fragment shaders on an HTML canvas, similar to those built with [Shadertoy](https://www.shadertoy.com/).

## Installation

`yarn add fragment-canvas` or `npm install fragment-canvas`

## Usage

To render a fragment shader to an existing canvas, create a new instance of `FragmentCanvas`:

```ts
new FragmentCanvas(canvas, options);
```

### Options

The `options` object accepts the following options:
| Option        | Description        | Default |
| ------------- | ------------------ | ------- |
| `fragmentShader` | GLSL fragment shader string | A basic color changing shader |
| `uniforms` | Custom uniforms to pass to the shader. See example below. | {} |
| `autoRender` | Whether to automatically render the shader with requestAnimationFrame. If you set this to `false`, you'll have to call `FragmentCanvas.render` manually | `true` |
| `blendFunc` | WebGL context blending function | `[WebGLRenderingContext.SRC_ALPHA, WebGLRenderingContext.ONE]` |
| `vertexShader` | GLSL vertex shader string | A basic vertex shader setting `gl_Position`. You probably don't need to change this! |

### Built-in uniforms
The following uniforms are built in and available for you to use in your shader:
| Uniform       | Type | Description |
| ------------- | ---- | ----------- |
| `iResolution` | `vec2` | Canvas resolution |
| `iTime` | `float` | Elapsed time in seconds |

### Custom uniforms

To use custom uniforms, provide them via the `uniform` option. Here's an example of passing a custom `offset` uniform, dependent on elapsed time:
```ts
new FragmentCanvas(canvas, {
  fragmentShader: customFragmentShader,
  uniforms: {
    offset: (gl, location, time) => gl.uniform1f(location, Math.cos(time) * 10),
  },
});
```
