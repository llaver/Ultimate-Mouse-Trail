"use strict";

let mouse = {
  x: undefined,
  y: undefined,
  maxRadius: 7,
  color: "#2E0E4B",
  opacity: 2
};

class Line {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.positions = [];
    this.motionTrailLength = 40;
    this.addBindings();
    this.addListeners();
    this.update();
  }

  addBindings() {
    this.update = this.update.bind(this);
  }

  addListeners() {
    document.addEventListener("mousemove", event => {
      mouse.x = event.x;
      mouse.y = event.y;
    });
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
    if (this.positions.length > this.motionTrailLength) {
      this.positions.shift();
    }
  }

  makeMore() {
    for (let i = 0; i < this.positions.length; i++) {
      const previousPos = this.positions[i]
      const currentPos = this.positions[i + 1]

      this.ctx.beginPath();
      this.ctx.moveTo(previousPos.x, previousPos.y);
      if (currentPos && currentPos.x && currentPos.y) {
        this.ctx.lineTo(currentPos.x, currentPos.y);
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
