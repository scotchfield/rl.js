# Tutorial 3 (Basic Movement)
## Introduction

Now that we've got text on the screen along with some basic events, let's get the prototypical roguelike at-symbol moving around the screen in response to a keypress.

## Want to skip all this and just see the source?

[Don't worry, it's all on GitHub.](https://github.com/scotchfield/rl.js/tree/master/tutorial/tutorial-3)

## Step One: Showing The Player

We'll start with the template we've been working with, and set up a closure to make sure we're working in a protected space.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    (function () {
        var width = 20, height = 20;

        rl.create('game_canvas', {width: width, height: height});
    }());
    </script>
    </body></html>

Roguelikes have a long tradition of representing the player with an at-sign (@). For this example, we'll do the same. On a plain black background, we'll render the player in white at a particular x and y position on the screen. We can store this information by creating a player object using the JavaScript object literal notation.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    (function () {
        var width = 20, height = 20,

        player = {
            x: 0, y: 0, c: '@', style: '#ffffff',
        };

        rl.create('game_canvas', {width: width, height: height});
    }());
    </script>
    </body></html>

Each property of the player object corresponds to some aspect of the player's screen presence. The x and y properties (player.x and player.y) represent where the player is in on the screen. The c property represents the character drawn at the player's location, and as mentioned earlier, we'll stick to the canonical at-sign. The style property is a CSS colour value, which in this case is white.

Now that we have this information available, let's define a render function that clears the screen, sets the appropriate style, and draws the player character to the canvas. Once we have the function, we'll call it once (render's gotta render, after all!).

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
        };

        rl.create('game_canvas', {width: width, height: height});
        
        render();
    }());
    </script>
    </body></html>

![At-sign](tutorial-3/at-sign.png)

