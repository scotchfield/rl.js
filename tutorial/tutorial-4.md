# Tutorial 4 (Walls and Objects)
## Introduction

Our player can move around the canvas in response to keydown events. Now, let's add some walls and objects to the world to interact with. We'll collide with walls, preventing us from moving past them, and we'll add some terrain and other features that can be walked over.

## Want to skip all this and just see the source?

[Don't worry, it's all on GitHub.](https://github.com/scotchfield/rl.js/tree/master/tutorial/tutorial-4)

## Step One: Player Movement

Let's set up a closure with the things we've already learned from past examples to get moving around the screen, with the exception of the code that stops us from walking past the width and height of the canvas.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    (function () {
        var width = 20, height = 20,

        player = {
            x: 0, y: 0, c: '@', style: '#ffffff',
        },

        render = function () {
            rl.clear()
                .style(player.style)
                .write(player.c, player.x, player.y);
        },

        keydown = function (e) {
            if (rl.isKey(e, rl.key.d)) {
                player.x += 1;
            } else if (rl.isKey(e, rl.key.a)) {
                player.x -= 1;
            } else if (rl.isKey(e, rl.key.s)) {
                player.y += 1;
            } else if (rl.isKey(e, rl.key.w)) {
                player.y -= 1;
            }

            render();
        };

        rl.create('game_canvas', {width: width, height: height})
            .registerKeydown(keydown);

        render();
    }());
    </script>
    </body></html>

Groovy. Time for some walls.

## Step Two: Blocking Tiles

rl.js will 