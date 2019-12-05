// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
"use strict";

/**
 * REQUIRED HELPERS
 *
 * These are helper modules – non-visual modules.
 */
const TakeScreenshotOnSpacebar = require("./helpers/take-screenshot-on-spacebar");

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
    this.run();
    new TakeScreenshotOnSpacebar();
  }

  addBindings() {
    this.update = this.update.bind(this);
  }

  addListeners() {
    window.addEventListener("resize", this.update);
  }

  update() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  run() {
    //new Dotted(this.canvas, this.ctx, false);
    new RainbowTrail(this.canvas, this.ctx, false);
    //new MouseCross(this.canvas, this.ctx, false);
  }
}

new Renderer();
