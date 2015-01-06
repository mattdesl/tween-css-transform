# tween-css-transform

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Tweens a DOM element using CSS `matrix3d()` and 4x4 matrix interpolation (decomposition/recomposition). This allows for a smooth range of 3D rotations (using quaternions and spherical interpolation) without gimbal lock. 

Typically used with [tween-ticker](https://nodei.co/npm/tween-ticker/) or [tweenr](https://nodei.co/npm/tweenr/). Example:

```js
var tweenr = require('tweenr')()
var Transform = require('tween-css-transform')

//you can specify transform strings
var tween1 = Transform(element, {
    duration: 1,
    delay: 0.5, 
    ease: 'expoOut',
    start: 'translateX(10px) rotateX(90deg)'
    end: 'matrix(1,0,0,1,0,0)'
})
tweenr.to(tween1)

//or you can "compose" a matrix with 3D components
var tween2 = Transform(element, {
    duration: 1,
    delay: 2,
    end: { 
        rotation: [0, Math.PI/2, 0],
        translation: [25, 15, 50],
        scale: [1, 1.25, 1.5]
    }
})
tweenr.to(tween2)

//a "from-to" tween, tweens from given transform to its initial state
var tween3 = Transform(foobar, {
    duration: 1,
    start: 'translateX(25px)'
})
tweenr.to(tween3)
```

## demos

Some demos:

- [3D rotation](http://requirebin.com/?gist=9ee27b3c7b527cbb194e) - [source](demo/index.js)
- [chained tweens](http://mattdesl.github.io/tween-css-transform/demo/simple.html) - [source](demo/index.js)
- [stress test](http://mattdesl.github.io/tween-css-transform/demo/stress.html) - [source](demo/stress.js)

## Usage

[![NPM](https://nodei.co/npm/tween-css-transform.png)](https://nodei.co/npm/tween-css-transform/)

#### `Transform(element[, opt])`

Creates a new transform tween with the given options. These include:

- `duration` the time in seconds for this tween (default 0)
- `delay` the delay before the tween should start, in seconds (default 0)
- `ease` an easing equation, see [tweenr](https://nodei.co/npm/tweenr/) docs for details
- `start` the starting transform for this tween. If not specified, the tween will compute the element's transformation matrix (may cause reflows)
- `end` the ending transform for this tween. Also defaults to the element's computed transformation at the time the tween starts.

The `start` and `end` options can be a CSS string (like `matrix()`, `matrix3d()`, or a series of transform operations), or a 16-float array, or an object of components. If an object is specified, it will look for:
  
- `translation` the XYZ translation in pixels (default `[0, 0, 0]`) 
- `scale` in XYZ (default `[1, 1, 1]`) 
- `rotation` the euler XYZ-order rotation in radians (default `[0, 0, 0]`) 
- if `quaternion` is specified (XYZW) it will override the `rotation` parameter

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/tween-css-transform/blob/master/LICENSE.md) for details.
