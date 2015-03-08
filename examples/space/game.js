var generator = (function () {
    var exports = {},

    TileElevator = function () {
        return rl.TileImgNoBlock('floors', 32, 24, 8, 8);
    },
    TileSquare = function () {
        return rl.TileImg('floors', 32, 8, 8, 8);
    },
    TileGroundBlue = function () {
        return rl.TileImgNoBlock('floors', 0, 48, 8, 8);
    },

    generateShipUpperRoomUp = function (tiles, options, x, y) {

    },
    generateShipUpperRoomDown = function (tiles, options, x, y) {

    },
    generateShipUpperHallway = function (tiles, options, x, y) {
        tiles.push({x: x, y: y, t: TileSquare()});
    },
    generateShipUpperQuad = function (tiles, options, x, y) {
        var i;

        for (i = -options.room_width * 2;
             i < options.room_width * 2;
             i += 1) {
            tiles.push({x: i, y: 0, t: TileGroundBlue()});
        };

        generateShipUpperHallway(tiles, options, -(options.room_width + 1), y);
        generateShipUpperHallway(tiles, options, options.room_width + 1, y);
    };

    exports.generateShipUpper = function () {
        var tiles = [], options = {}, i;

        options.room_width = 5;
        options.room_height = Math.floor((Math.random() * 5) + 5);
        options.room_hall_count = Math.floor((Math.random() * 3) + 2);

        for (i = -options.room_height * 2;
             i < options.room_height * 2;
             i += 1) {
            tiles.push({x: 0, y: i, t: TileGroundBlue()});
        }

        generateShipUpperQuad(tiles, options, 0, -(options.room_height + 1));
        generateShipUpperQuad(tiles, options, 0, options.room_height + 1);

        return tiles;
    };

    return exports;
}());

var game = (function () {
    var canvas, state, render_cb = [],
        stars = [], star_timer,
        player, width = 40, height = 40,
        map = {}, tiles = {},

    options = {
        font: '14pt monospace',
        tileWidth: 16,
        tileHeight: 16,
        width: width,
        height: height,
    };


    render_cb.removeCb = function(cb) {
        for (var i = this.length; i >= 0; i -= 1) {
            if (this[i] === cb) {
                this.splice(i, 1);
            }
        }

        return this;
    };

    var resetPlayer = function () {
        player = {
            x: 0, y: 0, c: '@', style: '#ffffff',
        };
    },

    loadImagePlanet = function () {
        rl.addTile(24, 24, rl.TileImgFull('planet', 0, 0, 36, 36, 4));
        render();
    },
    loadImageFloors = function () {

    },

    initStars = function () {
        var i;
        for (i = 0; i < 100; i += 1) {
            stars.push({
                x: Math.random() * rl.canvasWidth(),
                y: Math.random() * rl.canvasHeight(),
                s: 0.2 + 0.8 * Math.random(),
            });
        };
        star_timer = setInterval(updateStars, 100);
    },
    updateStars = function () {
        stars.forEach(function (star) {
            star.x += star.s;
            star.y += star.s;
            if (star.x >= rl.canvasWidth()) {
                star.x = 0;
                star.y = Math.random() * rl.canvasHeight();
            } else if (star.y >= rl.canvasHeight()) {
                star.x = Math.random() * rl.canvasWidth();
                star.y = 0;
            }
        });
        render();
    },
    renderStars = function () {
        stars.forEach(function (star) {
            var col = Math.round(255 * star.s);
            rl.style('rgb(' + col + ',' + col + ',' + col + ')')
                .fillRect(Math.round(star.x), Math.round(star.y), 5, 5);
        });
    },

    setup = function () {
        var i, j;

        state = 'map';
        resetPlayer();

        rl.setTiles(generator.generateShipUpper());
    },

    renderTitle = function () {
        rl.clear();
        renderStars();
        rl.render(0, 0)
            .style('#ffffff')
            .write('spaceRL', 1, 1)
            .style('#cccccc')
            .write('press a key to continue', 1, 2);
    },
    renderStory = function () {
        // todo: timer fade in story elements
    },
    renderInstructions = function () {
        rl.clear();
        renderStars();
        rl.style('#ffffff')
            .write('instructions', 27, 1)
            .style('#cccccc')
            .write('w: move up', 1, 2)
            .write('s: move down', 1, 3)
            .write('a: move left', 1, 4)
            .write('d: move right', 1, 5)
            .write('press a key to continue', 1, 7);
    },
    renderGame = function () {
        rl.updateTilesIndex()
            .clear()
        renderStars();
        rl.render(player.x - rl.cx(), player.y - rl.cy())
            .style(player.style)
            .write(player.c, rl.cx(), rl.cy());
    },
    render = function () {
        render_cb.forEach(
            function (cb) {
                cb();
            }
        );
    },

    keydownMap = function keydown(e) {
        var nx = player.x, ny = player.y;
        if (rl.getKey(e) === rl.key.d) {
            nx += 1;
        } else if (rl.getKey(e) === rl.key.a) {
            nx -= 1;
        } else if (rl.getKey(e) === rl.key.s) {
            ny += 1;
        } else if (rl.getKey(e) === rl.key.w) {
            ny -= 1;
        }
        if (rl.canMoveTo(nx, ny)) {
            player.x = nx;
            player.y = ny;
            render();
        }
    },
    keydownTitle = function keydown(e) {
        rl.setTiles([])
            .unregisterKeydown(keydown)
            .registerKeydown(keydownInstructions);
        render_cb.removeCb(renderTitle)
            .push(renderInstructions);
        setup();
        render();
    },
    keydownInstructions = function keydown(e) {
        rl.unregisterKeydown(keydown)
            .registerKeydown(keydownMap);
        render_cb.removeCb(renderInstructions)
            .push(renderGame);
        setup();
        render();
    };

    rl.create('game_canvas', options)
        .loadImage('oryx_planet.png', 'planet', loadImagePlanet)
        .loadImage('oryx_floors.png', 'floors', loadImageFloors)
        .registerKeydown(keydownTitle);

    initStars();
    state = 'title';
    render_cb.push(renderTitle);
    render();
}());
