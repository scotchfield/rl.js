var generator = (function () {
    var exports = {},

    TileDoor = function () {
        return rl.TileImgNoBlock('floors', 16, 0, 8, 8);
    },
    TileSquare = function () {
        return rl.TileImg('floors', 32, 8, 8, 8);
    },
    TileGroundBlue = function () {
        return rl.TileImgNoBlock('floors', 0, 48, 8, 8);
    },
    TileWallTopLeft = function () {
        return rl.TileImg('floors', 0, 0, 8, 8);
    },
    TileWallTopRight = function () {
        return rl.TileImg('floors', 0, 8, 8, 8);
    },
    TileWallBottomLeft = function () {
        return rl.TileImg('floors', 0, 24, 8, 8);
    },
    TileWallBottomRight = function () {
        return rl.TileImg('floors', 0, 16, 8, 8);
    },
    TileWallHorizontal = function () {
        return rl.TileImg('floors', 32, 0, 8, 8);
    },
    TileWallVertical = function () {
        return rl.TileImg('floors', 32, 24, 8, 8);
    },
    TileWallTopT = function () {
        return rl.TileImg('floors', 24, 0, 8, 8);
    },
    TileWallBottomT = function () {
        return rl.TileImg('floors', 24, 16, 8, 8);
    },
    TileWallLeftT = function () {
        return rl.TileImg('floors', 24, 24, 8, 8);
    },
    TileWallRightT = function () {
        return rl.TileImg('floors', 24, 8, 8, 8);
    },

    replaceTileWith = function (x, y, tiles, t) {
        rl.removeTilesAt(x, y, tiles);
        tiles.push({x: x, y: y, t: t});
    }

    generateShipUpperHallway = function (tiles, options, x, y) {
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

    },
    generateShipUpperQuad = function (tiles, options, x, y) {
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

        generateShipUpperHallway(tiles, options, -(options.room_width + 1), y);
        generateShipUpperHallway(tiles, options, options.room_width + 1, y);
    };

    exports.generateShipUpper = function () {
        var tiles = [], options = {}, i, i_min, i_max, x_dist;

        options.room_width = 5;
        options.room_height = Math.floor((Math.random() * 5) + 5);

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

        generateShipUpperQuad(tiles, options, 0, -(options.room_height + 1));
        generateShipUpperQuad(tiles, options, 0, options.room_height + 1);

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
            x: 0, y: 0, c: '@', style: '#ffffff',
        };
    },

    loadImagePlanet = function () {
        rl.addTile(24, 24, rl.TileImgFull('planet', 0, 0, 36, 36, 4));
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
    updateGame = function () {
        rl.updateTilesIndex()
            .updateBlocking()
            .updateVisible(player.x, player.y);
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
        rl.clear();
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
