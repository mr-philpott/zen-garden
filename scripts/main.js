"use strict";

// canvas setup
const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

// mkaing the canvas the size of the screen
c.width = window.innerWidth;
c.height = window.innerHeight;

// cosnts
const ROCK_RADIUS = 1000;
const ROCK_VERTS = 10;
const ROCK_OFFSET_RANGE = 10;

// linear interpolation creates smmoth gradiants of colors
function Lerp(a, b, t) {
    return (1 - t) * a + t * b; // woah math!
}

function InRange(check, compare, range) {
    if (check > compare + range || check < compare - range) return false;
    return true;
}

class Color {
    constructor(red, green, blue, alpha) {
        this.r = red;
        this.g = green;
        this.b = blue;
        this.a = alpha;
    }
}

class Polygon {
    constructor(verts) {
        this.verts = verts;
    }

    GetEqs() {
        this.eqs = {};
        for (let i = 0; i < this.verts.length; i++) {
            let iplus1 = i + 1 > this.verts.length - 1 ? 0 : i + 1;
            this.eqs[`line${i}`] = {
                x0: this.verts[i],
                x1: this.verts[iplus1],
                y0: this.verts[i],
                y1: this.verts[iplus1],
                m:
                    (this.verts[iplus1][1] - this.verts[i][1]) /
                    (this.verts[iplus1][0] - this.verts[i][0]),
            };
        }
        return this.eqs;
    }

    FindMaxMin() {
        let minx = Infinity,
            maxx = 0,
            miny = Infinity,
            maxy = 0;
        for (let point of this.verts) {
            if (point[0] > maxx) maxx = point[0];
            if (point[0] < minx) minx = point[0];
            if (point[1] > maxy) maxy = point[1];
            if (point[1] < miny) miny = point[1];
        }
        return {
            minx,
            maxx,
            miny,
            maxy,
        };
    }
}

// Generates and updates the map
class Map {
    constructor() {
        // events adds event listeners to the window
        this.Events();

        // Central makes the map by calling other smaller functions
        this.Central();
    }

    Events() {
        // when teh window is resized it regenerates the map, this might be a problem becuase of lag
        window.addEventListener("resize", () => {
            c.width = window.innerWidth;
            c.height = window.innerHeight;
            this.Central();
        });
    }

    // returns a rgba color value for a given input ranging from 0 to 1
    Colors(value) {
        let r, g, b, a;

        // The lerps add a gradient to the specifided range, from the second color to the first (for some reason)
        // It is nessisary to subtract the min range from value to make it so it goes from 0 to 1
        // the multiplier is how faded you want the function to be, I think

        if (value > 0.6) {
            // highland
            return [
                [184, 194, 204][Math.floor(Math.random() * 2)],
                [209, 219, 229][Math.floor(Math.random() * 2)],
                [148, 158, 268][Math.floor(Math.random() * 2)],
                255,
            ];
        } else if (value > 0.575) {
            // highland shadow
            return [
                Lerp(
                    [161, 171][Math.floor(Math.random() * 2)],
                    129,
                    (value - 0.575) * 20
                ),
                Lerp(
                    [191, 201][Math.floor(Math.random() * 2)],
                    171,
                    (value - 0.575) * 20
                ),
                Lerp(
                    [130, 140][Math.floor(Math.random() * 2)],
                    103,
                    (value - 0.575) * 20
                ),
                255,
            ];
        } else if (value > 0.5) {
            // hishish land
            return [
                [161, 171][Math.floor(Math.random() * 2)],
                [191, 201][Math.floor(Math.random() * 2)],
                [130, 140][Math.floor(Math.random() * 2)],
                255,
            ];
        } else if (value > 0.475) {
            // wall
            return [
                Lerp(156, 161, (value - 0.475) * 10),
                Lerp(155, 191, (value - 0.475) * 10),
                Lerp(152, 130, (value - 0.475) * 10),
                255,
            ];
        } else if (value > 0.45) {
            // normal land shadow
            return [
                Lerp(
                    [250, 255][Math.floor(Math.random() * 2)],
                    [240, 235][Math.floor(Math.random() * 2)],
                    (value - 0.45) * 45
                ),
                Lerp(
                    [242, 253][Math.floor(Math.random() * 2)],
                    [227, 221][Math.floor(Math.random() * 2)],
                    (value - 0.45) * 45
                ),
                Lerp(
                    [220, 235][Math.floor(Math.random() * 2)],
                    [194, 185][Math.floor(Math.random() * 2)],
                    (value - 0.45) * 45
                ),
                255,
            ];
        } else if (value > -0.75) {
            return [255, 255, 255, 255];
        } else {
            // water fade
            return [
                Lerp(Lerp(124, 159, (value + 1) * 3), 0, (value + 1) * 0.75),
                Lerp(Lerp(150, 213, (value + 1) * 3), 0, (value + 1) * 0.75),
                Lerp(Lerp(255, 255, (value + 1) * 3), 0, (value + 1) * 0.75),
                255,
            ];
        }
    }

    Sand(value) {
        if (value > 0.5) {
            return [
                [255, 255][Math.floor(Math.random() * 2)],
                [247, 255][Math.floor(Math.random() * 2)],
                [225, 240][Math.floor(Math.random() * 2)],
                255,
            ];
        } else if (value > 0) {
            return [
                [253, 255][Math.floor(Math.random() * 2)],
                [246, 255][Math.floor(Math.random() * 2)],
                [224, 239][Math.floor(Math.random() * 2)],
                255,
            ];
        } else {
            return [
                [251, 255][Math.floor(Math.random() * 2)],
                [243, 254][Math.floor(Math.random() * 2)],
                [221, 236][Math.floor(Math.random() * 2)],
                255,
            ];
        }
    }

    // The cental function whenever a new map needs to be generated.
    Central() {
        this.imageData = ctx.createImageData(c.width, c.height);

        // v Taken from v
        // https://github.com/josephg/noisejs

        this.noise = new Noise(Date.now()); // Might need to move this later for effincey reasons

        // https://github.com/josephg/noisejs
        // ^ Taken from ^

        this.Base();

        ctx.putImageData(this.imageData, 0, 0);
    }

    Base() {
        // for some reason, for the canvas to scale properly, it needs to go in increments of four

        // For the main content
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

        let blues = [];

        //  A re-run through every pixel to add things such as props and the proper sand values
        for (let y = 0; y < c.height * 4; y += 4) {
            for (let x = 0; x < c.width * 4; x += 4) {
                if (
                    this.imageData.data[y * c.width + x + 0] === 255 &&
                    this.imageData.data[y * c.width + x + 1] === 255 &&
                    this.imageData.data[y * c.width + x + 2] === 255
                ) {
                    let value = this.noise.simplex2(
                        (x / c.width) * 2,
                        (y / c.height) * 2
                    );
                    let rgba = this.Sand(value);
                    this.imageData.data[y * c.width + x + 0] = rgba[0];
                    this.imageData.data[y * c.width + x + 1] = rgba[1];
                    this.imageData.data[y * c.width + x + 2] = rgba[2];
                    this.imageData.data[y * c.width + x + 3] = rgba[3];
                } else if (
                    InRange(this.imageData.data[y * c.width + x + 0], 126, 4) &&
                    InRange(this.imageData.data[y * c.width + x + 1], 162, 4) &&
                    InRange(this.imageData.data[y * c.width + x + 2], 208, 4)
                ) {
                    blues.push([x, y]);
                }
            }
        }

        let numOfRocks;
        if (blues.length > 10000) {
            numOfRocks = 25;
        } else if (blues.length > 5000) {
            numOfRocks = 15;
        } else if (blues.length > 1000) {
            numOfRocks = 5;
        } else if (blues.length > 100) {
            numOfRocks = 1;
        }

        for (
            let i = 0;
            i < blues.length;
            i += Math.floor(blues.length / numOfRocks)
        ) {
            this.Rocks(blues[i][0], blues[i][1]);
        }
    }

    Rocks(centx, centy) {
        let turn = (Math.PI * 2) / ROCK_VERTS;
        let points = [];
        let eqs = [];

        for (let i = 0; i < ROCK_VERTS; i++) {
            let xs =
                centx +
                Math.cos(turn * i) * ROCK_RADIUS +
                Math.cos(turn * i) *
                    (Math.floor(Math.random() * 2) > 0
                        ? Math.floor(Math.random() * ROCK_OFFSET_RANGE)
                        : Math.floor(Math.random() * -ROCK_OFFSET_RANGE));
            let ys =
                centy +
                Math.sin(turn * i) * ROCK_RADIUS +
                Math.sin(turn * i) *
                    (Math.floor(Math.random() * 2) > 0
                        ? Math.floor(Math.random() * ROCK_OFFSET_RANGE)
                        : Math.floor(Math.random() * -ROCK_OFFSET_RANGE));
            points.push([xs, ys]);
        }

        let poly = new Polygon(points);
        let eq = poly.GetEqs();
        let mm = poly.FindMaxMin();

        let [r, g, b] = [
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
            Math.floor(Math.random() * 256),
        ];
        for (let point of points) {
            for (let y = -52; y < 52; y += 4) {
                for (let x = -52; x < 52; x += 4) {
                    this.imageData.data[
                        (point[1] + y) * c.width + (point[0] + x) + 0
                    ] = r;
                    this.imageData.data[
                        (point[1] + y) * c.width + (point[0] + x) + 1
                    ] = g;
                    this.imageData.data[
                        (point[1] + y) * c.width + (point[0] + x) + 2
                    ] = b;
                    this.imageData.data[
                        (point[1] + y) * c.width + (point[0] + x) + 3
                    ] = 255;
                }
            }
        }
    }
}

const map = new Map();
