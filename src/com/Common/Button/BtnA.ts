module Common {
	export class BtnA extends egret.Sprite{
		bg:egret.Sprite;
		btnText:egret.TextField;
		maskSP:egret.Sprite;
		public constructor() {
			super();
			this.bg = new egret.Sprite();
			this.btnText = new egret.TextField();
			this.maskSP = new egret.Sprite();

			this.init();

			this.maskSP.graphics.beginFill(0x000000,0.8);
			this.maskSP.graphics.drawRect(0,0,150,35);
			this.maskSP.graphics.endFill();

			this.addChild(this.bg);
			this.addChild(this.btnText);
			this.addChild(this.maskSP);
			this.maskSP.visible=false;
		}
		init():void{
			this.bg.graphics.beginFill(0x666666,1);
			this.bg.graphics.drawRect(0,0,150,35);
			this.bg.graphics.endFill();
			this.bg.touchEnabled = true;
		}
		setText(txt:string,color?):void{			
			this.btnText.textColor = 0xCC9966;
			if(color){this.btnText.textColor=color;}
			this.btnText.size = 24;
			this.btnText.text = txt;
			this.btnText.x = this.bg.width /2 -this.btnText.width /2;
			this.btnText.y =5;
		}

		disable():void{
			this.maskSP.visible=true;
			this.bg.touchEnabled=false;
		}
		enable():void{
			this.maskSP.visible=false;
			this.bg.touchEnabled=true;
		}
	}
}