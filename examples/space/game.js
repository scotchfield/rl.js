var generator = (function () {
    var exports = {},

    TileElevator = function () {
        return rl.TileImgNoBlock('floors', 32, 24, 8, 8);
    },
    TileSquare = function () {
        return rl.TileImg('floors', 32, 8, 8, 8);
    };

    exports.generateShipUpper = function () {
        var tiles = [];

        tiles.push({x: 0, y: 1, t: TileElevator()});
        tiles.push({x: -1, y: 1, t: TileSquare()});
        tiles.push({x: 1, y: 1, t: TileSquare()});

        return tiles;
    };

    return exports;
}());

var game = (function () {
    var canvas, state, renderCb = [],
        player, width = 60, height = 40,
        map = {}, tiles = {};

    renderCb.removeCb = function(cb) {
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
        rl.addTile(40, 20, rl.TileImgFull('planet', 0, 0, 36, 36, 4));
        render();
    },
    loadImageFloors = function () {

    },

    setup = function () {
        var i, j;

        state = 'map';
        resetPlayer();

        rl.setTiles(generator.generateShipUpper());
        rl.addTile(3, 3);
    },

    renderTitle = function () {
        rl.clear()
            .render(0, 0)
            .style('#ffffff')
            .write('spaceRL', 1, 1)
            .style('#cccccc')
            .write('press a key to continue', 1, 2);
    },
    renderInstructions = function () {
        rl.clear()
            .style('#ffffff')
            .write('instructions', 1, 1)
            .style('#cccccc')
            .write('press a key to continue', 1, 2);
    },
    renderGame = function () {
        rl.updateTilesIndex()
            .clear()
            .render(player.x - rl.cx(), player.y - rl.cy())
            .style(player.style)
            .write(player.c, rl.cx(), rl.cy());
    },
    render = function () {
        renderCb.forEach(
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
        renderCb.removeCb(renderTitle)
            .push(renderInstructions);
        setup();
        render();
    },
    keydownInstructions = function keydown(e) {
        rl.unregisterKeydown(keydown)
            .registerKeydown(keydownMap);
        renderCb.removeCb(renderInstructions)
            .push(renderGame);
        setup();
        render();
    };


    var options = {
        font: '14pt monospace',
        tileWidth: 16,
        tileHeight: 16,
        width: width,
        height: height,
    };

    rl.create('game_canvas', options)
        .loadImage('oryx_planet.png', 'planet', loadImagePlanet)
        .loadImage('oryx_floors.png', 'floors', loadImageFloors)
        .registerKeydown(keydownTitle);

    state = 'title';
    renderCb.push(renderTitle);
    render();
}());
