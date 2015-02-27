var generator = (function () {
    var exports = {},

    TileAsylumCorridorEnd = {},
    TileAsylumStaircase = {},

    buildPartitionRooms = function (map, depth, x_split, xa, ya, xb, yb,
                                    door_right, vars) {
        door_right = door_right || false;
        vars = vars || {};
        vars.rooms = vars.rooms || 0;
        vars.pages = vars.pages || 0;

        if (depth > 0) {
            if (x_split) {

            } else {

            }
        } else {

        }
    };

    exports.generateAsylumMap = function (width, height) {
        var map = [], corridors = [];
        buildPartitionRooms(map, 4, true, 0, 0, width, height);
        map.forEach(function(x) {
            if (TileAsylumCorridorEnd === x.token_enum) {
                corridors.push(x);
            }
        });
        corridors.forEach(function(obj) {
            map.splice(map.indexOf(obj), 1);
            if (obj.token === DirectionSouth) {
                map.push({x: obj.x - 1, y: obj.y + 1,
                          t: rl.TileWall('rgb(255,0,0)')});
                map.push({x: obj.x, y: obj.y + 1,
                          t: rl.TileWall('rgb(255,0,0)')});
                map.push({x: obj.x + 1, y: obj.y + 1,
                          t: rl.TileWall('rgb(255,0,0)')});
                map.push({x: obj.x, y: obj.y,
                          t: TileAsylumStaircase('rgb(120,120,120)')});
            } else {
                map.push({x: obj.x, y: obj.y,
                          t: rl.TileWall('rgb(255,0,0)')});
            }
        });
        return map;
    };

    return exports;
}());

var game = (function () {
    var canvas, state, renderCb = [], timer,
        player, width = 60, height = 35,
        map = {};

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
            x: 5, y: 1, c: '@', style: '#ffffff', map: 'asylum',
        };
    },

    setup = function () {
        state = 'map';
        resetPlayer();
        rl.addTile(3, 3, rl.TileWall('rgb(255,0,0)'))
            .addTile(3, 5, rl.TileWall('rgb(0,255,0)'))
            .addTile(3, 7, rl.TileWall('rgb(0,0,255)'));
    },

    renderTitle = function () {
        var opacity = 0.8 + 0.2 * Math.cos((Date.now() % 6290) / 1000);
        rl.clear()
            .style('rgba(0,95,191,' + opacity + ')')
                .write('w', 2, 1)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': move north', 3, 1)
            .style('rgba(0,95,191,' + opacity + ')')
                .write('a', 2, 2)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': move west', 3, 2)
            .style('rgba(0,95,191,' + opacity + ')')
                .write('s', 2, 3)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': move south', 3, 3)
            .style('rgba(0,95,191,' + opacity + ')')
                .write('w', 2, 4)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': move east', 3, 4)
            .style('rgba(0,95,191,' + opacity + ')')
                .write('e', 2, 5)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': interact', 3, 5)
            .style('rgba(0,95,191,' + opacity + ')')
                .write('r', 2, 6)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': use', 3, 6)
            .style('rgba(0,95,191,' + opacity + ')')
                .write('0..9', 2, 8)
            .style('rgba(250,250,250,' + opacity + ')')
                .write(': read journal page', 6, 8)
            .style('rgba(200,200,200,' + opacity + ')')
                .write('asylumRL', width - 10, 1)
                .write('7drl 2012 js remake', width - 21, 2)
                .write('scotchfield', width - 13, 3)
            .style('rgba(128,128,250,' + opacity + ')')
                .write('put your headphones on and turn up the volume',
                       width - 47, height - 2);
    },
    renderGame = function () {
        rl.clear()
            .render(player.x - rl.cx(), player.y - rl.cy())
            .style(player.style)
            .write(player.c, rl.cx(), rl.cy());//player.x, player.y);
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
        if (e.keyCode === 68) {
            nx += 1;
        } else if (e.keyCode === 65) {
            nx -= 1;
        } else if (e.keyCode === 83) {
            ny += 1;
        } else if (e.keyCode === 87) {
            ny -= 1;
        }
        if (rl.canMoveTo(nx, ny)) {
            player.x = nx;
            player.y = ny;
        }
        render();
    },
    keydownTitle = function keydown(e) {
        rl.unregisterKeydown(keydown)
            .registerKeydown(keydownMap);
        clearInterval(timer);
        renderCb.removeCb(renderTitle)
            .push(renderGame);
        setup();
        render();
    },

    generateMaps = function () {
        // todo: store as map['asylum']['tiles']
        map['asylum'] = generator.generateAsylumMap(20, 50);
    };

    var options = {
        font: '12pt monospace',
        tileWidth: 16,
        tileHeight: 16,
        width: width,
        height: height,
    };

    rl.create('game_canvas', options)
        .registerKeydown(keydownTitle);

    generateMaps();
    state = 'title';
    timer = setInterval(renderTitle, 100);
    //renderCb.push(renderTitle);
    render();
}());
