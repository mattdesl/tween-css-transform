var tweenr = require('tweenr')()
var Transform = require('../')
var range = require('array-range')
var css = require('dom-css')

require('domready')(start)

function start() {
    css(document.body, {
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px)',
        margin: 0
    })

    var boxes = create()
    boxes.forEach(appendTo(document.body))

    var stagger = 0.0015
    var startTime = 1

    boxes.forEach(function(target, i, list) {
        var ending = { 
            rotation: [Math.PI/2, 0, Math.PI/2],
            translation: [0, 0, 0]
        }

        tweenr.to(Transform(target, {
            duration: 1,
            delay: startTime + i*stagger,
            ease: 'quartOut',
            start: 'none',
            end: ending
        }))

        tweenr.to(Transform(target, {
            duration: 1,
            delay: startTime + 1.75 + i*stagger,
            ease: 'sineIn',
            start: ending,
            end: { 
                rotation: [Math.PI*2, 0, -Math.PI/2],
            }
        }))
    })
}


function create(parent) {
    parent = parent || document.body

    var cols = 30
    var size = Math.ceil(window.innerWidth / cols)
    var rows = Math.ceil(window.innerHeight / size)
    var count = rows * cols
    var pad = 0

    count = Math.min(count, 600)
    console.log('total cells', count)
    return range(count).map(function(i) {
        var div = document.createElement('div')
        css(div, {
            position: 'absolute',
            background: '#1d1d1d',
            width: size,
            height: size,
            transformOrigin: '50% 50%',
            left: Math.floor(i%cols) * (size+pad),
            top: Math.floor(i/cols) * (size+pad)
        })
        return div
    })
}

function appendTo(parent) {
    return function(e) {
        parent.appendChild(e)
    }
}