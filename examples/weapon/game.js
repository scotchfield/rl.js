var generator = (function () {
    'use strict';

    var exports = {}, trees = [],

    registerTrees = function (trees) {
        var i, j;
        for (i = 0; i < 9; i += 1) {
            for (j = 0; j < 7; j += 1) {
                trees.push(rl.TileImgNoBlock({id: 'packb',
                                x: i * 8, y: j + 8, w: 8, h: 8}));
            }
        }
    };

    registerTrees(trees);

    exports.generateWorld = function (tiles, options) {
        var i, j, m = 100;

        for (i = -m; i <= m; i += 1) {
            for (j = -m; j <= m; j += 1) {
                tiles.push({x: i, y: j,
                            t: trees[Math.floor(Math.random()*trees.length)]});
            }
        }
    };

    return exports;
})();

var game = (function () {
    'use strict';

    var canvas, state, render_cb = [],
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
    },

    resetPlayer = function () {
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
            power: 50000,
            game_over: false,
        };
    },

    setup = function () {
        var tiles = [];

        resetPlayer();
        generator.generateWorld(tiles, {});

        rl.setTiles(tiles);
    };

    render_cb.removeCb = function(cb) {
        for (var i = this.length; i >= 0; i -= 1) {
            if (this[i] === cb) {
                this.splice(i, 1);
            }
        }

        return this;
    };

    var updateGame = function () {
        rl.updateTilesIndex()
            .updateBlocking()
            .updateVisible(player.x, player.y, 10);
    },

    renderHUD = function () {
    },

    renderTitle = function () {
        rl.clear();
        rl.render(0, 0)
            .style('#ffffff')
            .write('An Unconventional Weapon', 1, 1)
            .style('#cccccc')
            .write('press a key to continue', 1, 3);
    },
    renderStory = function () {
        rl.clear();
        rl.style('#ffffff')
            .write('It all happened so fast..', 1, 1);
    },
    renderInstructions = function () {
        rl.clear();
        rl.style('#ffffff')
            .write('instructions', 27, 1)
            .style('#9999ff')
            .write('w', 1, 2)
            .write('s', 1, 3)
            .write('a', 1, 4)
            .write('d', 1, 5)
            .write('e', 1, 6)
            .write('>', 1, 7)
            .write('<', 1, 8)
            .write('h', 1, 10)
            .style('#ffffff')
            .write(': move up', 2, 2)
            .write(': move down', 2, 3)
            .write(': move left', 2, 4)
            .write(': move right', 2, 5)
            .write(': interact/pick up', 2, 6)
            .write(': descend elevator', 2, 7)
            .write(': ascend elevator', 2, 8)
            .write(': help', 2, 10)
            .write('press a key to continue', 1, 12);
    },
    renderGame = function () {
        rl.clear();
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

        if (player.game_over === true) {
            if (rl.isKey(e, rl.key.space)) {
                rl.unregisterKeydown(keydown)
                    .registerKeydown(keydownEnd);
                render_cb.removeCb(renderGame)
                    .push(renderEnd);
            }
            return;
        }

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
                found = processTile(tile);
            });

            if (!found) {
                rl.tilesAt(player.x, player.y).forEach(function (tile) {
                    found = processTile(tile);
                });
                if (!found) {
                    player.console.push('Nothing here.');
                }
            }
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
            .registerKeydown(keydownStory);
        render_cb.removeCb(renderTitle)
            .push(renderStory);
        setup();
        render();
    },
    keydownStory = function keydown(e) {
        rl.unregisterKeydown(keydown)
            .registerKeydown(keydownInstructions);
        render_cb.removeCb(renderStory)
            .push(renderInstructions);
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
        .loadImage('oryx_player.png', 'player')
        .loadImage('oryx_packb.png', 'packb')
        .registerKeydown(keydownTitle);

    state = 'title';
    render_cb.push(renderTitle);
    render();
})();
