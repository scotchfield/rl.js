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
        rl.addTile(3, 3);
    },

    renderTitle = function () {
        var opacity = 0.7 + 0.3 * Math.cos((Date.now() % 6290) / 1000);
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
            .render()
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
    timer = setInterval(renderTitle, 100);
    //renderCb.push(renderTitle);
    render();
}());
