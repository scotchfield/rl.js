# Tutorial 2 (Animated Hello)
## Introduction

In the last tutorial, we set up a basic canvas element on the screen, and wrote a single piece of text.

Now, we'll do two new things. First, we'll pass some basic options to the create function to change the size of the canvas. Second, we'll set up a timer to alter the colour of the text at regular intervals.

## Want to skip all this and just see the source?

[Don't worry, it's all on GitHub.](https://github.com/scotchfield/rl.js/tree/master/tutorial/tutorial-2)

## Step One: The Basics

Let's create a simple webpage to hold our HTML and custom JavaScript, similar to the template we used in the previous example.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    // Our code goes here.
    </script>
    </body></html>

Next, let's create a canvas. Unlike the last example, we can set some options for the drawing element. Let's set the width to 12, and the height to 1, keeping in mind that these values are in tiles, not pixels.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    rl.create('game_canvas', {width: 12, height: 1});
    </script>
    </body></html>

![Empty Canvas](tutorial-2/canvas.png)

Not too exciting, but we can see that the canvas is a different size. That's great. We'll see a full list of options in a later tutorial.

Let's add a timer to start doing some interesting stuff.

## Step Two: Interval Training

In the last example, we rendered a piece of text to the screen, and left it at that.

The JavaScript browser environment provides access to an object called window. The window object has a function called setInterval that calls a function at a specified time interval. We can set up a simple interval like so:

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    var timer,
    intervalFunction = function () {
        console.log('Interval!');
    };

    rl.create('game_canvas', {width: 12, height: 1});

    timer = setInterval(intervalFunction, 1000);
    </script>
    </body></html>

This code sets up a timer that calls intervalFunction every 1000ms (one second). If you look at the console, you'll see a little 'Interval!' appear every second or so.

We can shorten this code by using an anonymous function, which removes the intervalFunction variable and inlines the code that we're only using in setInterval anyway.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    var timer;

    rl.create('game_canvas', {width: 12, height: 1});

    timer = setInterval(function () {
    	console.log('Interval!');
    }, 1000);
    </script>
    </body></html>

Instead of calling console.log, we can write some text to the screen at each interval. To do so, let's change the code to this:

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    var timer;

    rl.create('game_canvas', {width: 12, height: 1});

    timer = setInterval(function () {
        rl.write('Hello World!');
    }, 1000);
    </script>
    </body></html>

![Empty Canvas](tutorial-2/hello_noclear.png)

Hmm. If we run that code, we get a blank screen for one second, then the text appears, and slowly gets thicker and thicker. What gives?

Each time the interval function is called, the text gets written to the screen, overwriting the previous text. Since the text is anti-aliased, this results in a steadily blocky collection of characters.

We need to clear the canvas! rl.clear to the rescue.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    var timer;

    rl.create('game_canvas', {width: 12, height: 1});

    timer = setInterval(function () {
        rl.clear()
            .write('Hello World!');
    }, 1000);
    </script>
    </body></html>

Again, note that we're chaining these statements together. You can also write rl.clear(); and follow it with rl.write(...).

Now that we're clearing and writing to the screen, let's add the colour changing code. We'll use a variable called g to hold the greyscale value, and each time the interval comes, we'll increment g and write the text to the screen.

To change the colour of the text, we'll use rl.style. The style function uses the canvas fillStyle to specify how future draw calls should be rendered. We can pass any CSS colour value. For this example, we'll use an rgb colour (for example, rgb(255,0,0) for red).

The code might look like this:

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    var timer, g = 0;

    rl.create('game_canvas', {width: 12, height: 1});

    timer = setInterval(function () {
        g = (g + 16) % 256;
        rl.clear()
      	    .style('rgb(' + g +	',' + g	+ ',' +	g + ')')
            .write('Hello World!', 0, 0);
    }, 100);
    </script>
    </body></html>

![Empty Canvas](tutorial-2/hello_grey.png)

We've also lowered the interval time to 100ms so that the changes occur more frequently. (Otherwise, it's kind of boring!)

## Step Three: Closures

The code works nicely, so we can just ship it and be done. Right?

One major issue is that we're adding variables into the global namespace. This is bad, because any other code that we write later that uses timer or g might stomp on our well-intentioned Hello World code.

A convenient way to get around this is to wrap the code inside of a closure. A closure is a way to encapsulate a block of code inside a protective bubble. For example, imagine the following code:

    var foo = function () {
    	var a = 1;
    }
    console.log(a);

We wouldn't expect the console.log call to print anything to the screen. The variable a is wrapped inside of the function associated with the variable foo. It's a protected piece of memory that is available only inside of foo's function block.

A closure works in the same way. We can protect our variables and remove them from the global namespace by wrapping everything up inside of a closure.

    <!doctype html>
    <html><body>
    <div id="game_canvas"></div>
    <script src="rl.js" type="text/javascript"></script>
    <script type="text/javascript">
    (function () {
        var timer, g = 0;

        rl.create('game_canvas', {width: 12, height: 1});

        timer = setInterval(function () {
            g = (g + 16) % 256;
            rl.clear()
      	        .style('rgb(' + g +	',' + g	+ ',' +	g + ')')
                .write('Hello World!', 0, 0);
        }, 100);
	}());
    </script>
    </body></html>

By changing the code in this way, we define an anonymous function, place all of our existing code inside of it, and then call it immediately. This stuffs the timer and g variables inside of function block, prevents other code from accessing them, while still allowing them to run.

If you're unsure of this approach, you can disregard it going forward. Just remove the lines of code around the tutorial block, and things should still work fine. For smaller examples, we're not concerned with namespacing issues. As you write larger pieces of code, however, it's a great trick to have in your toolbox.

For more information on closures, [check out this video](https://www.youtube.com/watch?v=yiEeiMN2Khs).

## Conclusion

Alright, we're doing interesting things now! We've used some more functions to draw to the canvas, and we've set up a timer so that the environment is changing without our input.

In the next tutorial, we'll use the tile-based nature of rl.js to start making some pretty effects.