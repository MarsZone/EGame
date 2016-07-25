module Tools {
	export class Bubble {
		public constructor(id, element, time) {
			this.id = id;
            this.element = element;
            this.timer = new ETimer(5000, time);
		}
		id;
		element;
		timer;
        isOver(time) {
            if(this.timer.isOver(time)) {
                return true;
            }
            return false;
        }
        destroy() {
            //$(this.element).remove();
        }
        rese(time) {
            this.timer.lastTime = time;
        }
	}
	export class BubbleManager{
		public constructor(container){
			this.container = container;
            this.bubbles = {};
		}
		bubbles;;
		container;

		getBubbleById(id) {
            if(id in this.bubbles) {
                return this.bubbles[id];
            }
            return null;
        }

        create(id, message, time) {
            if(this.bubbles[id]) {
                this.bubbles[id].reset(time);
                //$("#"+id+" p").html(message);
            }
            else {
                //var el = $("<div id=\""+id+"\" class=\"bubble\"><p>"+message+"</p><div class=\"thingy\"></div></div>"); //.attr('id', id);
				var el = "id:"+id + message;//$("<div id=\""+id+"\" class=\"bubble\"><p>"+message+"</p><div class=\"thingy\"></div></div>");
                //$(el).appendTo(this.container);

                this.bubbles[id] = new Bubble(id, el, time);
            }
        }

        update(time) {
            var self = this,
                bubblesToDelete = [];

            _.each(this.bubbles, function(bubble:Tools.Bubble) {
                if(bubble.isOver(time)) {
                    bubble.destroy();
                    bubblesToDelete.push(bubble.id);
                }
            });

            _.each(bubblesToDelete, function(id) {
                delete self.bubbles[id];
            });
        }

        clean() {
            var self = this,
                bubblesToDelete = [];

            _.each(this.bubbles, function(bubble:Tools.Bubble) {
                bubble.destroy();
                bubblesToDelete.push(bubble.id);
            });

            _.each(bubblesToDelete, function(id) {
                delete self.bubbles[id];
            });

            this.bubbles = {};
        }

        destroyBubble(id) {
            var bubble = this.getBubbleById(id);

            if(bubble) {
                bubble.destroy();
                delete this.bubbles[id];
            }
        }

        forEachBubble(callback) {
            _.each(this.bubbles, function(bubble) {
                callback(bubble);
            });
        }
	}
}