"use strict";

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

class Vector {
    constructor(angle, mag) {
        this.x = Math.cos(angle) * mag;
        this.y = Math.sin(angle) * mag;
    }
    Add(vector) {
        if (typeof vector === "object") {
            this.x += vector.x;
            this.y += vector.y;
        } else {
            this.x += vector;
            this.y += vector;
        }
    }

    Sub() {
        if (typeof vector === "object") {
            this.x -= vector.x;
            this.y -= vector.y;
        } else {
            this.x -= vector;
            this.y -= vector;
        }
    }
}

class Perlin2d {
    constructor(width, height, cellamtx, cellamty, pointInterval) {
        this.dimensions = { width, height };
        this.cellamts = { x: cellamtx, y: cellamty };
        this.gridVector = [];

        this.FormGrid();
    }

    FormGrid() {
        for (let y = 0; y < this.cellamts.y; y++) {
            let temparr = [];
            for (let x = 0; x < this.cellamts.x; x++) {
                temparr.push(new Vector(Math.random() * 2 * Math.PI, 1));
            }
            this.gridVector.push(temparr);
        }
    }
}

new Perlin2d(100, 100, 20, 20, 1);
