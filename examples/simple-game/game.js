var game = (function () {
    var canvas, state,

    keydownMap = function keydown(e) {
        console.log(e);
    };
    keydownTitle = function keydown(e) {
        rl.unregisterKeydown(keydown)
            .registerKeydown(keydownMap);
        state = 'map';
    };

    canvas = rl.canvas();
    document.getElementById('game_canvas').appendChild(canvas);

    state = 'title';
    rl.registerKeydown(keydownTitle);
}());
