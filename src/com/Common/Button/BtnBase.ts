module Common {
	export class BtnBase extends egret.Sprite{
		skin:egret.Bitmap;
		skinName;
		maskSP:egret.Sprite;
		public constructor(sn) {
			super();
			this.skinName = sn;
			this.init();
		}
		init():void{
			this.skin = Main.createBitmapByName(this.skinName);
			this.maskSP = new egret.Sprite();
			this.maskSP.graphics.beginFill(0x000000,0.8);
			this.maskSP.graphics.drawRect(0,0,this.skin.width,this.skin.height);
			this.maskSP.graphics.endFill();

			this.addChild(this.skin);
			this.addChild(this.maskSP);
			this.maskSP.visible=false;
			this.skin.touchEnabled=true;
		}

		disable():void{
			this.maskSP.visible=true;
			this.skin.touchEnabled=false;
		}
		enable():void{
			this.maskSP.visible=false;
			this.skin.touchEnabled=true;
		}
	}
}