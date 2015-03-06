# rl.js
A JavaScript library to build browser-based roguelikes.

## Hello World
    <!doctype html><html><body>
    <div id="game_canvas"></div>
    <script src="../src/rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    rl.create('game_canvas')
        .write('Hello World!', 0, 0);
    </script>
    </body></html>
