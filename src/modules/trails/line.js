"use strict";

let mouse = {
  maxRadius: 7,
  color: "#2E0E4B",
  opacity: 2
};

class Line {
  constructor(canvas, ctx) {
    this.ctx = ctx;
    this.maxTrailSize = 50;
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
    const positions = global.positions.slice(Math.max(global.positions.length - this.maxTrailSize, 0))
    for (let i = 0; i < positions.length; i++) {
      const previousPos = positions[i]
      const currentPos = positions[i + 1]

      this.ctx.beginPath();
      this.ctx.moveTo(previousPos.x, previousPos.y);
      if (currentPos && currentPos.x && currentPos.y) {
        this.ctx.lineTo(currentPos.x, currentPos.y);
      }
      this.ctx.strokeStyle = this.getRainbowColor(0, positions.length, i); //trail color;
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

module.exports = Line;
