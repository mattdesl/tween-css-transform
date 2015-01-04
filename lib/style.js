var quat = require('./quat')
var mat4 = {
    copy: require('gl-mat4/copy'),
    identity: require('gl-mat4/identity')
}
var parse = require('mat4-css-parse')
var stringify = require('mat4-css-stringify')

var recompose = require('mat4-recompose')
var isArray = require('an-array')

var isMatrix = /^matrix/
var transform = require('./transform')

var ZERO = [0, 0, 0]
var ONES = [1, 1, 1]
var IDENTITY = [0, 0, 0, 1]
var tmpQuat = [0, 0, 0, 1]

//stores the "value" (string/matrix) into out
module.exports = function computeMat4(target, value, out) {
    //start is specified as CSS transform string
    if (typeof value === 'string') {
        //apply the transform string style
        transform(target.style, value)

        //if it's a matrix or matrix3d() value we can just parse it quickly
        if (value.indexOf('matrix') === 0)
            parse(value, out)
        else if (value === 'none') {
            mat4.identity(out)
            //apply the mat4 style
            transform(target.style, stringify(out))
            return
        }
        //otherwise we will let the browser compute the translation/rotation/etc
        // (this could maybe be optimized in future to avoid reflows)
        else 
            compute(target, out)
    } else {
        //if user passed object with rotation translation etc
        if (!isArray(value) && typeof value === 'object')
            value = fromObject(value, out)
        //if user passed a mat4 array
        else 
            mat4.copy(out, value)

        //apply the mat4 style
        transform(target.style, stringify(value))
    }
}

function fromObject(opt, out) {
    mat4.identity(out)
        
    var translation = opt.translation || ZERO
    var skew = opt.skew || ZERO
    var scale = opt.scale || ONES
    var perspective = opt.perspective || IDENTITY
    var rotation = opt.quaternion

    if (!rotation) {
        //build a XYZ euler angle from 3D rotation
        rotation = quat.identity(tmpQuat)
        var euler = opt.rotation || ZERO

        if (euler[0] !== 0) 
            quat.rotateX(rotation, rotation, euler[0])
        if (euler[1] !== 0)
            quat.rotateY(rotation, rotation, euler[1])
        if (euler[2] !== 0)
            quat.rotateZ(rotation, rotation, euler[2])
    }

    return recompose(out, translation, scale, skew, perspective, rotation)
}

function compute(target, out) {
    //compute style
    var result = window.getComputedStyle(target, null)
    var style = transform(result)
    if (style.indexOf('matrix') !== 0) //none/other etc
        return mat4.identity(out)
    //parse string into starting mat4
    return parse(style, out)
}

module.exports.compute = compute