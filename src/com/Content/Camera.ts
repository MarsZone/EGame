module Content {
	export class Camera {
		public constructor(renderer:Content.Render) {
			this.renderer=renderer;
		}
		renderer:Content.Render;
		x=0;
		y=0;
		gridX=0;
		gridY=0;
		offset=0.5;
		gridW = 30;
		gridH = 14;
		rescale() {
            var factor = this.renderer.mobile ? 1 : 2;

            this.gridW = 15 * factor;
            this.gridH = 7 * factor;

            Main.debugView.log("---------");
            Main.debugView.log("Factor:"+factor);
            Main.debugView.log("W:"+this.gridW + " H:" + this.gridH);
        }
		public setPosition(x,y){
			this.x = x;
			this.y = y;
			this.gridX = Math.floor(x/32);
			this.gridY = Math.floor(y/32);
		}
		public setGridPosition(x,y):void{
			this.gridX = x;
			this.gridY = y;
			this.x = this.gridX *16;
			this.y = this.gridY *16;
		}
		public lookAt(entity) {
            var r = this.renderer,
                x = Math.round( entity.x - (Math.floor(this.gridW / 2) * r.tilesize) ),
                y = Math.round( entity.y - (Math.floor(this.gridH / 2) * r.tilesize) );
            this.setPosition(x, y);
        }
		public forEachVisiblePosition(callback, extra) {
            var extra = extra || 0;
			for(var y=this.gridY-extra, maxY=this.gridY+this.gridH+(extra*2); y < maxY; y += 1) {
                for(var x=this.gridX-extra, maxX=this.gridX+this.gridW+(extra*2); x < maxX; x += 1) {
                    callback(x, y);
                }
            }
        }

		public isVisible(entity) {
            return this.isVisiblePosition(entity.gridX, entity.gridY);
        }

		public isVisiblePosition(x, y) {
            if(y >= this.gridY && y < this.gridY + this.gridH
            && x >= this.gridX && x < this.gridX + this.gridW) {
                return true;
            } else {
                return false;
            }
        }

		focusEntity(entity) {
            var w = this.gridW - 2,
                h = this.gridH - 2,
                x = Math.floor((entity.gridX - 1) / w) * w,
                y = Math.floor((entity.gridY - 1) / h) * h;
            this.setGridPosition(x, y);
        }
	}
}