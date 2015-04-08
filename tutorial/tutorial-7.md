# Tutorial 7 (More Custom Tiles)
## Introduction

Alright. It's time to get serious, and to start building something that feels like a game.

In this tutorial, we'll use custom tiles to represent the character without an at-sign. We'll also create an item, represented by another custom tile, that the player can interact with.

## Want to skip all this and just see the source?

[Don't worry, it's all on GitHub.](https://github.com/scotchfield/rl.js/tree/master/tutorial/tutorial-7)

## Step One: Basic Outline

Here are the two images that we'll use.

Tiles for the player:
![Player tiles, by Oryx](tutorial-7/oryx_player.png)

And tiles for the items: ![Item tiles, by Oryx](tutorial-7/oryx_items.png)

Now, we'll take what we've learned from the previous tutorials to create a skeleton for our simple game.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    (function () {
        var width = 20, height = 20, timer,

        player = {
            x: 1, y: 1,
        },

        render = function () {},

        keydown = function (e) {
            var nx = player.x, ny = player.y;

            if (rl.isKey(e, rl.key.d)) {
                nx += 1;
            } else if (rl.isKey(e, rl.key.a)) {
                nx -= 1;
            } else if (rl.isKey(e, rl.key.s)) {
                ny += 1;
            } else if (rl.isKey(e, rl.key.w)) {
                ny -= 1;
            }

            if (rl.canMoveTo(nx, ny)) {
                player.x = nx;
                player.y = ny;
            }

            render();
        };

        rl.create('game_canvas', {width: width, height: height})
            .loadImage('oryx_player.png', 'player')
            .loadImage('oryx_items.png', 'items')
            .registerKeydown(keydown);
    }());
    </script>
      </body>
    </html>

So far, we have an empty world and an invisible player. However, we are loading both of our images, and we've handling keypresses. Let's see what we can do with this.

## Step Two: Custom Player Tiles

