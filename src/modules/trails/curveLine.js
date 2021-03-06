"use strict";


// import {curve} from "../../lib/curve_func";

const curve = require("../../lib/curve_func");

let mouse = {
    maxRadius: 7,
    color: "#2E0E4B",
    opacity: 2
};



class CurveLine {
    constructor(canvas, ctx) {
        this.ctx = ctx;
        this.maxTrailSize = 30;
        this.addBindings();
        this.update();
    }

    addBindings() {
        this.update = this.update.bind(this);
    }

    update() {
        requestAnimationFrame(this.update);
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        this.drawTrail();
        this.draw();
    }

    getRainbowColor(min, max, val) {
        const minHue = 0,
            maxHue = 330;
        const curPercent = (val - min) / (max - min);
        return "hsl(" + (curPercent * (maxHue - minHue) + minHue) + ",100%,50%)";
    }

    drawTrail() {
        const curvePositions = curve(global.points.slice(Math.max(global.points.length - this.maxTrailSize * 2, 0)));
        for (let i = 0; i + 3 < curvePositions.length; i = i + 2) {
            const previousPos = {x: curvePositions[i], y: curvePositions[i + 1]}
            const currentPos = {x: curvePositions[i+2], y: curvePositions[i + 3]}

            this.ctx.beginPath();
            this.ctx.moveTo(previousPos.x, previousPos.y);
            if (currentPos && currentPos.x && currentPos.y) {
                this.ctx.lineTo(currentPos.x, currentPos.y);
            }
            this.ctx.strokeStyle = this.getRainbowColor(0, curvePositions.length, i); //trail color;
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.fill();
            this.ctx.stroke();
        }
    }

    draw() {
        // this.ctx.beginPath();
        // this.ctx.arc(global.mousePosition.x, global.mousePosition.y, mouse.maxRadius, 0, Math.PI * 2, true);
        // this.ctx.fillStyle = mouse.color;
        // this.ctx.fill();
    }
}

module.exports = CurveLine;
