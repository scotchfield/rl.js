var canvas = r.canvas({herp: 'derp'});
document.getElementById('game_canvas').appendChild(canvas);

var game = (function (canvas) {
    var state;

    var keydownMap = function keydown(e) {
        console.log(e);
    };
    var keydownTitle = function keydown(e) {
        r.unregisterKeydown(keydown);
        state = 'map';
        r.registerKeydown(keydownMap);
        console.log(keydownMap);
        console.log(e);
    };

    state = 'title';
    r.registerKeydown(keydownTitle);
}(canvas));
