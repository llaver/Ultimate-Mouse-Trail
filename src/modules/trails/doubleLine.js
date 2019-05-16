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

/*!	Curve function for canvas 2.3.1
 *	Epistemex (c) 2013-2014
 *	License: MIT
 */

/**
 * Draws a cardinal spline through given point array. Points must be arranged
 * as: [x1, y1, x2, y2, ..., xn, yn]. It adds the points to the current path.
 *
 * The method continues previous path of the context. If you don't want that
 * then you need to use moveTo() with the first point from the input array.
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {CanvasRenderingContext2D} ctx - context to use
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=20] - number of segments between two points (line resolution)
 * @param {Boolean} [close=false] - Close the ends making the line continuous
 * @returns {Float32Array} New array with the calculated points that was added to the path
 */
const curve = (ctx, points, tension, numOfSeg, close) => {
  "use strict";

  // options or defaults
  tension = typeof tension === "number" ? tension : 0.5;
  numOfSeg = numOfSeg ? numOfSeg : 25;

  var pts, // for cloning point array
    i = 1,
    l = points.length,
    rPos = 0,
    rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
    res = new Float32Array(rLen),
    cache = new Float32Array((numOfSeg + 2) * 4),
    cachePtr = 4;

  pts = points.slice(0);

  if (close) {
    pts.unshift(points[l - 1]); // insert end point as first point
    pts.unshift(points[l - 2]);
    pts.push(points[0], points[1]); // first point as last point
  } else {
    pts.unshift(points[1]); // copy 1. point and insert at beginning
    pts.unshift(points[0]);
    pts.push(points[l - 2], points[l - 1]); // duplicate end-points
  }

  // cache inner-loop calculations as they are based on t alone
  cache[0] = 1; // 1,0,0,0

  for (; i < numOfSeg; i++) {
    var st = i / numOfSeg,
      st2 = st * st,
      st3 = st2 * st,
      st23 = st3 * 2,
      st32 = st2 * 3;

    cache[cachePtr++] = st23 - st32 + 1; // c1
    cache[cachePtr++] = st32 - st23; // c2
    cache[cachePtr++] = st3 - 2 * st2 + st; // c3
    cache[cachePtr++] = st3 - st2; // c4
  }

  cache[++cachePtr] = 1; // 0,1,0,0

  // calc. points
  parse(pts, cache, l);

  if (close) {
    //l = points.length;
    pts = [];
    pts.push(points[l - 4], points[l - 3], points[l - 2], points[l - 1]); // second last and last
    pts.push(points[0], points[1], points[2], points[3]); // first and second
    parse(pts, cache, 4);
  }

  function getRainbowColor(min, max, val) {
    let minHue = 0,
      maxHue = 330;
    let curPercent = (val - min) / (max - min);
    return "hsl(" + (curPercent * (maxHue - minHue) + minHue) + ",100%,50%)";
  }

  function parse(pts, cache, l) {
    for (var i = 2, t; i < l; i += 2) {
      var pt1 = pts[i],
        pt2 = pts[i + 1],
        pt3 = pts[i + 2],
        pt4 = pts[i + 3],
        t1x = (pt3 - pts[i - 2]) * tension,
        t1y = (pt4 - pts[i - 1]) * tension,
        t2x = (pts[i + 4] - pt1) * tension,
        t2y = (pts[i + 5] - pt2) * tension;

      for (t = 0; t < numOfSeg; t++) {
        var c = t << 2, //t * 4;
          c1 = cache[c],
          c2 = cache[c + 1],
          c3 = cache[c + 2],
          c4 = cache[c + 3];

        res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
        res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
      }
    }
  }

  // add last point
  l = close ? 0 : points.length - 2;
  res[rPos++] = points[l];
  res[rPos] = points[l + 1];

  // add lines to path
  for (i = 0, l = res.length; i < l; i += 2) {
    let color = getRainbowColor(0, res.length, i); //trail color;
    ctx.beginPath();
    ctx.moveTo(res[i - 2], res[i - 1]);
    ctx.strokeStyle = color;
    ctx.lineTo(res[i], res[i + 1]);
    ctx.stroke();
  }

  return res;
};

class DoubleLine {
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
    this.curve = [];
    this.motionTrailLength = 20;
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
    window.addEventListener("mousemove", event => {
      //console.log("mouse moving", event);
      mouse.x = event.x;
      mouse.y = event.y;
    });
    window.addEventListener(
      "mouseout",
      event => {
        console.log("mouse left");
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

  storeLastPos(m) {
    //console.log("updating mouse pos", m);
    if (m) {
      this.positions.push(m.x);
      this.positions.push(m.y);
    }
    if (this.positions.length > this.motionTrailLength) {
      this.positions.shift();
      this.positions.shift();
    }
  }

  makeMore() {
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    curve(this.ctx, this.positions);
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(mouse.x, mouse.y, mouse.maxRadius, 0, Math.PI * 2, true);
    this.ctx.fillStyle = mouse.color;
    this.ctx.fill();
  }
}

module.exports = DoubleLine;
