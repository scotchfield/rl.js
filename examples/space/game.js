var generator = (function () {
    'use strict';

    var exports = {},

    TileToggleLit = function (lit, t_lit, t_unlit) {
        var that = rl.TileImg(t_lit);

        that.lit = lit;
        that.setLit = function (lit) {
            var t;

            that.lit = lit;
            if (that.lit === true) {
                t = t_lit;
            } else {
                t = t_unlit;
            }

            that.image_id = t.id;
            that.image_x = t.x;
            that.image_y = t.y;
            that.image_width = t.w;
            that.image_height = t.h;
        };
        that.setLit(that.lit);

        return that;
    },

    TileToggleLitNoBlock = function (lit, t_lit, t_unlit) {
        var that = rl.TileImgNoBlock(t_lit);

        that.lit = lit;
        that.setLit = function (lit) {
            var t;

            that.lit = lit;
            if (that.lit === true) {
                t = t_lit;
            } else {
                t = t_unlit;
            }

            that.image_id = t.id;
            that.image_x = t.x;
            that.image_y = t.y;
            that.image_width = t.w;
            that.image_height = t.h;
        };
        that.setLit(that.lit);

        return that;
    },

    TileDoor = function (lit) {
        return TileToggleLitNoBlock(lit,
                                    {id: 'floors', x: 16, y: 0, w: 8, h: 8},
                                    {id: 'floors', x: 56, y: 0, w: 8, h: 8});
    },
    TileSquare = function () {
        return rl.TileImg({id: 'floors', x: 32, y: 8, w: 8, h: 8});
    },
    TileGroundBlue = function (lit) {
        return TileToggleLitNoBlock(lit,
                                    {id: 'floors', x: 16, y: 40, w: 8, h: 8},
                                    {id: 'floors', x: 0, y: 48, w: 8, h: 8});
    },
    TileWallTopLeft = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 0, y: 0, w: 8, h: 8},
                             {id: 'floors', x: 40, y: 0, w: 8, h: 8});
    },
    TileWallTopRight = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 0, y: 8, w: 8, h: 8},
                             {id: 'floors', x: 40, y: 8, w: 8, h: 8});
    },
    TileWallBottomLeft = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 0, y: 24, w: 8, h: 8},
                             {id: 'floors', x: 40, y: 24, w: 8, h: 8});
    },
    TileWallBottomRight = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 0, y: 16, w: 8, h: 8},
                             {id: 'floors', x: 40, y: 16, w: 8, h: 8});
    },
    TileWallHorizontal = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 32, y: 0, w: 8, h: 8},
                             {id: 'floors', x: 72, y: 0, w: 8, h: 8});
    },
    TileWallVertical = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 32, y: 24, w: 8, h: 8},
                             {id: 'floors', x: 72, y: 24, w: 8, h: 8});
    },
    TileWallTopT = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 24, y: 0, w: 8, h: 8},
                             {id: 'floors', x: 64, y: 0, w: 8, h: 8});
    },
    TileWallBottomT = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 24, y: 16, w: 8, h: 8},
                             {id: 'floors', x: 64, y: 16, w: 8, h: 8});
    },
    TileWallLeftT = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 24, y: 24, w: 8, h: 8},
                             {id: 'floors', x: 64, y: 24, w: 8, h: 8});
    },
    TileWallRightT = function (lit) {
        return TileToggleLit(lit,
                             {id: 'floors', x: 24, y: 8, w: 8, h: 8},
                             {id: 'floors', x: 64, y: 8, w: 8, h: 8});
    },
    TileElevator = function (lit, up, down) {
        var t = TileToggleLitNoBlock(lit,
                              {id: 'floors', x: 72, y: 32, w: 8, h: 8},
                              {id: 'floors', x: 72, y: 40, w: 8, h: 8});
        t.up = up;
        t.down = down;
        t.onEnter = function (options) {
            var st = 'This elevator can go ', d = [];
            if (t.up !== null) {
                d.push('up');
            }
            if (t.down !== null) {
                d.push('down');
            }
            options.player.console.push(st + d.join(' and ') + '.');
        };
        return t;
    },
    TileWallLightTop = function (lit) {
        var t = TileToggleLit(lit,
                              {id: 'floors', x: 8, y: 0, w: 8, h: 8},
                              {id: 'floors', x: 48, y: 0, w: 8, h: 8});
        t.light_toggle = true;
        return t;
    },
    TileWallLightBottom = function (lit) {
        var t = TileToggleLit(lit,
                              {id: 'floors', x: 8, y: 16, w: 8, h: 8},
                              {id: 'floors', x: 48, y: 16, w: 8, h: 8});
        t.light_toggle = true;
        return t;
    },
    TileWallLightLeft = function (lit) {
        var t = TileToggleLit(lit,
                              {id: 'floors', x: 8, y: 24, w: 8, h: 8},
                              {id: 'floors', x: 48, y: 24, w: 8, h: 8});
        t.light_toggle = true;
        return t;
    },
    TileWallLightRight = function (lit) {
        var t = TileToggleLit(lit,
                              {id: 'floors', x: 8, y: 8, w: 8, h: 8},
                              {id: 'floors', x: 48, y: 8, w: 8, h: 8});
        t.light_toggle = true;
        return t;
    },


    replaceTileWith = function (x, y, tiles, t) {
        rl.removeTilesAt(x, y, tiles);
        tiles.push({x: x, y: y, t: t});
    },

    generateShipUpperHallway = function (tiles, options, x, y, lit) {
        var i, j, x_offset = Math.floor(options.room_width * 0.5);

        replaceTileWith(x - x_offset, y - 1, tiles, TileDoor());
        replaceTileWith(x + x_offset, y - 1, tiles, TileDoor());
        replaceTileWith(x - x_offset, y + 1, tiles, TileDoor());
        replaceTileWith(x + x_offset, y + 1, tiles, TileDoor());

        for (i = -options.room_width + 1; i < options.room_width; i += 1) {
            tiles.push({x: x + i, y: y + 1 - options.room_height,
                        t: TileWallHorizontal()});
            tiles.push({x: x + i, y: y - 1 + options.room_height,
                        t: TileWallHorizontal()});
            if (Math.random() > 0.5) {
                tiles.push({x: x + i, y: y + 1 - options.room_height,
                            t: TileWallLightTop(lit)});
            }
            if (Math.random() > 0.5) {
                tiles.push({x: x + i, y: y - 1 + options.room_height,
                            t: TileWallLightBottom(lit)});
            }
            for (j = y + 2 - options.room_height; j < y - 1; j += 1) {
                tiles.push({x: x + i, y: j, t: TileGroundBlue()});
            }
            for (j = y - 2 + options.room_height; j > y + 1; j -= 1) {
                tiles.push({x: x + i, y: j, t: TileGroundBlue()});
            }
        }

        for (i = y + 1 - options.room_height; i < y; i += 1) {
            if (i === y + 1 - options.room_height) {
                tiles.push({x: x, y: i, t: TileWallTopT()});
            } else if (i === y - 1) {
                tiles.push({x: x, y: i, t: TileWallBottomT()});
            } else {
                tiles.push({x: x, y: i, t: TileWallVertical()});
            }
        }
        for (i = y - 1 + options.room_height; i > y; i -= 1) {
            if (i === y - 1 + options.room_height) {
                tiles.push({x: x, y: i,t: TileWallBottomT()});
            } else if (i === y + 1) {
                tiles.push({x: x, y: i,t: TileWallTopT()});
            } else {
                tiles.push({x: x, y: i, t: TileWallVertical()});
            }
        }

        for (i = 0; i < 4; i += 1) {
            
        }
    },
    generateShipUpperQuad = function (tiles, options, x, y, lit) {
        var i,
            i_min = -options.room_width * 2,
            i_max = options.room_width * 2;

        for (i = i_min; i <= i_max; i += 1) {
            rl.removeTilesAt(i, y - 1, tiles);
            rl.removeTilesAt(i, y, tiles);
            rl.removeTilesAt(i, y + 1, tiles);

            if (i === -1) {
                tiles.push({x: i, y: y - 1, t: TileWallBottomRight()});
                tiles.push({x: i, y: y, t: TileGroundBlue()});
                tiles.push({x: i, y: y + 1, t: TileWallTopRight()});
            } else if (i === 0) {
                tiles.push({x: i, y: y - 1, t: TileGroundBlue()});
                tiles.push({x: i, y: y, t: TileGroundBlue()});
                tiles.push({x: i, y: y + 1, t: TileGroundBlue()});
            } else if (i === 1) {
                tiles.push({x: i, y: y - 1, t: TileWallBottomLeft()});
                tiles.push({x: i, y: y, t: TileGroundBlue()});
                tiles.push({x: i, y: y + 1, t: TileWallTopLeft()});
            } else if (i === i_min) {
                tiles.push({x: i, y: y - 1, t: TileWallLeftT()});
                tiles.push({x: i, y: y, t: TileWallVertical()});
                tiles.push({x: i, y: y + 1, t: TileWallLeftT()});
            } else if (i === i_max) {
                tiles.push({x: i, y: y - 1, t: TileWallRightT()});
                tiles.push({x: i, y: y, t: TileWallVertical()});
                tiles.push({x: i, y: y + 1, t: TileWallRightT()});
            } else {
                tiles.push({x: i, y: y - 1, t: TileWallHorizontal()});
                tiles.push({x: i, y: y, t: TileGroundBlue()});
                tiles.push({x: i, y: y + 1, t: TileWallHorizontal()});
            }
        };

        generateShipUpperHallway(tiles, options,
                                 -(options.room_width + 1), y, lit);
        generateShipUpperHallway(tiles, options,
                                 options.room_width + 1, y, lit);
    };

    exports.generateShipUpper = function (lit, options) {
        var tiles = [], i, i_min, i_max, x_dist, tile_obj,
            options = options || {}, light_sources = 0;

        if (options.room_width === undefined) {
            options.room_width = 5;
        }
        if (options.room_height === undefined) {
            options.room_height = Math.floor((Math.random() * 5) + 5);
        }

        i_min = -options.room_height * 2;
        i_max = options.room_height * 2;

        for (i = i_min; i <= i_max; i += 1) {
            if (i === i_min) {
                tiles.push({x: -1, y: i, t: TileWallTopT()});
                tiles.push({x: 0, y: i, t: TileWallHorizontal()});
                tiles.push({x: 1, y: i, t: TileWallTopT()});
            } else if (i === i_max) {
                tiles.push({x: -1, y: i, t: TileWallBottomT()});
                tiles.push({x: 0, y: i, t: TileWallHorizontal()});
                tiles.push({x: 1, y: i, t: TileWallBottomT()});
            } else {
                tiles.push({x: -1, y: i, t: TileWallVertical()});
                tiles.push({x: 0, y: i, t: TileGroundBlue()});
                tiles.push({x: 1, y: i, t: TileWallVertical()});
            }
        }

        generateShipUpperQuad(tiles, options,
                              0, -(options.room_height + 1), lit);
        generateShipUpperQuad(tiles, options,
                              0, options.room_height + 1, lit);

        x_dist = options.room_width * 2;

        for (i = i_min; i <= i_max; i += 1) {
            if (i === i_min) {
                replaceTileWith(-x_dist, i, tiles, TileWallTopLeft());
                replaceTileWith(x_dist, i, tiles, TileWallTopRight());
            } else if (i === i_max) {
                replaceTileWith(-x_dist, i, tiles, TileWallBottomLeft());
                replaceTileWith(x_dist, i, tiles, TileWallBottomRight());
            } else {
                tile_obj = rl.tilesAt(-options.room_width * 2, i, tiles);
                if (tile_obj.length > 0 && tile_obj[0].t.blocking !== true) {
                    replaceTileWith(-x_dist, i, tiles, TileWallVertical());
                    replaceTileWith(x_dist, i, tiles, TileWallVertical());
                }
            }
        }

        tiles.push({x: 0, y: options.room_height * 2 - 1,
                    t: TileElevator(false, options.up, options.down)});

        rl.keepTopBlockingTiles(tiles);

        tiles.forEach(function (t) {
            if (t.t.light_toggle && t.t.lit) {
                light_sources += 1;
            }
        });

        return {tiles: tiles, options: options,
                x: 0, y: options.room_height * 2 - 1,
                light_sources: light_sources};
    };

    exports.generateShipOpenFloor = function (lit, options) {
        var tiles = [], i, j;

        options.room_radius = Math.floor((Math.random() * 20) + 10);

        for (i = -options.room_radius; i <= options.room_radius; i += 1) {
            for (j = -options.room_radius; j <= options.room_radius; j += 1) {
                if (j === -options.room_radius) {
                    if (i === -options.room_radius) {
                        tiles.push({x: i, y: j, t: TileWallTopLeft()});
                    } else if (i === options.room_radius) {
                        tiles.push({x: i, y: j, t: TileWallTopRight()});
                    } else {
                        tiles.push({x: i, y: j, t: TileWallHorizontal()});
                    }
                } else if (j === options.room_radius) {
                    if (i === -options.room_radius) {
                        tiles.push({x: i, y: j, t: TileWallBottomLeft()});
                    } else if (i === options.room_radius) {
                        tiles.push({x: i, y: j, t: TileWallBottomRight()});
                    } else {
                        tiles.push({x: i, y: j, t: TileWallHorizontal()});
                    }
                } else {
                    if (i === -options.room_radius ||
                            i === options.room_radius) {
                        tiles.push({x: i, y: j, t: TileWallVertical()});
                    } else {
                        tiles.push({x: i, y: j, t: TileGroundBlue()});
                    }
                }
            }
        }

        tiles.push({x: 0, y: 0,
                    t: TileElevator(false, options.up, options.down)});

        return {tiles: tiles, options: options, x: 0, y: 0};
    };

    return exports;
}());

var game = (function () {
    'use strict';

    var canvas, state, render_cb = [],
        stars = [], star_timer,
        player, width = 40, height = 40,
        map = {}, tiles = {},

    TilePlayerRight = function () {
        return rl.TileImg({id: 'player', x: 0, y: 0, w: 8, h: 8});
    },
    TilePlayerDown = function () {
        return rl.TileImg({id: 'player', x: 8, y: 0, w: 8, h: 8});
    },
    TilePlayerLeft = function () {
        return rl.TileImg({id: 'player', x: 16, y: 0, w: 8, h: 8});
    },
    TilePlayerUp = function () {
        return rl.TileImg({id: 'player', x: 24, y: 0, w: 8, h: 8});
    },
    TilePlayerDead = function () {
        return rl.TileImg({id: 'player', x: 32, y: 0, w: 8, h: 8});
    },

    options = {
        font: '14pt monospace',
        tileWidth: 16,
        tileHeight: 16,
        width: width,
        height: height,
        //alwaysShowTiles: true,
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
            x: 0, y: 0, d: 'down',
            c: '@', style: '#ffffff',
            turn: 0, shadow_turn: 0,
            up: TilePlayerUp(),
            down: TilePlayerDown(),
            left: TilePlayerLeft(),
            right: TilePlayerRight(),
            dead: TilePlayerDead(),
            render: function (x, y) {
                player[player.d].render(x, y);
            },
            console: [],
            light_sources: 0,
        };
    },

    padTwoDigits = function (x) {
        return ('0' + x.toString()).substr(-2);
    },
    toClock = function (t, full) {
        var s = [];

        full = undefined ? true : full;

        if (full !== false) {
            s.push(padTwoDigits(Math.floor(t / 3600)));
            t = t % 3600;
        }
        s.push(padTwoDigits(Math.floor(t / 60)));
        t = t % 60;
        s.push(padTwoDigits(t));

        return s.join(':');
    },

    loadImagePlanet = function () {
        rl.addTile(24, 24, rl.TileImgFull({id: 'planet', x: 0, y: 0,
                                           w: 36, h: 36, scale: 4}));
        render();
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
    updateLighting = function () {
        rl.applyTiles(function (t) {
            if (t.t.light_toggle !== true &&
                    typeof t.t.setLit === 'function') {
                t.t.setLit(false);
            }
        });
        rl.applyTiles(function (tile) {
            if (tile.t.light_toggle && tile.t.lit) {
                rl.applyTiles(function (t) {
                    if (!rl.blockedLine(t.x, t.y, tile.x, tile.y)) {
                        if (typeof t.t.setLit === 'function') {
                            t.t.setLit(true);
                        }
                    }
                });
            };
        });
    },
    updateGame = function () {
        rl.updateTilesIndex()
            .updateBlocking()
            .updateVisible(player.x, player.y, 10);
    },
    renderStars = function () {
        stars.forEach(function (star) {
            var col = Math.round(255 * star.s);
            rl.style('rgb(' + col + ',' + col + ',' + col + ')')
                .fillRect(Math.round(star.x), Math.round(star.y), 5, 5);
        });
    },
    renderHUD = function () {
        var i;

        rl.style('rgb(255,255,255)')
            .globalAlpha(0.25)
            .fillRect(0, 0, width * options.tileWidth, options.tileHeight + 2)
            .fillRect(0, (height - 4) * options.tileHeight,
                      width * options.tileWidth, options.tileHeight * 4)
            .globalAlpha();

        player.console = player.console.slice(-4);
        for (i = 0; i < player.console.length; i += 1) {
            rl.style('#ffffff')
                .write(player.console[i], 0, height - 4 + i);
        };

        rl.style('#ffffff')
            .write(toClock(player.turn), 1, 0)
            .style('#ff0000')
            .write(toClock(player.shadow_turn, false), 34, 0);

        rl.style('#888888')
            .write('h: help', 32, height - 5);
    },

    setup = function () {
        var i;

        map['ship01'] = generator.generateShipUpper(
            true, {up: null, down: 'ship02'});
        map['ship02'] = generator.generateShipUpper(
            false, {up: 'ship01', down: 'open01',
                    room_width: map['ship01'].options.room_width,
                    room_height: map['ship01'].options.room_height});
        map['open01'] = generator.generateShipOpenFloor(
            false, {up: 'ship02', down: 'open02'});
        map['open02'] = generator.generateShipOpenFloor(
            false, {up: 'open01', down: 'open03'});
        map['open03'] = generator.generateShipOpenFloor(
            false, {up: 'open02', down: 'open04'});
        map['open04'] = generator.generateShipOpenFloor(
            false, {up: 'open03', down: null});

        state = 'ship01';
        resetPlayer();

        for (i in map) {
            if (map[i].light_sources !== undefined) {
                player.light_sources += map[i].light_sources;
            }
        };

        player.x = -3;
        player.y = -map[state].options.room_height * 2 + 2;

        rl.setTiles(map[state].tiles);
        updateLighting();
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
            .write('e: interact/pick up', 1, 6)
            .write('>: descend elevator', 1, 7)
            .write('<: ascend elevator', 1, 8)
            .write('h: help', 1, 10)
            .write('press a key to continue', 1, 12);
    },
    renderGame = function () {
        rl.clear();
        renderStars();
        rl.render(player.x - rl.cx(), player.y - rl.cy());
        player.render(rl.cx(), rl.cy());
        renderHUD();
    },
    render = function () {
        render_cb.forEach(
            function (cb) {
                cb();
            }
        );
    },

    keydownMap = function keydown(e) {
        var nx = player.x, ny = player.y, lit;

        if (rl.isKey(e, rl.key.h)) {
            rl.unregisterKeydown(keydownMap)
                .registerKeydown(keydownInstructions);
            render_cb.removeCb(renderGame)
                .push(renderInstructions);
        } else if (rl.isKey(e, rl.key.d)) {
            nx += 1;
            player.d = 'right';
        } else if (rl.isKey(e, rl.key.a)) {
            nx -= 1;
            player.d = 'left';
        } else if (rl.isKey(e, rl.key.s)) {
            ny += 1;
            player.d = 'down';
        } else if (rl.isKey(e, rl.key.w)) {
            ny -= 1;
            player.d = 'up';
        } else if (rl.isKey(e, rl.key.e)) {
            var found = false, px = player.x, py = player.y;
            if (player.d === 'right') {
                px = player.x + 1;
            } else if (player.d === 'left') {
                px = player.x - 1;
            } else if (player.d === 'down') {
                py = player.y + 1;
            } else if (player.d === 'up') {
                py = player.y - 1;
                tiles = rl.tilesAt(player.x, player.y - 1);
            }

            rl.tilesAt(px, py).forEach(function (tile) {
                if (tile.t.light_toggle) {
                    tile.t.setLit(!tile.t.lit);
                    player.console.push('You hit the light switch.');
                    updateLighting();
                    found = true;
                }
            });
            if (!found) {
                player.console.push('Nothing here.');
            }
        } else if (rl.isKey(e, rl.key.less_than)) {
            rl.tilesAt(player.x, player.y).forEach(function (tile) {
                if (map[tile.t.up] !== undefined) {
                    state = tile.t.up;
                    rl.setTiles(map[state].tiles);
                    if (map[state].x !== undefined) {
                        player.x = map[state].x;
                        nx = player.x;
                    }
                    if (map[state].y !== undefined) {
                        player.y = map[state].y;
                        ny = player.y;
                    }
                    player.turn += 1;
                    player.console.push('You go up one level.');
                    updateGame();
                    render();
                }
            });
        } else if (rl.isKey(e, rl.key.greater_than)) {
            rl.tilesAt(player.x, player.y).forEach(function (tile) {
                if (map[tile.t.down] !== undefined) {
                    state = tile.t.down;
                    rl.setTiles(map[state].tiles);
                    if (map[state].x !== undefined) {
                        player.x = map[state].x;
                        nx = player.x;
                    }
                    if (map[state].y !== undefined) {
                        player.y = map[state].y;
                        ny = player.y;
                    }
                    player.turn += 1;
                    player.console.push('You descend one level.');
                    updateGame();
                    render();
                }
            });
        }
        if (rl.canMoveTo(nx, ny) && (nx !== player.x || ny !== player.y)) {
            player.x = nx;
            player.y = ny;
            player.turn += 1;

            lit = false;
            rl.tilesAt(nx, ny).forEach(function (tile) {
                if (tile.t.lit === true) {
                    lit = true;
                }
                if (tile.t.onEnter !== undefined) {
                    tile.t.onEnter({player: player});
                };
            });
            if (lit === true) {
                player.shadow_turn = Math.max(0, player.shadow_turn - 5);
            } else {
                player.shadow_turn += 1;
            }

            updateGame();
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
        updateGame();
        render();
    };

    rl.create('game_canvas', options)
        .loadImage('oryx_planet.png', 'planet', loadImagePlanet)
        .loadImage('oryx_floors.png', 'floors')
        .loadImage('oryx_player.png', 'player')
        .registerKeydown(keydownTitle);

    initStars();
    state = 'title';
    render_cb.push(renderTitle);
    render();
}());
