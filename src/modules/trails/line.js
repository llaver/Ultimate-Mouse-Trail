"use strict";

const CONSTANTS = {
  interval: 10,
  duration: 2000,
  width: 20,
  height: 40
};

const TakeScreenshot = require("../../helpers/take-screenshot");

let mouse = {
  x: undefined,
  y: undefined,
  maxRadius: 7,
  color: "#2E0E4B",
  opacity: 2
};

class Line {
  constructor(canvas, ctx, shouldTakeScreenshots = false) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = null;
    this.height = null;
    this.interval = null;
    this.colorSwitchCount = 0;
    this.counter = 0;
    this.screenshot = shouldTakeScreenshots;
    this.positions = [];
    this.motionTrailLength = 50;
    this.addBindings();
    this.addListeners();
    this.updateWindow();
    this.beforeStart();
    this.update();
  }

  addBindings() {
    this.updateWindow = this.updateWindow.bind(this);
    this.update = this.update.bind(this);
  }

  addListeners() {
    window.addEventListener("resize", this.updateWindow);
    document.addEventListener("mousemove", event => {
      mouse.x = event.x;
      mouse.y = event.y;
    });
    document.addEventListener(
      "mouseout",
      event => {
        console.log(event);
      },
      false
    );
  }

  updateWindow() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  beforeStart() {
    //this.ctx.fillStyle = '#ffffff';
    //this.ctx.fillRect(0, 0, this.width, this.height);
  }

  update() {
    requestAnimationFrame(this.update);
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.storeLastPos(mouse);
    this.makeMore();
    this.draw();
  }

  getRainbowColor(min, max, val) {
    let minHue = 0,
      maxHue = 330;
    let curPercent = (val - min) / (max - min);
    return "hsl(" + (curPercent * (maxHue - minHue) + minHue) + ",100%,50%)";
  }

  storeLastPos(m) {
    if (m) {
      this.positions.push({
        x: m.x,
        y: m.y
      });
    }
    // mouse.color = this.getRainbowColor(
    //   0,
    //   this.positions.length,
    //   this.positions.length - 1
    // );
    if (this.positions.length > this.motionTrailLength) {
      this.positions.shift();
    }
  }

  makeMore() {
    for (let i = 0; i < this.positions.length; i++) {
      let randRadius = Math.random() * 7;
      this.ctx.beginPath();
      this.ctx.moveTo(this.positions[i].x, this.positions[i].y);
      if (!(i + 1 > this.positions.length)) {
        this.ctx.lineTo(this.positions[i + 1].x, this.positions[i + 1].y);
      }
      this.ctx.strokeStyle = this.getRainbowColor(0, this.positions.length, i); //trail color;
      this.ctx.lineWidth = 3;
      this.ctx.lineCap = "round";
      this.ctx.lineJoin = "round";
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(mouse.x, mouse.y, mouse.maxRadius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = mouse.color;
    this.ctx.fill();
  }
}

module.exports = Line;
