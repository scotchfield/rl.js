var rl = (function () {
    'use strict';

    var rl = {}, tiles = [],
        canvas = false, ctx = false,
        keydownCallbacks = [],

    options = {
        width: 40,
        height: 25,
        tileWidth: 24,
        tileHeight: 24,
        backgroundColor: '#000000',
        font: '20pt monospace',
        fontFillStyle: '#ffffff',
        textAlign: 'center',
    };

    rl.TileBlocking = function () {
        return {
            c: '#',
            style: function () { return '#ffffff' },
            blocking: true,
            render: function (x, y) {
                rl.style(this.style()).square(x, y);
            }
        }
    };

    rl.TileWall = function (colour) {
        var that = rl.TileBlocking();

        if (colour !== undefined) {
            that.style = function () { return colour; }
        }

        return that;
    };

    rl.registerKeydown = function (cb) {
        keydownCallbacks.push(cb);

        return this;
    };

    rl.unregisterKeydown = function (cb) {
        for (var i = keydownCallbacks.length; i >= 0; i -= 1) {
            if (keydownCallbacks[i] === cb) {
                keydownCallbacks.splice(i, 1);
            }
        }

        return this;
    };

    rl.keydown = function (e) {
        keydownCallbacks.forEach(
            function(currentValue) {
                currentValue(e);
            }
        );

        return this;
    };

    rl.clear = function () {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        return this;
    };

    rl.style = function (c) {
        ctx.fillStyle = c;

        return this;
    };

    rl.write = function (s, x, y) {
        for (var i = 0; i < s.length; i += 1) {
            ctx.fillText(s[i],
                (x + i + 1) * options.tileWidth - 9,
                (y + 1) * options.tileWidth - 1);
        }

        return this;
    };

    rl.square = function (x, y) {
        ctx.fillRect(x * options.tileWidth, y * options.tileHeight,
                     options.tileWidth, options.tileHeight);

        return this;
    };

    rl.addTile = function (x, y, t) {
        var tile = (t === undefined) ? this.TileBlocking() : t;
        tiles.push({x: x, y: y, t: tile});

        return this;
    }

    rl.canMoveTo = function (x, y) {
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

    rl.canvas = function (opt) {
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

    rl.create = function (id, options) {
        canvas = this.canvas(options);
        document.getElementById(id).appendChild(canvas);

        return this;
    };

    // Render any tiles that we're storing to the canvas.
    // x and y represent the top-left corner of the screen.
    rl.render = function (x, y) {
        tiles.forEach(
            function(t) {
                if (t.x >= x && t.x < x + options.width &&
                        t.y >= y && t.y < y + options.height) {
                    t.t.render(t.x - x, t.y - y);
                }
            }
        );

        return this;
    }

    rl.cx = function () {
        return Math.floor(options.width / 2);
    }

    rl.cy = function () {
        return Math.floor(options.height / 2);
    }

    window.addEventListener('keydown', rl.keydown);

    return rl;
}());
