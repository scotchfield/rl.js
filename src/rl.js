var rl = (function () {
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

        return this;
    };

    exports.unregisterKeydown = function (cb) {
        for (var i = keydownCallbacks.length; i >= 0; i -= 1) {
            if (keydownCallbacks[i] === cb) {
                keydownCallbacks.splice(i, 1);
            }
        }

        return this;
    };

    exports.keydown = function (e) {
        keydownCallbacks.forEach(
            function(currentValue) {
                currentValue(e);
            }
        );

        return this;
    };

    exports.clear = function () {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return this;
    };

    exports.style = function (c) {
        ctx.fillStyle = c;

        return this;
    };

    exports.write = function (s, x, y) {
        for (var i = 0; i < s.length; i += 1) {
            ctx.fillText(s[i],
                (x + i + 1) * options.tileWidth - 8,
                (y + 1) * options.tileWidth);
        }

        return this;
    };

    exports.square = function (x, y) {
        ctx.fillRect(x * options.tileWidth, y * options.tileHeight,
                     options.tileWidth, options.tileHeight);

        return this;
    };

    exports.canvas = function (opt) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k)) {
                options[k] = opt[k];
            }
        }

        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');

        canvas.width = options.width * options.tileWidth;
        canvas.height = options.height * options.tileHeight;
        this.clear();

        ctx.font = options.font;
        ctx.textAlign = options.textAlign;

        return canvas;
    };

    window.addEventListener('keydown', exports.keydown);

    return exports;
}());
