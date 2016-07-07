module Common {
	/**
	 *
	 * @author mars
	 *
	 */
	export class UI extends egret.Sprite{
		
    	public constructor() {
    		super();
			this.width = Main.StageWidth;
			this.height = Main.StageHeight;
			this.init();
		}
		arrow:egret.Sprite;
		init():void{
			//for test
			this.arrow=new egret.Sprite();
			this.arrow.addChild(Main.createBitmapByName("ic_keyboard_arrow_right_48px_png"));
			this.arrow.x=0;
			this.arrow.y = this.height-this.arrow.height;
			this.addChild(this.arrow);
			this.arrow.touchEnabled=true;
			this.arrow.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onArrowTouch,this);
		}
		onArrowTouch(e:egret.TouchEvent):void{
			Main.debugView.log("OnTouch");
			EGEvent.UIEventHandler.instance.dispatchEvent(new EGEvent.GameEvent(EGEvent.GameEvent.CHANGE));
		}
	}
}
