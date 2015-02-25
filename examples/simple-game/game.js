var game = (function () {
    var canvas, state, renderCb = [],
        player, width = 40, height = 25;

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

    setup = function () {
        state = 'map';
        resetPlayer();
    },

    renderTitle = function () {
        rl.clear()
            .style('#ffffff')
            .write('helo', 1, 1)
            .style('#cccccc')
            .write('press a key to continue', 1, 2);
    },
    renderGame = function () {
        rl.clear()
            .style(player.style)
            .write(player.c, player.x, player.y);
    },
    render = function () {
        renderCb.forEach(
            function (cb) {
                cb();
            }
        );
    },

    keydownMap = function keydown(e) {
        if (e.keyCode === 68) {
            player.x += 1;
        } else if (e.keyCode === 65) {
            player.x -= 1;
        } else if (e.keyCode === 83) {
            player.y += 1;
        } else if (e.keyCode === 87) {
            player.y -= 1;
        }
        player.x = player.x < 0 ? 0 : player.x;
        player.x = player.x >= width ? width - 1 : player.x;
        player.y = player.y < 0 ? 0 : player.y;
        player.y = player.y >= height ? height - 1 : player.y;
        render();
    },
    keydownTitle = function keydown(e) {
        rl.unregisterKeydown(keydown)
            .registerKeydown(keydownMap);
        renderCb.removeCb(renderTitle)
            .push(renderGame);
        setup();
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
        .registerKeydown(keydownTitle);

    state = 'title';
    renderCb.push(renderTitle);
    render();
}());
