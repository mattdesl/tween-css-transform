var interpolate = require('mat4-interpolate')
var isArray = require('an-array')
var pool = require('typedarray-pool')
var stringify = require('mat4-css-stringify')

var style = require('./style')
var transform = require('./transform')

var mat4 = {
    copy: require('gl-mat4/copy'),
    identity: require('gl-mat4/identity'),
    determinant: require('gl-mat4/determinant'),
    scale: require('gl-mat4/scale')
}

var tmp = mat4.identity([])
var EPSILON = 1e-5

module.exports = Interpolator
function Interpolator(target, start, end) {
    if (!(this instanceof Interpolator))
        return new Interpolator(target, start, end)
    
    //allocate pooled matrices
    this._startMatrix = pool.mallocFloat(16) 
    this._endMatrix = pool.mallocFloat(16)
    this._currentMatrix = pool.mallocFloat(16)

    if (target)
        this.set(target, start, end)
}

Interpolator.prototype.release = function() {
    if (this._startMatrix) pool.freeFloat(this._startMatrix)
    if (this._endMatrix) pool.freeFloat(this._endMatrix)
    if (this._currentMatrix) pool.freeFloat(this._currentMatrix)

    this._startMatrix = null
    this._endMatrix = null
    this._currentMatrix = null
}

Interpolator.prototype.set = function(target, start, end) {
    //if user specified mat4 for start/end
    if (start && isArray(start))
        mat4.copy(this._startMatrix, start)
    if (end && isArray(end))
        mat4.copy(this._endMatrix, end)

    //if start or end isn't specified, we need to get hold of the
    //current DOM state
    if (!start || !end) {
        style.compute(target, tmp)
        start = start||tmp
        end = end||tmp
    }

    //setup the end state, this will mutate the element's style
    style(target, end, this._endMatrix)
    
    //then setup the start state so it's ready
    style(target, start, this._startMatrix)

    //to avoid non-invertible matrices we will use a little push on the scale

    fixScale(this._startMatrix)
    fixScale(this._endMatrix)
}

Interpolator.prototype.interpolate = function(alpha) {
    if (!this._startMatrix || !this._endMatrix)
        return

    var valid = interpolate(tmp, this._startMatrix, this._endMatrix, alpha)
    var result = tmp

    //if we couldn't decompose/recompose, then just "snap" between the two
    //based on our current interpolation
    if (!valid) {
        result = alpha > 0.5 ? this._endMatrix : this._startMatrix
    }
    mat4.copy(this._currentMatrix, result)
}

Interpolator.prototype.style = function(target) {
    var res = this._currentMatrix
    // stringify the matrix
    transform(target.style, stringify(res))
}

function fixScale(matrix) {
    if (!mat4.determinant(matrix)) {
        for (var i=0; i<16; i++)
            matrix[i] += EPSILON*Math.random()    
    }
}