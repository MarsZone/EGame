module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Core extends egret.DisplayObjectContainer{
		public constructor(render:Content.Render) {
            super();
            this._render = render;
		}
        _render:Content.Render;
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
                this._render.update();
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
