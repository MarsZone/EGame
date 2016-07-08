module Content {
	export class InfoManager extends egret.EventDispatcher{
		public constructor(game) {
			super();
			 this.game = game;
            this.infos = {};
            this.destroyQueue = [];
		}
		game;
		infos;
		destroyQueue;
		addDamageInfo(value, x, y, type, duration){
			var time = this.game.currentTime,
                id = time+""+(isNaN(value*1)?value:value*1)+""+x+""+y,
                self = this,
                info = new HoveringInfo(id, value, x, y, (duration)?duration:1000, type);

            info.onDestroy(function(id) {
                self.destroyQueue.push(id);
            });
            this.infos[id] = info;
		}
		forEachInfo(callback) {
            var self = this;

            _.each(this.infos, function(info, id) {
                callback(info);
            });
        }
		update(time) {
            var self = this;

            this.forEachInfo(function(info) {
                info.update(time);
            });

            _.each(this.destroyQueue, function(id:any) {
                delete self.infos[id];
            });
            this.destroyQueue = [];
        }
	}

	export var damageInfoColors = {
        "received": {
            fill: "rgb(255, 50, 50)",
            stroke: "rgb(255, 180, 180)"
        },
        "inflicted": {
            fill: "white",
            stroke: "#373737"
        },
        "healed": {
            fill: "rgb(80, 255, 80)",
            stroke: "rgb(50, 120, 50)"
         },
        "health": {
            fill: "white",
            stroke: "#373737"
        },
        "exp": {
            fill: "rgb(80, 80, 255)",
            stroke: "rgb(50, 50, 255)"
       }
    };

	export class HoveringInfo{
		public constructor(id, value, x, y, duration, type) {
			this.id = id;
            this.value = value;
            this.duration = duration;
            this.x = x;
            this.y = y;
            this.opacity = 1.0;
            this.lastTime = 0;
            this.speed = 100;
            this.fillColor = damageInfoColors[type].fill;
            this.strokeColor = damageInfoColors[type].stroke;
		}
        DURATIO= 1000;
		id;
		value;
		x;
		y;
		duration;
		opacity;
		lastTime;
		speed;
		fillColor;
		strokeColor;
		type;
		destroy_callback;
        isTimeToAnimate(time) {
            return (time - this.lastTime) > this.speed;
        }

        update(time) {
            if(this.isTimeToAnimate(time)) {
                this.lastTime = time;
                this.tick();
            }
        }

        tick() {
            if(this.type !== 'health') this.y -= 1;
            this.opacity -= (70/this.duration);
            if(this.opacity < 0) {
                this.destroy();
            }
        }

        onDestroy(callback) {
            this.destroy_callback = callback;
        }

        destroy() {
            if(this.destroy_callback) {
                this.destroy_callback(this.id);
            }
        }
    }
}