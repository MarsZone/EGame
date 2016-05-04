module Content {
	/**
	 *
	 * @author 
	 *
	 */
	export class View extends egret.Sprite{
		public constructor() {
            super();
            this.Init();
		}
        private core:Content.Core;
        
        Init():void{
            //交互区
            this.Test();
            //顶层Bar
            this.core=new Content.Core();
            //this.core.start();
            
            //底层Bar
            
        }
        //circle: egret.Sprite;

        sqGroup: egret.Sprite;
        sqArray: Array<egret.MovieClip>;
        
        GroupLayer: egret.Sprite;
        timer: egret.Timer;
		Test():void{
//            this.circle = new egret.Sprite;
//            this.circle.graphics.beginFill(0x111111,1);
            var sqt: egret.MovieClip = Unit.SqTextures.GetSQTexture();                        
//            this.circle.graphics.drawCircle(sqt.width*2.5,sqt.height*2.5,sqt.width*2.5);
//            this.circle.graphics.endFill();
//            this.addChild(this.circle);
    	    
            this.sqGroup = new egret.Sprite;
            this.sqArray = new Array<egret.MovieClip>();
            this.GroupLayer = new egret.Sprite;
            this.addChild(this.GroupLayer);
            this.GroupLayer.addChild(this.sqGroup);
            var row: number = 10;
            var col: number = 7;
            for(var i: number = 0;i < row;i++){
                for(var j: number = 0;j < col;j++){
                    var sq: egret.MovieClip = Unit.SqTextures.GetSQTexture();
                    var k: number = parseInt(Math.random() * 7+1+"");
                    Main.debugView.addLog("Random Number:"+k);
                    sq.gotoAndStop(k);
                    sq.x = j * sq.width;
                    sq.y = i * sq.height;
                    this.sqGroup.addChild(sq);
                    this.sqArray.push(sq);
                }
            }
            //this.sqGroup.$setWidth(Main.StageWidth);
            //this.sqGroup.$setHeight(Main.StageHeight);
            //this.sqGroup.scaleX = this.sqGroup.scaleY = Main.StageHeight/Main.StageWidth;
		}
	}
}
