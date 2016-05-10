module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Core extends egret.DisplayObjectContainer{
		public constructor(view:Content.View) {
            super();
            this._view = view;
		}
        _view:Content.View;
        private time:number = 0;
        
        start(){
            egret.startTick(this.update,this);
        }
        update(timeStamp:number):boolean{
            var now = timeStamp;
            var time = this.time;
            var pass = now - time;
            //console.log("moveStar: ",(1000 / pass).toFixed(5));
            this.time = now;
            this._view.update();
            return true;
        }
        pause(){
            
        }
        stop(){
            egret.stopTick(this.update,this);
        }
        reset(){
            
        }
	}
}
