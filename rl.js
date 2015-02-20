var r = (function () {
    'use strict';

    var exports = {};

    var canvas = false, ctx = false,
    options = {
        width: 40,
        height: 25,
        tileWidth: 24,
        tileHeight: 24,
        backgroundColor: '#000000',
        font: '20pt monospace',
        fontFillStyle: '#ffffff',
        textAlign: 'center',
    },
    keydownCallbacks = [];

    exports.registerKeydown = function (cb) {
        keydownCallbacks.push(cb);
    };

    exports.unregisterKeydown = function (cb) {
        for (var i = keydownCallbacks.length; i >= 0; i -= 1) {
            if (keydownCallbacks[i] === cb) {
                keydownCallbacks.splice(i, 1);
            }
        }
    };

    exports.keydown = function (e) {
        keydownCallbacks.forEach(
            function(currentValue) {
                currentValue(e);
            }
        );
    };

    exports.print = function (s, x, y) {
//        var cx 
    };

    exports.canvas = function (opt) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k) && ! options.hasOwnProperty(k)) {
                options[k] = opt[k];
            }
        }

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        canvas.width = options.width * options.tileWidth;
        canvas.height = options.height * options.tileHeight;

        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = options.font;
        ctx.fillStyle = options.fontFillStyle;
        ctx.textAlign = options.textAlign;
        for (var x = 0; x < 16; x += 1) {
            ctx.fillText('@',
                (x + 1) * options.tileWidth - 8, 1 * options.tileWidth);
        }

        return canvas;
    };

    window.addEventListener('keydown', exports.keydown);

    return exports;
}());
