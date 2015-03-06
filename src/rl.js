// rl.js: A JavaScript library to build browser-based roguelikes.

var rl = (function () {
    'use strict';

    var rl = {}, tiles = [],
        canvas = false, ctx = false,
        keydownCallbacks = [],
        blocking = {},

    images = {},

    // A collection of options can be passed to create. These options are
    // used to specify the width and height (in tiles) of the new canvas,
    // the tile size, and so on. The defaults are listed here.
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

    // Tiles are represented as objects, and have two primary properties:
    // render and blocking. The render property identifies a function that
    // draws the tile to the specified (x, y) location. The blocking
    // property is used to prevent movement.

    // todo: need another property to block movement but allow light/sight.

    // A solid white square that blocks typical character movement.
    // The object returned from rl.TileBlocking can be used as a template
    // for new blocking tiles (see TileWall for an example).
    rl.TileBlocking = function () {
        if (!(this instanceof rl.TileBlocking)) {
            return new rl.TileBlocking();
        }
    };
    rl.TileBlocking.prototype.style = function () { return '#ffffff' };
    rl.TileBlocking.prototype.blocking = true;
    rl.TileBlocking.prototype.render = function (x, y) {
        rl.style(this.style()).square(x, y);
    };

    // By using TileBlocking as a template and modifying the style
    // property, we can enable simple coloured walls.
    rl.TileWall = function (colour) {
        var that = rl.TileBlocking();

        if (colour !== undefined) {
            that.style = function () { return colour; }
        }

        return that;
    };

    // Since we can cache images using rl.js, we can use TileBlocking as a
    // template and render images instead of blank squares.
    // image_id: the key associated with the cached image
    // (x, y): the (x, y) coordinates in image_id where the tile begins
    // (width, height): the size of the source tile in image_id
    rl.TileImg = function (image_id, x, y, width, height) {
        var that = rl.TileBlocking();

        that.image_id = image_id;
        that.image_x = x;
        that.image_y = y;
        that.image_w = width;
        that.image_h = height;

        that.render = function (x, y) {
            if (images[image_id] !== undefined) {
                ctx.drawImage(images[image_id],
                              that.image_x, that.image_y,
                              that.image_w, that.image_h,
                              x * options.tileWidth, y * options.tileHeight,
                              options.tileWidth, options.tileHeight);
            }
        };

        return that;
    };

    // Just like TileImg, but toggle the blocking parameter so that
    // characters can walk over the square (for example, a dirt or grass tile).
    rl.TileImgNoBlock = function (image_id, x, y, width, height) {
        var that = rl.TileImg(image_id, x, y, width, height);

        that.blocking = false;

        return that;
    }

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
        tiles.forEach(function (t) {
            if (t.x >= x && t.x < x + options.width &&
                    t.y >= y && t.y < y + options.height) {
                t.t.render(t.x - x, t.y - y);
            }
        });

        return this;
    };

    rl.cx = function () {
        return Math.floor(options.width / 2);
    };

    rl.cy = function () {
        return Math.floor(options.height / 2);
    };

    rl.loadImage = function (name, id, cb) {
        var image = new Image();
        image.src = name;
        image.onload = function () {
            images[id] = this;
            if (cb !== undefined) {
                cb();
            }
        };

        return this;
    };

    rl.updateBlocking = function () {
        blocking = {};

        tiles.forEach(function (t) {
            if (t.t.blocking === true) {
                blocking[t.x] = blocking[t.x] || {};
                blocking[t.x][t.y] = true;
            }
        });

        return this;
    }

    window.addEventListener('keydown', rl.keydown);

    return rl;
}());
