// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";

/**
 * REQUIRED HELPERS
 *
 * These are helper modules – non-visual modules.
 */
// const TakeScreenshotOnSpacebar = require("./helpers/take-screenshot-on-spacebar");

/**
 * REQUIRED MODULES
 *
 * Require all your modules here.
 * Modules should be in the /modules folder.
 */
const Dotted = require("./modules/trails/dotted");
const CurveLine = require("./modules/trails/curveLine");
const Line = require("./modules/trails/line");
const Bezier = require("./modules/trails/bezier");
const CurveCopy = require("./modules/trails/curveCopy");
const RainbowTrail = require("./modules/trails/rainbowTrail");
const MouseCross = require("./modules/trails/mouseCross");
const Partytime = require("./modules/trails/partytime");

class Renderer {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.width = null;
    this.height = null;
    this.addBindings();
    this.addListeners();
    this.update();
    this.runOnce();
    this.run();
    // new TakeScreenshotOnSpacebar();
  }

  addBindings() {
    this.update = this.update.bind(this);
    this.runOnce = this.runOnce.bind(this);
  }

  addListeners() {
    window.addEventListener("resize", this.update);
    document.addEventListener("mousemove", event => {
      global.mousePosition.x = event.x;
      global.mousePosition.y = event.y;
    });
  }

  runOnce() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  update() {
    requestAnimationFrame(this.update);
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.storeLastPos(global.mousePosition);
  }

  storeLastPos(m) {
    if (m) {
      global.positions.push({
        x: m.x,
        y: m.y
      });
      global.points.push(m.x)
      global.points.push(m.y)
    }
    if (global.positions.length > global.positionsMaxSize) {
      global.positions.shift();
    }
    if(global.points.length > 2 * global.positionsMaxSize) {
      global.points.shift();
      global.points.shift();
    }
  }

  run() {
    new CurveLine(this.canvas, this.ctx);
    // new MouseCross(this.canvas, this.ctx);
  }
}

new Renderer();
