module Common {
	export class LoginView extends egret.Sprite{
		public constructor() {
			super();
			this.init();
		}
		bitmap:egret.Bitmap;
		loginPanel:egret.Sprite;

		UnameText:egret.TextField;
		UpassText:egret.TextField;
		EmailText:egret.TextField;

		ReturnText:egret.TextField;
		init():void{
			this.loadBG();
		}
		bta:BtnA;
		btcreate:BtnA;

		btnSubmit:BtnA;
		btnBackLogin:BtnA;
		loadBG():void{
			this.bitmap =Main.createBitmapByName("login_bg_jpg");
			this.bitmap.width = Main.StageWidth;
			this.bitmap.height = Main.StageHeight;
			this.addChild(this.bitmap);

			this.loginPanel = new egret.Sprite();
			//this.loginPanel.graphics.beginFill(0x006699,0.7);
			this.loginPanel.graphics.beginFill(0x000000,0.7);
			this.loginPanel.graphics.drawRoundRect(0,0,350,160,20,20);
			this.loginPanel.graphics.endFill();
			this.loginPanel.x = Main.StageWidth /2 -this.loginPanel.width/2;
			this.loginPanel.y = Main.StageHeight /2 -this.loginPanel.height/2;
			this.addChild(this.loginPanel);

			this.bta= new BtnA();
			this.bta.setText("登 陆",0xCCEE1C);
			this.loginPanel.addChild(this.bta);
			this.bta.y = this.loginPanel.height - this.bta.height-5;
			this.bta.x =5;

			this.btnSubmit= new BtnA();
			this.btnSubmit.setText("注 册",0xCCEE1C);
			this.loginPanel.addChild(this.btnSubmit);
			this.btnSubmit.y = this.loginPanel.height - this.btnSubmit.height-5;
			this.btnSubmit.x =5;
			this.btnSubmit.visible=false;

			this.btcreate = new BtnA();
			this.btcreate.setText("创建角色",0xCCA126);
			this.loginPanel.addChild(this.btcreate);
			this.btcreate.y = this.loginPanel.height - this.btcreate.height-5;
			this.btcreate.x = this.loginPanel.width - this.btcreate.width -5;
			

			this.btnBackLogin = new BtnA();
			this.btnBackLogin.setText("返回创建",0xCCA126);
			this.loginPanel.addChild(this.btnBackLogin);
			this.btnBackLogin.y = this.loginPanel.height - this.btnBackLogin.height-5;
			this.btnBackLogin.x = this.loginPanel.width - this.btnBackLogin.width -5;
			this.btnBackLogin.visible=false;

			//this.bta.disable();
			//this.btcreate.disable();
			this.addEvent();
		}
		addEvent(){
			this.bta.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnTouch,this);
			this.btcreate.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.createBtnTouched,this);
			this.btnBackLogin.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backLogin,this);
		}
		removeEvent(){
			this.bta.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnTouch,this);
			this.btcreate.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.createBtnTouched,this);
			this.btnBackLogin.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.backLogin,this);
		}
		loginBtnTouch(e):void{

		}
		createBtnTouched(e):void{
			this.bta.visible=false;
			this.btnSubmit.visible=true;
			this.btcreate.visible=false;
			this.btnBackLogin.visible=true;


		}
		backLogin(e):void{
			this.bta.visible=true;
			this.btnSubmit.visible=false;
			this.btcreate.visible=true;
			this.btnBackLogin.visible=false;


		}
	}
}