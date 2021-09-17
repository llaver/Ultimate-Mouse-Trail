"use strict";

let mouse = {
	x: undefined,
	y: undefined,
	maxRadius: 7,
	color: "#2E0E4B",
	secondaryColor: "#ff7c25",
	opacity: 2
};

class MouseCross {
	constructor(canvas, ctx) {
		this.ctx = ctx;
		this.addBindings();
		this.addListeners();
		this.updateWindow();
		this.update();
	}

	addBindings() {
		this.updateWindow = this.updateWindow.bind(this);
		this.update = this.update.bind(this);
	}

	addListeners() {
		window.addEventListener("resize", this.updateWindow);
		window.addEventListener("mousemove", event => {
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

	update() {
		requestAnimationFrame(this.update);
		this.draw();
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.moveTo(mouse.x - 10, mouse.y - 10);
		this.ctx.lineTo(mouse.x + 10, mouse.y + 10);
		this.ctx.moveTo(mouse.x - 10, mouse.y + 10);
		this.ctx.lineTo(mouse.x + 10, mouse.y - 10);
		this.ctx.strokeStyle = mouse.color;
		this.ctx.stroke();
		this.ctx.beginPath();
		this.ctx.moveTo(mouse.x - 5, mouse.y);
		this.ctx.lineTo(mouse.x + 5, mouse.y);
		this.ctx.moveTo(mouse.x, mouse.y + 5);
		this.ctx.lineTo(mouse.x, mouse.y - 5);
		this.ctx.strokeStyle = mouse.secondaryColor;
		this.ctx.stroke();
	}
}

module.exports = MouseCross;
