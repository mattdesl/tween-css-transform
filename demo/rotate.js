var tweenr = require('tweenr')()
var Transform = require('../')
var css = require('dom-css')

require('domready')(function () {
    //our 3D DOM element...
    var element = create('☯')
    document.body.appendChild(element)

    //animate the elment once, returning the tween
    function animate(rotation) {
        var tween = Transform(element, {
            duration: 1, 
            ease: 'quartOut',
            end: { rotation: rotation }
        })
        return tweenr.to(tween)
    }
        
    //loop indefinitely
    function loop() {
        return animate(random())
            .on('complete', loop)
    }

    //start loop
    loop()
})

//random XYZ rotation in radians
function random() {
    return [ 0, 0, 0 ]
        .map(Math.random)
        .map(function(n) {
            return (n*2-1) * Math.PI * 2
        })
}

//centered 3D circle
function create(text) {
    var parent = document.createElement('div')
    css(parent, {
        width: '100%',
        height: '100%',
        position: 'absolute',
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px)',
        top: 0,
        left: 0
    })

    var child = parent.appendChild(document.createElement('div'))
    css(child, {
        background: '#1d1d1d',
        width: 100,
        height: 100,
        margin: 'auto',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: '50%',
        color: 'white',
        lineHeight: '100px',
        fontSize: 45,
        textAlign: 'center'
    })
    if (text) 
        child.innerHTML = text
    return child
}