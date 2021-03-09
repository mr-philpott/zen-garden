"use strict";

import { Noise } from "./noise.js";

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

c.width = window.innerWidth;
c.height = window.innerHeight;

let imageData = ctx.createImageData(c.width, c.height);

let noise = new Noise(Math.random());

for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
        let value = noise.simplex2(x / 100, y / 100);
        console.log(value);
        // let r = Math.round(255 * value);
        // let g = Math.round(255 * value);
        // let b = Math.round(255 * value);
        // let a = 255
        // imageData.data[] =
    }
}
ctx.putImageData(imageData, 0, 0);
