"use strict";

// canvas setup
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

// mkaing the canvas the size of the screen
c.width = window.innerWidth;
c.height = window.innerHeight;

// linear interpolation creates smmoth gradiants of colors
function Lerp(a, b, t) {
    return (1 - t) * a + t * b; // woah math!
}

// Generates and updates the map
class Map {
    constructor() {
        // events adds event listeners to the window
        this.Events();

        // Central makes the map by calling other smaller functions
        this.Central();
    }
    // returns a rgba color value for a given input ranging from 0 to 1
    Colors(value) {
        let r, g, b, a;

        // The lerps add a gradient to the specifided range, from the second color to the first (for some reason)
        // It is nessisary to subtract the min range from value to make it so it goes from 0 to 1
        // the multiplier is how faded you want the function to be, I think

        if (value > 0.6) {
            // highland
            r = [184, 194, 204][Math.floor(Math.random() * 2)];
            g = [209, 219, 229][Math.floor(Math.random() * 2)];
            b = [148, 158, 268][Math.floor(Math.random() * 2)];
        } else if (value > 0.575) {
            // highland shadow
            r = Lerp(
                [161, 171][Math.floor(Math.random() * 2)],
                129,
                (value - 0.575) * 20
            );
            g = Lerp(
                [191, 201][Math.floor(Math.random() * 2)],
                171,
                (value - 0.575) * 20
            );
            b = Lerp(
                [130, 140][Math.floor(Math.random() * 2)],
                103,
                (value - 0.575) * 20
            );
        } else if (value > 0.5) {
            // hishish land
            r = [161, 171][Math.floor(Math.random() * 2)]; // 250 - (250 - ) * value * 4;
            g = [191, 201][Math.floor(Math.random() * 2)]; // 242 - (242 - ) * value * 4;
            b = [130, 140][Math.floor(Math.random() * 2)]; // 220 - (220 - ) * value * 4;
        } else if (value > 0.475) {
            // wall
            r = Lerp(156, 161, (value - 0.475) * 10);
            g = Lerp(155, 191, (value - 0.475) * 10);
            b = Lerp(152, 130, (value - 0.475) * 10);
        } else if (value > 0.45) {
            // normal land shadow
            r = Lerp(250, 0, (value - 0.45) * 7.5);
            g = Lerp(242, 0, (value - 0.45) * 7.5);
            b = Lerp(220, 0, (value - 0.45) * 7.5);
        } else if (value > -0.7) {
            // normal land
            252, 248, 230;
            r = [250, 257][Math.floor(Math.random() * 2)];
            g = [242, 253][Math.floor(Math.random() * 2)];
            b = [220, 235][Math.floor(Math.random() * 2)];
        } else if (value > -1) {
            // water fade
            r = Lerp(124, 159, (value + 1) * 3);
            g = Lerp(150, 213, (value + 1) * 3);
            b = Lerp(255, 257, (value + 1) * 3);
        }
        a = 255; // Everything is full opacity

        return [r, g, b, a];
    }

    // The cental function whenever a new map needs to be generated.
    Central() {
        this.imageData = ctx.createImageData(c.width, c.height);

        // v Taken from v
        // https://github.com/josephg/noisejs

        this.noise = new Noise(Date.now()); // Might need to move this later for effincey reasons

        // https://github.com/josephg/noisejs
        // ^ Taken from ^

        this.Make();
    }

    Events() {
        // when teh window is resized it regenerates the map, this might be a problem becuase of lag
        window.addEventListener("resize", () => {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
            this.Central();
        });
    }

    Make() {
        // for some reason, for the canvas to scale properly, it needs to go in increments of four
        for (let y = 0; y < c.height * 4; y += 4) {
            // ditto
            for (let x = 0; x < c.width * 4; x += 4) {
                let value = this.noise.simplex2(
                    // a general noise class created ealier creating a point in simplex noise
                    x / (c.width * 4), // dividing scales the noise bigger
                    y / (c.height * 4)
                );
                let rgba = this.Colors(value); // Colors returns a color in rgba based on a given value and height of the height mpa at a given point
                // imageData.data is a 1d array where every four values is the rgba value of a single pixel
                this.imageData.data[y * c.width + x + 0] = rgba[0];
                this.imageData.data[y * c.width + x + 1] = rgba[1];
                this.imageData.data[y * c.width + x + 2] = rgba[2];
                this.imageData.data[y * c.width + x + 3] = rgba[3];
            }
        }
        console.log(this.imageData);
        ctx.putImageData(this.imageData, 0, 0);
    }
}

const map = new Map();
