var rl = (function () {
    'use strict';

    var exports = {};

    var tiles = [];

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

    var TileBlocking = function () {
        this.c = '#';
        this.style = function () { return '#ffffff' };
        this.blocking = true;
    };

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

    exports.addTile = function (x, y, t) {
        var tile = (t === undefined) ? new TileBlocking() : t;
        tiles.push({x: x, y: y, t: tile});

        return this;
    }

    exports.canMoveTo = function (x, y) {
        var result = true;
        tiles.forEach(
            function (current) {
                if (current.x === x && current.y === y &&
                        current.t.blocking === true) {
                    result = false;
                }
            }
        );
        return result;
    }

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

    exports.create = function (id, options) {
        canvas = this.canvas(options);
        document.getElementById(id).appendChild(canvas);

        return this;
    };

    // Render any tiles that we're storing to the canvas.
    // x and y represent the top-left corner of the screen.
    exports.render = function (x, y) {
        var tile;
        for (var i = 0; i < tiles.length; i += 1) {
            this.style(tiles[i].t.style())
                .square(tiles[i].x, tiles[i].y)
        }
        return this;
    }

    window.addEventListener('keydown', exports.keydown);

    return exports;
}());
