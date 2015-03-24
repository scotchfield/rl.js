var game = (function () {
    var player, width = 30, height = 20;

    resetPlayer = function () {
        player = {
            x: 5, y: 1, c: '@', style: '#ffffff'
        };
    },

    setup = function () {
        resetPlayer();
        rl.addTile(3, 3, rl.TileImgNoBlock(
                {id: 'oryx', x: 0, y: 0, w: 8, h: 8}))
            .addTile(5, 3, rl.TileImgNoBlock(
                {id: 'oryx', x: 8, y: 0, w: 8, h: 8}))
            .addTile(7, 3, rl.TileImgNoBlock(
                {id: 'oryx', x: 16, y: 0, w: 8, h: 8}))
            .addTile(9, 3, rl.TileImgNoBlock(
                {id: 'oryx', x: 24, y: 0, w: 8, h: 8}))
            .addTile(11, 3, rl.TileImgNoBlock(
                {id: 'oryx', x: 32, y: 0, w: 8, h: 8}))
            .addTile(13, 3, rl.TileImgNoBlock(
                {id: 'oryx', x: 40, y: 0, w: 8, h: 8}))
            .addTile(4, 5, rl.TileImgNoBlock(
                {id: 'oryx', x: 0, y: 8, w: 8, h: 8}))
            .addTile(6, 5, rl.TileImgNoBlock(
                {id: 'oryx', x: 8, y: 8, w: 8, h: 8}))
            .addTile(8, 5, rl.TileImgNoBlock(
                {id: 'oryx', x: 16, y: 8, w: 8, h: 8}))
            .addTile(10, 5, rl.TileImgNoBlock(
                {id: 'oryx', x: 24, y: 8, w: 8, h: 8}))
            .addTile(12, 5, rl.TileImgNoBlock(
                {id: 'oryx', x: 32, y: 8, w: 8, h: 8}))
            .addTile(14, 5, rl.TileImgNoBlock(
                {id: 'oryx', x: 40, y: 8, w: 8, h: 8}));
    },

    render = function () {
        rl.clear()
            .render(player.x - rl.cx(), player.y - rl.cy())
            .style(player.style)
            .write(player.c, rl.cx(), rl.cy());
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
}());
