// rl.js: A JavaScript library to build browser-based roguelikes.

var rl = (function () {
    'use strict';

    var rl = {}, tiles = [],
        canvas = false, ctx = false,
        keydown_callbacks = [],
        tiles_index = {},
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
        foregroundColor: '#ffffff',
        font: '20pt monospace',
        fontFillStyle: '#ffffff',
        textAlign: 'center',
        imageSmoothingEnabled: false,
        baseAlpha: 0.3,
    };

    // Used by isKey to detect keypresses. isKey expects each of the
    // properties provided to match. For example, in the code below,
    // matching keyCode 65 will match 'a' and 'A'.
    rl.key = {
        space: {keyCode: 32},
        left: {keyCode: 37},
        up: {keyCode: 38},
        right: {keyCode: 39},
        down: {keyCode: 40},
        0: {keyCode: 48},
        1: {keyCode: 49},
        2: {keyCode: 50},
        3: {keyCode: 51},
        4: {keyCode: 52},
        5: {keyCode: 53},
        6: {keyCode: 54},
        7: {keyCode: 55},
        8: {keyCode: 56},
        9: {keyCode: 57},
        a: {keyCode: 65},
        b: {keyCode: 66},
        c: {keyCode: 67},
        d: {keyCode: 68},
        e: {keyCode: 69},
        f: {keyCode: 70},
        g: {keyCode: 71},
        h: {keyCode: 72},
        i: {keyCode: 73},
        j: {keyCode: 74},
        k: {keyCode: 75},
        l: {keyCode: 76},
        m: {keyCode: 77},
        n: {keyCode: 78},
        o: {keyCode: 79},
        p: {keyCode: 80},
        q: {keyCode: 81},
        r: {keyCode: 82},
        s: {keyCode: 83},
        t: {keyCode: 84},
        u: {keyCode: 85},
        v: {keyCode: 86},
        w: {keyCode: 87},
        x: {keyCode: 88},
        y: {keyCode: 89},
        z: {keyCode: 90},
        less_than: {keyCode: 188, shiftKey: true},
        greater_than: {keyCode: 190, shiftKey: true},
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
    rl.TileImg = function (t) {
        var that = rl.TileBlocking();

        that.image_id = t.id;
        that.image_x = t.x;
        that.image_y = t.y;
        that.image_w = t.w;
        that.image_h = t.h;

        that.render = function (x, y) {
            if (images[that.image_id] !== undefined) {
                ctx.drawImage(images[that.image_id],
                              that.image_x, that.image_y,
                              that.image_w, that.image_h,
                              x * options.tileWidth, y * options.tileHeight,
                              options.tileWidth, options.tileHeight);
            }
        };

        return that;
    };

    rl.TileImgFull = function (t) {
        var that = rl.TileBlocking();

        that.image_id = t.id;
        that.image_x = t.x;
        that.image_y = t.y;
        that.image_w = t.w;
        that.image_h = t.h;
        that.scale = t.scale || 1;

        that.render = function (x, y) {
            if (images[that.image_id] !== undefined) {
                ctx.drawImage(images[that.image_id],
                              that.image_x, that.image_y,
                              that.image_w, that.image_h,
                              x * options.tileWidth, y * options.tileHeight,
                              that.image_w * that.scale,
                              that.image_h * that.scale);
            }
        };

        return that;
    };

    // Just like TileImg, but toggle the blocking parameter so that
    // characters can walk over the square (for example, a dirt or grass tile).
    rl.TileImgNoBlock = function (t, options) {
        var that = rl.TileImg(t), key;

        options = options || {};

        that.blocking = false;

        for (key in options) {
            if (options.hasOwnProperty(key)) {
                that[key] = options[key];
            }
        }

        return that;
    };

    // An invisible tile to hold the player's entry point in a map.
    // Note: this is not the only way to handle player entry, but it
    // shows one way to hide information in the tiles.
    rl.TilePlayerSpawn = function () {
        if (!(this instanceof rl.TilePlayerSpawn)) {
            return new rl.TilePlayerSpawn();
        }
    };
    rl.TilePlayerSpawn.prototype.render = function (x, y) {}

    // Keypresses are caught by rl.js and forwarded to callbacks. Register
    // a callback in the game code, and each time a key is pressed, your
    // function(s) will be called with the appropriate event.
    rl.registerKeydown = function (cb) {
        keydown_callbacks.push(cb);

        return this;
    };

    // Remove a callback from the keypress array.
    rl.unregisterKeydown = function (cb) {
        for (var i = keydown_callbacks.length; i >= 0; i -= 1) {
            if (keydown_callbacks[i] === cb) {
                keydown_callbacks.splice(i, 1);
            }
        }

        return this;
    };

    // The actual callback used by rl.js to catch keypresses. Each time an
    // event occurs, iterate through the list of user-specified callbacks,
    // and pass the event.
    rl.keydown = function (e) {
        keydown_callbacks.forEach(
            function(current) {
                current(e);
            }
        );

        return this;
    };

    // Clear the canvas using the style specified in options.
    rl.clear = function () {
        rl.style(options.backgroundColor);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        rl.style(options.foregroundColor);

        return this;
    };

    // Set the active style when drawing to the canvas. This might be a
    // hex colour code, rgb/rgba value, or other style information.
    rl.style = function (c) {
        ctx.fillStyle = c;

        return this;
    };

    // Draw a string to the canvas at the specified (x, y) tile positions.
    // For example, rl.style('#ffffff').write('Hello', 0, 0) will write the
    // 'Hello' string in white letters in the top-left corner.
    rl.write = function (s, x, y) {
        if (typeof s !== 'string') {
            s = s.toString();
        }
        for (var i = 0; i < s.length; i += 1) {
            ctx.fillText(s[i],
                (x + i + 1) * options.tileWidth - 9,
                (y + 1) * options.tileWidth - 1);
        }

        return this;
    };

    // Draw a single square at the screen tile position indicated by (x, y).
    // Uses the last specified style().
    rl.square = function (x, y) {
        ctx.fillRect(x * options.tileWidth, y * options.tileHeight,
                     options.tileWidth, options.tileHeight);

        return this;
    };

    // rl.js retains a list of tiles that it will render when asked.
    // These are also used to calculate blocking, visibility, and other
    // qualities.

    // Add a tile object at global position (x, y) to the internal tiles array.
    // If no tile is specified, use a TileBlocking object by default.

    // One important distinction is that tiles are specified by a world
    // (x, y) position when instantiated. For example, a blocking wall
    // may be created as rl.addTile(0, 0). This doesn't mean that the wall
    // is always rendered at (0, 0). Drawing tiles later may map this to
    // a relative position (if the player is at (1, 1) and is centered on
    // the canvas, the wall will also appear near the center).
    rl.addTile = function (x, y, t) {
        var tile = (t === undefined) ? this.TileBlocking() : t;
        tiles.push({x: x, y: y, t: tile});

        return this;
    };

    // Check to see if the square at (x, y) contains a blocking tile.
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
    };

    // Append the default list of options with any user-specified options.
    // Next, create a new canvas object and clear it. This is an internal
    // function called by create.
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

        ctx.imageSmoothingEnabled = options.imageSmoothingEnabled;

        return canvas;
    };

    // Creates a new canvas object and appends it to the DOM element specified
    // by the id argument.
    // This is the only rl.js function that must be in your game code!
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
                if (options.alwaysShowTiles === true || t.visible !== false) {
                    t.t.render(t.x - x, t.y - y);
                } else if (t.observed === true) {
                    ctx.globalAlpha = options.baseAlpha;
                    t.t.render(t.x - x, t.y - y);
                    ctx.globalAlpha = 1;
                }
            }
        });

        return this;
    };

    // Return the tile x-index at the center of the screen.
    rl.cx = function () {
        return Math.floor(options.width / 2);
    };

    // Return the tile y-index at the center of the screen.
    rl.cy = function () {
        return Math.floor(options.height / 2);
    };

    // Load an image from an external source (a .png file containing tiles,
    // for example) and cache it inside rl.js. Must specify an id to access
    // it later, and an optional callback when the file is loaded.
    // This is an asynchronous call, so please note that the image is not
    // available immediately!
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

    // Populate the blocking property for quick lookup.
    rl.updateBlocking = function () {
        blocking = {};

        tiles.forEach(function (t) {
            if (t.t.blocking === true) {
                blocking[t.x] = blocking[t.x] || {};
                blocking[t.x][t.y] = true;
            }
        });

        return this;
    };

    // Populate tiles_index, allowing for quick lookup of tiles at a
    // particular (x, y) location.
    rl.updateTilesIndex = function () {
        tiles_index = {};

        tiles.forEach(function (t) {
            tiles_index[t.x] = tiles_index[t.x] || {}
            tiles_index[t.x][t.y] = tiles_index[t.x][t.y] || [];
            tiles_index[t.x][t.y].push(t.t);
        });

        return this;
    };

    // Attempt to draw a line from one source tile to the other. If a line
    // can be drawn, the path between the two tiles is clear of obstruction.
    // Modified from rosettacode.org/wiki/Bitmap/Bresenham%27s_line_algorithm
    rl.blockedLine = function (x0, y0, x1, y1) {
        var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1,
            dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1,
            err = (dx > dy ? dx : -dy) / 2,
            err2;

        while (true) {
            if (x0 === x1 && y0 === y1) {
                break;
            }
            if (blocking[x0] && blocking[x0][y0] === true) {
                return true;
            }
            err2 = err;
            if (err2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (err2 < dy) {
                err += dx;
                y0 += sy;
            }

        }

        return false;
    };

    // Iterate through all of the tiles to determine which ones are currently
    // visible from the given (x, y) position.
    rl.updateVisible = function (x, y, dist) {
        tiles.forEach(function (t) {
            t.visible = false;
            if (!rl.blockedLine(x, y, t.x, t.y)) {
                if (dist !== undefined) {
                    var d = Math.sqrt(Math.pow(x - t.x, 2) +
                                      Math.pow(y - t.y, 2));
                    if (d > dist) {
                        return;
                    }
                }
                t.visible = true;
                t.observed = true;
            }
        });

        return this;
    };

    // Compares a keypress event with an object of expected properties. If
    // the event contains all of the properties specified in key, return
    // true, otherwise false/
    rl.isKey = function (e, key) {
        var k;

        for (k in key) {
            if (key.hasOwnProperty(k) && e[k] !== key[k]) {
                return false;
            }
        }

        return true;
    };

    // Set the current tiles array to new_tiles. Used, for example, when
    // changing from one level to another.
    rl.setTiles = function (new_tiles) {
        tiles = new_tiles;

        rl.updateBlocking()
            .updateTilesIndex();

        return this;
    };

    // Apply the given function to each of the tiles.
    rl.applyTiles = function (f) {
        tiles.forEach(f);

        return this;
    };

    // Call fillRect directly on the 2d canvas context.
    rl.fillRect = function (x, y, width, height) {
        ctx.fillRect(x, y, width, height);

        return this;
    };

    // Set the 2d context's globalAlpha property (drawing opacity).
    rl.globalAlpha = function (x) {
        x = x || 1;

        ctx.globalAlpha = x;

        return this;
    };

    // Return the width of the canvas, in pixels.
    rl.canvasWidth = function () {
        return options.width * options.tileWidth;
    };

    // Return the height of the canvas, in pixels.
    rl.canvasHeight = function () {
        return options.height * options.tileHeight;
    };

    // Return an array containing all of the tiles at a given (x, y) position.
    // Can optionally accept a tile array instead of using the tiles object.
    rl.tilesAt = function (x, y, tile_array) {
        var tile_return = [];

        tile_array = tile_array || tiles;

        tile_array.forEach(function (tile) {
            if (tile.x === x && tile.y === y) {
                tile_return.push(tile);
            }
        });

        return tile_return;
    };

    // Remove all of the tiles at a given (x, y) position.
    // Can optionally accept a tile array instead of using the tiles object.
    rl.removeTilesAt = function (x, y, tile_array) {
        var i;

        tile_array = tile_array || tiles;

        for (i = tile_array.length - 1; i >= 0; i -= 1) {
            if (tile_array[i].x === x && tile_array[i].y === y) {
                tile_array.splice(i, 1);
            }
        }

        return this;
    };

    // Iterate through the tiles array (or, optionally, a provided tile
    // array), and retain only the last tile at each (x, y) position that
    // does not have the blocking property set to false. For example, if
    // there are two walls at a particular position, keep only the "top"
    // one--the one that occurs later in the array.
    rl.keepTopBlockingTiles = function (tile_array) {
        var i, found = {}, key;

        tile_array = tile_array || tiles;

        for (i = tile_array.length - 1; i >= 0; i -= 1) {
            if (tile_array[i].blocking !== false) {
                key = tile_array[i].x + ',' + tile_array[i].y;
                if (found[key] !== undefined) {
                    tile_array.splice(i, 1);
                }
                found[key] = true;
            }
        }

        return this;
    };

    window.addEventListener('keydown', rl.keydown);

    return rl;
}());
