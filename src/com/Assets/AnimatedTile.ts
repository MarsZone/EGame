module Assets {
	export class AnimatedTile {
		public constructor(id, length, speed, index) {
			this.startId = id;
            this.id = id;
            this.length = length;
            this.speed = speed;
            this.index = index;
            this.lastTime = 0;
		}
		startId;
		id;
		length;
		speed;
		index;
		lastTime;
		x;
		y;
		tick() {
            if((this.id - this.startId) < this.length - 1) {
                this.id += 1;
            } else {
                this.id = this.startId;
            }
        }

        animate(time) {
            if((time - this.lastTime) > this.speed) {
                this.tick();
                this.lastTime = time;
                return true;
            } else {
                return false;
            }
        }
	}
}