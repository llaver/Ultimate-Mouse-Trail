const getRainbowColor = (min, max, val) => {
	let minHue = 20,
		maxHue = 350;
	let curPercent = (val - min) / (max - min);
	return "hsl(" + (curPercent * (maxHue - minHue) + minHue) + ",100%,50%)";
};

const curve = (ctx, points, tension, numOfSeg) => {

	// options or defaults
	tension = typeof tension === "number" ? tension : 0.5;
	numOfSeg = numOfSeg ? numOfSeg : 5;

	let pts, // for cloning point array
		i = 1,
		l = points.length,
		rPos = 0,
		rLen = (l - 2) * numOfSeg + 2,
		res = new Float32Array(rLen),
		cache = new Float32Array((numOfSeg + 2) * 4),
		cachePtr = 4;

	pts = points.slice(0);

	pts.unshift(points[1]); // copy 1. point and insert at beginning
	pts.unshift(points[0]);
	pts.push(points[l - 2], points[l - 1]); // duplicate end-points

	// cache inner-loop calculations as they are based on t alone
	cache[0] = 1; // 1,0,0,0

	for (; i < numOfSeg; i++) {
		let st = i / numOfSeg,
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

	function parse(pts, cache, l) {
		for (let i = 2, t; i < l; i += 2) {
			let pt1 = pts[i],
				pt2 = pts[i + 1],
				pt3 = pts[i + 2],
				pt4 = pts[i + 3],
				t1x = (pt3 - pts[i - 2]) * tension,
				t1y = (pt4 - pts[i - 1]) * tension,
				t2x = (pts[i + 4] - pt1) * tension,
				t2y = (pts[i + 5] - pt2) * tension;

			for (t = 0; t < numOfSeg; t++) {
				let c = t << 2, //t * 4;
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
	l = points.length - 2;
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

let mouse = {
	x: undefined,
	y: undefined
};

class RainbowTrail {
	constructor(canvas, ctx) {
		console.log("trail")
		this.ctx = ctx;
		this.positions = [];
		this.trailLength = 40;
		this.addBindings();
		this.addListeners();
		this.update();
	}

	addBindings() {
		this.update = this.update.bind(this);
	}

	addListeners() {
		window.addEventListener("mousemove", event => {
			mouse.x = event.x;
			mouse.y = event.y;
		});
	}

	update() {
		requestAnimationFrame(this.update);
		this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.storeLastPos(mouse);
		this.draw();
	}

	storeLastPos(m) {
		if (m) {
			this.positions.push(m.x);
			this.positions.push(m.y);
		}
		if (this.positions.length > this.trailLength) {
			this.positions.shift();
			this.positions.shift();
		}
	}

	draw() {
		console.log("we drawin")
		this.ctx.lineWidth = 3;
		this.ctx.lineCap = "round";
		this.ctx.lineJoin = "round";
		curve(this.ctx, this.positions);
	}
}

module.exports = RainbowTrail;
