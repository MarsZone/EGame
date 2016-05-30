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
        index=0;
        frameControler:boolean=true;
        private time:number = 0;
        
        start(){
            egret.startTick(this.update,this);
        }
        update(timeStamp:number):boolean{
            var now = timeStamp;
            var time = this.time;
            var pass = now - time;
            //console.log("moveStar: ",(1000 / pass).toFixed(5));
            //Main.debugView.addLog("moveStar: "+(1000 / pass).toFixed(5)+"_index"+this.index,"Core");
            this.time = now;
            //Every 30 frame.update.
            if(this.frameControler)
            {
                this._view.update();
            }
            this.frameControler=!this.frameControler;
            this.index++;
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
