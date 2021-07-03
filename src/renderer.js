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
const Line = require("./modules/trails/line");
const Bezier = require("./modules/trails/bezier");
const CurveCopy = require("./modules/trails/curveCopy");
const RainbowTrail = require("./modules/trails/rainbowTrail");
const MouseCross = require("./modules/trails/mouseCross");

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
    this.storeLastPos(global.mousePosition);
  }

  storeLastPos(m) {
    console.log(m)
    if (m) {
      global.positions.push({
        x: m.x,
        y: m.y
      });
    }
    if (global.positions.length > global.positionsMaxSize) {
      global.positions.shift();
    }
  }

  run() {
    new Line(this.canvas, this.ctx);
  }
}

new Renderer();
