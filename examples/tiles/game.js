var game = (function () {
    var canvas, state, timer,
        player, width = 60, height = 35,
        map = {};

    var resetPlayer = function () {
        player = {
            x: 5, y: 1, c: '@', style: '#ffffff'
        };
    },

    setup = function () {
        state = 'map';
        resetPlayer();
        rl.addTile(3, 3, rl.TileImgNoBlock('oryx', 0, 0, 8, 8))
            .addTile(5, 3, rl.TileImgNoBlock('oryx', 8, 0, 8, 8))
            .addTile(7, 3, rl.TileImgNoBlock('oryx', 16, 0, 8, 8))
            .addTile(9, 3, rl.TileImgNoBlock('oryx', 24, 0, 8, 8))
            .addTile(11, 3, rl.TileImgNoBlock('oryx', 32, 0, 8, 8))
            .addTile(13, 3, rl.TileImgNoBlock('oryx', 40, 0, 8, 8))
            .addTile(4, 5, rl.TileImgNoBlock('oryx', 0, 8, 8, 8))
            .addTile(6, 5, rl.TileImgNoBlock('oryx', 8, 8, 8, 8))
            .addTile(8, 5, rl.TileImgNoBlock('oryx', 16, 8, 8, 8))
            .addTile(10, 5, rl.TileImgNoBlock('oryx', 24, 8, 8, 8))
            .addTile(12, 5, rl.TileImgNoBlock('oryx', 32, 8, 8, 8))
            .addTile(14, 5, rl.TileImgNoBlock('oryx', 40, 8, 8, 8))

    },

    render = function () {
        rl.clear()
            .render(player.x - rl.cx(), player.y - rl.cy())
            .style(player.style)
            .write(player.c, rl.cx(), rl.cy());//player.x, player.y);
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
    };

    var options = {
        font: '12pt monospace',
        tileWidth: 16,
        tileHeight: 16,
        width: width,
        height: height,
    };

    rl.create('game_canvas', options)
        .registerKeydown(keydownMap)
        .loadImage('oryx_tiles.png', 'oryx', render);

    setup();
    render();
}());
