var Base = require('tween-base')
var inherits = require('inherits')
var Interpolate = require('./lib/interpolate')

module.exports = function(target, opt) {
    return new TransformTween(target, opt)
}

function TransformTween(target, opt) {
    Base.call(this, opt)
    this.target = target
    this.start = opt && opt.start
    this.end = opt && opt.end

    this.interpolator = Interpolate()
    this._onFree = this._free.bind(this)
}

inherits(TransformTween, Base)

TransformTween.prototype._free = function() {
    this.interpolator.release()
}

TransformTween.prototype.ready = function() {
    //when the tween is done, free the allocated arrays
    this.removeListener('complete', this._onFree)
    this.once('complete', this._onFree)

    //allocate the scratch arrays for interpolation
    this.interpolator.set(this.target, this.start, this.end)
}

TransformTween.prototype.lerp = function(alpha) {
    this.interpolator.interpolate(alpha)
    this.interpolator.style(this.target)
}
