var canvas = rl.canvas();
document.getElementById('game_canvas').appendChild(canvas);

var game = (function (canvas) {
    var state;

    var keydownMap = function keydown(e) {
        console.log(e);
    };
    var keydownTitle = function keydown(e) {
        rl.unregisterKeydown(keydown);
        state = 'map';
        rl.registerKeydown(keydownMap);
        console.log(keydownMap);
        console.log(e);
    };

    state = 'title';
    rl.registerKeydown(keydownTitle);
}(canvas));
