var prefix = require('prefix-style')
var parseMat4 = require('css-to-mat4')
var stringify = require('matrix-to-css')
var mat4copy = require('gl-mat4/copy')
var identity = require('gl-mat4/identity')

var isMatrix = /^matrix/

var transform = require('./transform')

//stores the "value" (string/matrix) into out
module.exports = function computeMat4(target, value, out) {
    //start is specified as CSS transform string
    if (typeof value === 'string') {
        //apply the transform string style
        transform(target.style, value)

        //if it's a matrix or matrix3d() value we can just parse it quickly
        if (isMatrix.test(value)) {
            parseMat4(value, out)
        }
        //otherwise we will let the browser compute the translation/rotation/etc
        // (this could maybe be optimized in future to avoid reflows)
        else {
            compute(target, out)
        }
    } else {
        //apply the mat4 style
        transform(target.style, stringify(value))

        //copy start values into our starting matrix
        mat4copy(out, value)
    }
}

function compute(target, out) {
    //compute style
    var result = window.getComputedStyle(target, null)
    var style = transform(result)
    if (!(isMatrix.test(style))) //none/other etc
        return identity(out)
    //parse string into starting mat4
    return parseMat4(style, out)
}

module.exports.compute = compute