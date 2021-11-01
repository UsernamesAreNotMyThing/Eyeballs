/**
 * @param {number | string}	value	Clamp this between  `min` and `max`
 * @param {number | string}	min		Minimum value
 * @param {number | string}	max		Maximum value
 * @returns {number | string}	Clamped value between `min` and `max`
 */
function clamp(value, min, max) {
	if (value < min) return min;
	else if (value > max) return max;
	else return value;
}

class Eyeball {
	/**
	 * 
	 * @param {number | {x: number; y: number}} positionX + For `Number`: Starting X position (1.0 = 100% of `window.innerWidth`)
	 * @param {number} positionY Starting Y position (1.0 = 100% of `window.innerHeight`)
	 */
	constructor(positionX, positionY) {
		/** @type Number*/
		this.x = typeof positionX == 'number' ? positionX : positionX.x;
		/** @type Number*/
		this.y = typeof positionX == 'number' ? positionY : positionX.y;
		var element = document.createElement('div');
		element.className = 'eyes';
		element.innerHTML = "<div class = 'eye'><div class = 'ball'/></div>";
		element.style.left = `${(positionX - 120 / innerWidth) * 100}%`;
		element.style.top = `${positionY * 100}%`;
		document.body.appendChild(element);
		/** The pupil
		 * @type HTMLElement
		 */
		this.element = element.children[0].children[0];
		/** @type boolean */
		this.__busy = false;
	}
	/** Adjusts the pupil's position to "look" at the cursor
	 * @param {MouseEvent} event
	 */
	update(event) {
		if (this.__busy) return;
		const angle = Math.atan2(event.clientY - innerHeight * this.y, event.clientX - innerWidth * this.x);
		const dist = Math.hypot(event.clientX - innerWidth * this.x, event.clientY - innerHeight * this.y);
		this.element.style.left = `${50 + clamp(dist, 0, 25) * Math.cos(angle)}%`;
		this.element.style.top = `${50 + clamp(dist, 0, 10) * Math.sin(angle)}%`;
	}
	/** initiates the "eye-roll" animation */
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
	rollHorizontal() {
		if (this.__busy) return;
		this.__busy = true;
		let offset = 0;
		this.element.style.top = '50%';
		const f = () => {
			this.element.style.left = `${50 + 25 * Math.cos(offset / 57.296)}%`;
			if ((offset += 3) < 360) setTimeout(f, 50);
			else this.__busy = false;
		}; setTimeout(f, 50);
	}
	/** Initiates the blinking animation */
	blink() {
		if (this.__busy) return;
		this.__busy = true;
		let step = 0;
		const f = () => {
			step++;
			const a = step <= 25 ? step * 2 : 100 - step * 2;
			const b = step <= 25 ? 100 - 2 * step : step * 2;
			this.element.parentElement.style['-webkit-mask-image'] = `linear-gradient(#00000000 ${a}%, white ${a}%, white ${b}%, #00000000 ${b}%)`;
			if (step < 50) setTimeout(f, 50);
			else this.__busy = false;
		};
		setTimeout(f, 50);
	}
	get busy() {
		return this.__busy;
	}
	get position() {
		return {x: this.x, y: this.y};
	}
	/** @param value Should have `x` and `y` properties */
	set position(value) {
		if (value == null || value.x == undefined || value.y == undefined) return;
		this.x = value.x;
		this.y = value.y;
		this.element.parentElement.style.left = this.x;
	}
	get style() {
		return this.element.style;
	}
}
/** @type Eyeball[] */
const balls = [];
balls.roll = function() {
	this.forEach(i => i.roll());
}
/**
 * @param {MouseEvent} event
 * @type {(MouseEvent) => void}
*/
balls.update = function(event) {
	this.forEach(i => i.update(event));
}
/**
 * @type {() => void}
 * @param {KeyboardEvent} event 
 */
balls.rollHorizontal = function(event) {
	this.forEach(i => i.rollHorizontal(event));
}
balls.blink = function() {
	this.forEach(i => i.blink());
}

document.onmousemove = function (event) {
	balls.update(event);
};
document.onclick = function (event) {
	balls.push(new Eyeball(event.clientX / innerWidth, event.clientY / innerHeight));
	document.getElementById('empty-message').style.display = 'none';
}
document.onkeydown = function(event) {
	switch (event.key) {
		case 'r':
		case 'R':
			balls.roll();
			break;
		case 's':
		case 'S':
			balls.rollHorizontal();
			break;
		case 'b':
		case 'B':
			balls.blink();
	}
}