module Content {
	/**
	 *
	 * @author 
	 *
	 */
	export class Core extends egret.DisplayObjectContainer{
		
    	public constructor() {
            super();
		}
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
	//GitHub Test From Server
}
