module Common {
	/**
	 *
	 * @author mars
	 *
	 */
	export class UI extends egret.Sprite{
    	public loginView:LoginView;
		public constructor() {
    		super();
			this.width = Main.StageWidth;
			this.height = Main.StageHeight;
			this.init();
		}
		arrow:egret.Sprite;
		init():void{
			this.loginView = new LoginView();
			this.addChild(this.loginView);
			//this.drawScreenMask();
		}
		downMask:egret.Sprite;
		upMask:egret.Sprite;
		drawScreenMask():void{
			this.upMask = new egret.Sprite();
			this.downMask = new egret.Sprite();
			this.initMask(this.upMask);
			this.initMask(this.downMask);
			this.downMask.y = Number(Main.StageHeight - Content.Game.GameLayerOffsetY);
		}
		initMask(sp:egret.Sprite):void{
			this.addChild(sp);
			sp.graphics.beginFill(0x424242,1);
			sp.graphics.drawRect(0,0,Main.StageWidth,Content.Game.GameLayerOffsetY);
			sp.graphics.endFill();
		}
		onArrowTouch(e:egret.TouchEvent):void{
			Main.debugView.log("OnTouch","UI");
			EGEvent.UIEventHandler.instance.dispatchEvent(new EGEvent.GameEvent(EGEvent.GameEvent.CHANGE));
		}
	}
}
