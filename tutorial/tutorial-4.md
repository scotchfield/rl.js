# Tutorial 4 (Walls and Terrain)
## Introduction

Our player can move around the canvas in response to keydown events. Now, let's add some walls and terrain to the world to interact with. We'll collide with walls, preventing us from moving past them, and we'll add some terrain and other features that can be walked over.

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

rl.js has a collection of objects used to implement tiles. The library maintains an internal array of these tiles, and displays them to the screen using its own render function. To add a single tile to our game, we need to make two changes.

First, we'll call rl.addTile after creating our canvas and setting up the keydown callback.

rl.addTile takes two or three arguments. The first two arguments provided are the x and y coordinates of the tile in the world (not on the screen; we've been treating the upper-left corner of the screen as 0, 0 by default, and we'll address that in a second). The third argument is the tile object, which contains information about what the tile will look like, how it should be rendered, and so on. We'll see some examples of that in a second as well. For now, it's enough to note that if we omit the third argument, we get a regular white blocking tile by default.

Change the rl.create block to this:

    rl.create('game_canvas', {width: width, height: height})
        .registerKeydown(keydown)
        .addTile(1, 1);

When the game starts, it will add a single white blocking tile to its list. If you run the game, however, you won't see anything. What gives?

rl.js has its own rendering function, called rl.render, which is responsible for drawing tiles to the screen. rl.render takes two arguments as input: the x and y coordinates of the top-left corner of the screen. Since we've been using 0, 0 so far, we can stick with that for now.

Change the render function to this:

    render = function () {
        rl.clear()
            .render(0, 0)
            .style(player.style)
            .write(player.c, player.x, player.y);
    },

![Our first wall!](tutorial-4/first-wall.png)

Okay! Looks good.

There's a problem though. If you try to walk into it, the wall doesn't block you. What's the big deal? This is supposed to be a blocking wall, right?

In our movement function, we're not checking to see if the space is free before we change the player x and y coordinates. Let's do that before we move the player into a bogus spot.

First, let's add some temporary variables to store the new x and y position that the player would like to move to.

    keydown = function (e) {
      	var nx = player.x, ny =	player.y;

        if (rl.isKey(e, rl.key.d)) {
            nx += 1;
        } else if (rl.isKey(e, rl.key.a)) {
            nx -= 1;
        } else if (rl.isKey(e, rl.key.s)) {
            ny += 1;
        } else if (rl.isKey(e, rl.key.w)) {
            ny -= 1;
        }

        render();
    };

After that, we'll use rl.canMoveTo to scan the list of tiles stored in rl.js. If any blocking tiles exist at the x and y coordinates passed to rl.canMoveTo, the function will return false.

    keydown = function (e) {
      	var nx = player.x, ny =	player.y;

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

If we try to walk through the wall, we're stopped. Hurrah!

## Step Three: Non-blocking Tiles

Tiles shouldn't always block the player. For example, we might want to have tiles representing the ground that the player is walking on, including grass, stone, or wood.

First, let's make the previous rl.addTile call explicit. We'll add the third argument, and call the function that's actually used to create a standard blocking tile.

    rl.create('game_canvas', {width: width, height: height})
        .registerKeydown(keydown)
        .addTile(1, 1, rl.TileBlocking());

rl.TileBlocking returns an object containing all the information rl.js needs to render a regular white blocking tile to the screen.

A similar tile exists, called rl.TileNonBlocking. This acts exactly as the blocking tile (solid white square at the specified position), but doesn't cause rl.canMoveTo to declare that the player can't be in that position.

Let's amend the code to add a non-blocking tile.

    rl.create('game_canvas', {width: width, height: height})
        .registerKeydown(keydown)
        .addTile(1, 1, rl.TileBlocking())
        .addTile(2, 2, rl.TileNonBlocking());

![A non-blocking tile](tutorial-4/noblock-tile.png)

The first tile prevents the player from walking through it, while the second allows the player to pass right over.

Both tiles are white, just like the player, which is kind of annoying. Each of these tile functions can be extended to make things nicer, and we'll see how later. However, for the time being, we can use the fact that rl.TileNonBlocking accepts an argument to change the default colour. Let's build a basic level.

Remove the two rl.addTile calls, and use the following code:

    rl.create('game_canvas', {width: width, height: height})
        .registerKeydown(keydown);

    setup();
    render();

Next, move the player's default position to 1, 1.

    player = {
        x: 1, y: 1, c: '@', style: '#ffffff',
    },

Finally, add the following function.

    setup = function () {
        var i, j;

        for (i = 0; i <	width; i += 1) {
            for (j = 0; j < height; j += 1) {
                if (i === 0 || i === width - 1 || j === 0 || j === height - 1) {
                    rl.addTile(i, j, rl.TileBlocking());
                } else {
                    rl.addTile(i, j, rl.TileNonBlocking('#006600'));
                }
            }
        }
    },

For each position along the edge of the canvas, store a blocking wall tile. For each position inside the outer wall, draw a non-blocking tile in dark green.

![Outer wall and inner grass](tutorial-4/all-tiles.png)

The player is prevented from walking off the edge of the screen, and we have some nice grass under our feet. (Well, if you stretch your imagination a little bit--hey, these are roguelikes!)

## Conclusion

With player movement and tiles, we can start building basic frameworks for games. We'll extend these functions in the next tutorial to show how other symbols and images can replace the flat coloured blocks.