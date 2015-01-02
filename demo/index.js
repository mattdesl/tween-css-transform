var tweenr = require('tweenr')()
var Tween3D = require('../')
var css = require('dom-css')
var Chain = require('tween-chain')

require('domready')(start)

function start() {
    var parent = document.body.appendChild(document.createElement('div'))
    css(parent, {
        width: 100,
        height: 100,
        position: 'absolute',
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px)',
        top: 0,
        left: 0
    })

    var child = parent.appendChild(document.createElement('div'))
    css(child, {
        background: 'blue',
        width: 100,
        height: 100,
        position: 'absolute',
        transformStyle: 'preserve-3d',
        top: 0,
        left: 0
    })

    var chain = Chain() 
        .then(Tween3D(child, {
            duration: 1,
            delay: 1,
            ease: 'elasticOut',
            end: 'translateX(20px) translateY(20px) rotateY(50deg) rotateZ(60deg)'
        }))
        .then(Tween3D(child, {
            duration: 1,
            ease: 'expoOut',
            end: 'rotateX(50deg) rotateY(-250deg) rotateZ(1.3rad)'
        }))
        .then(Tween3D(child, {
            duration: 1,
            ease: 'bounceOut',
            end: 'rotateX(0deg) translateX(225px) translateY(20px) scaleX(1.25) scaleY(1.25) rotateY(0deg)'
        }))

    tweenr.to(chain)
}