var prefix = require('prefix-style')
var prefixed

module.exports = function transform(style, value) {
    if (!prefixed)
        prefixed = prefix('transform')
    if (typeof value === 'undefined')
        return style[prefixed]
    else
        style[prefixed] = value
}