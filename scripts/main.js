"use strict";

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;

let imageData = ctx.createImageData(c.width, c.height);

// https://github.com/josephg/noisejs
let noise = new Noise(Date.now());
// https://github.com/josephg/noisejs

for (let y = 0; y < c.height * 4; y += 4) {
    for (let x = 0; x < c.width * 4; x += 4) {
        let value = noise.simplex2(x / (c.width * 4), y / (c.height * 4));
        let r = Math.round(255 - 255 * (value > 0 ? 0 : 1));
        let g = Math.round(255 - 255 * (value > 0 ? 0 : 1));
        let b = Math.round(255 - 255 * (value > 0 ? 0 : 1));
        let a = 255;
        imageData.data[y * c.width + x + 0] = r;
        imageData.data[y * c.width + x + 1] = g;
        imageData.data[y * c.width + x + 2] = b;
        imageData.data[y * c.width + x + 3] = a;
    }
}

console.log(imageData.data[100000]);

ctx.putImageData(imageData, 0, 0);
