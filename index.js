var Base = require('tween-base')
var inherits = require('inherits')
var mat4 = require('gl-mat4')

var interpolate = require('mat4-interpolate')
var isArray = require('an-array')
var stringifyMat4 = require('matrix-to-css')

var applyStyle = require('./compute')
var transform = require('./transform')

var tmp = mat4.create()

module.exports = function(target, opt) {
    return new TransformTween(target, opt)
}

function TransformTween(target, opt) {
    Base.call(this, opt)
    this.target = target
    this.start = opt && opt.start
    this.end = opt && opt.end
    this._startMatrix = (this.start && isArray(this.start)) ? this.start : mat4.create()
    this._endMatrix = (this.end && isArray(this.end)) ? this.end : mat4.create()
}

inherits(TransformTween, Base)

TransformTween.prototype.ready = function() {
    var start = this.start,
        end = this.end

    //get default value (i.e. current DOM state)
    //but only compute if start or end is not specified
    if (!start || !end) {
        applyStyle.compute(this.target, tmp)
        start = start||tmp
        end = end||tmp
    }

    applyStyle(this.target, end, this._endMatrix)
    applyStyle(this.target, start, this._startMatrix)
    console.log(start, end)
}

TransformTween.prototype.lerp = function(alpha) {
    var valid = interpolate(tmp, this._startMatrix, this._endMatrix, alpha)
    var result = tmp

    //if we couldn't decompose/recompose, then just "snap" between the two
    //based on our current interpolation
    if (!valid) 
        result = alpha > 0.5 ? this._endMatrix : this._startMatrix
    
    //stringify the matrix
    transform(this.target.style, stringifyMat4(result))
}
