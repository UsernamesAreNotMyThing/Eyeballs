
/**
 * 
 * @param {number | string} value 
 * @param {number | string} min Minimum value
 * @param {number | string} max Maximum value
 */
function clamp(value, min, max) {
	if (value < min) return min;
	else if (value > max) return max;
	else return value;
}

class Eyeball {
	/**
	 * 
	 * @param {number} positionX 
	 * @param {number} positionY 
	 */
	constructor(positionX, positionY) {
		this.x = positionX;
		this.y = positionY;
		var element = document.createElement('div');
		element.className = 'eyes';
		element.innerHTML = "<div class = 'eye'><div class = 'ball'/></div>";
		element.style.left = `${(positionX - 120 / innerWidth) * 100}%`;
		element.style.top = `${positionY * 100}%`;
		document.body.appendChild(element);
		this.element = element.children[0].children[0];
		this.__busy = false;
	}
	/** @param {MouseEvent} event */
	update(event) {
		if (this.__busy) return;
		const angle = Math.atan2(event.clientY - innerHeight * this.y, event.clientX - innerWidth * this.x);
		const dist = Math.hypot(event.clientX - innerWidth * this.x, event.clientY - innerHeight * this.y);
		this.element.style.left = `${50 + clamp(dist, 0, 25) * Math.cos(angle)}%`;
		this.element.style.top = `${50 + clamp(dist, 0, 10) * Math.sin(angle)}%`;
	}
	roll() {
		if (this.__busy) return;
		this.__busy = true;
		let angle = 0;
		const f = () => {
			this.element.style.left = `${50 + 25 * Math.cos(angle)}%`;
			this.element.style.top = `${50 + 10 * Math.sin(angle)}%`;
			angle += 0.01745329251994329576923690768489/* <- Pi / 180 */ * 3;
			if (angle < 6.28) setTimeout(f, 10);
			else this.__busy = false;
		};
		setTimeout(f, 50);
	}
}

const balls = [new Eyeball(.5, .5)];

document.onmousemove = function (event) {
	balls.forEach(b => b.update(event));
};
document.oncontextmenu = function (event) {
	balls.push(new Eyeball(event.clientX / innerWidth, event.clientY / innerHeight));
}
document.onkeydown = function(event) {
	if (event.key == 'r' || event.key == 'R') {
		balls.forEach(b => b.roll());
	}
}