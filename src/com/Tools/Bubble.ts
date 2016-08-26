module Tools {
	export class Bubble extends egret.Sprite{
		public constructor(id, message, time) {
            super();
			this.id = id;
            this.message = message;
            this.backGround = new egret.Shape();
            this.textFile = new egret.TextField();
            this.textFile.size = 18;
            this.textFile.text = this.message;
            this.backGround.graphics.beginFill(0x666666,0.8);
            this.backGround.graphics.drawRect(0,0,this.textFile.textWidth+10,this.textFile.textHeight+5)
            this.backGround.graphics.endFill();
            this.addChild(this.backGround);
            this.addChild(this.textFile);
            this.timer = new ETimer(5000, time);
		}
		id;
        backGround:egret.Shape;
        textFile:egret.TextField;
		message;
		timer;
        isOver(time) {
            if(this.timer.isOver(time)) {
                return true;
            }
            return false;
        }
        destroy() {
            this.parent.removeChild(this);
            //$(this.element).remove();
        }
        reset(time) {
            this.timer.lastTime = time;
        }
	}
	export class BubbleManager{
		public constructor(container:egret.Sprite){
			this.container = container;
            this.bubbles = {};
		}
		bubbles;
		container:egret.Sprite;

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
				//var el = "id:"+id + message;
                var el =  message;
                //$("<div id=\""+id+"\" class=\"bubble\"><p>"+message+"</p><div class=\"thingy\"></div></div>");
                //$(el).appendTo(this.container);
                this.bubbles[id] = new Bubble(id, el, time);
                this.container.addChild(this.bubbles[id]);
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