module Common {
	export class LoginView extends egret.Sprite{
		core:Content.Core;
		ui:Common.UI;
		public constructor(core,ui) {
			super();
			this.core = core;
			this.ui = ui;
			this.init();
		}
		
		bitmap:egret.Bitmap;
		loginPanel:egret.Sprite;

		UnameText:egret.TextField;
		UpassText:egret.TextField;
		EmailText:egret.TextField;
		emailbg:egret.Shape;

		ReturnText:egret.TextField;
		init():void{
			this.loadBG();
		}
		bta:BtnA;
		btcreate:BtnA;
		btnSubmit:BtnA;
		btnBackLogin:BtnA;
		resLogText:egret.TextField;
		
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

			this.resLogText = new egret.TextField();
			this.resLogText.x = this.loginPanel.x-20;
			this.resLogText.y = this.loginPanel.y+this.loginPanel.height+50;
			this.resLogText.width= 400;
			this.resLogText.height = 300;
			this.resLogText.multiline=true;
			this.resLogText.text="Demo版本，不要介意各种BUG。";
			this.resLogText.textColor=0xFF4930;
			this.addChild(this.resLogText);


			this.initBtn();
			this.initTextInput();
			this.addEvent();
		}
		layTxBg(tx:egret.TextField):egret.Shape {
			var shp:egret.Shape = new egret.Shape;
			shp.graphics.beginFill(0x0099CC);
			shp.graphics.drawRect(tx.x-tx.width/2, tx.y, tx.width*2, tx.height);
			shp.graphics.endFill();
			this.loginPanel.addChild(shp);
			return shp;
		}
		IntrolText(txt:string,x,y){
			var text:egret.TextField = new egret.TextField();
			text.text=txt;
			text.x = x;
			text.y = y;
			this.loginPanel.addChild(text);
		}
		EmailTextIntrol:egret.TextField;
		initTextInput(){
			this.UnameText = new egret.TextField();
			this.UpassText = new egret.TextField();
			this.EmailText = new egret.TextField();
			this.UnameText.inputType = egret.TextFieldInputType.TEXT;
			this.UnameText.text = "";
			this.UpassText.inputType = egret.TextFieldInputType.PASSWORD;
			this.UpassText.text = "";
			this.UpassText.width=120;
			this.EmailText.inputType = egret.TextFieldInputType.TEXT;
			this.EmailText.text = "";

			this.UnameText.type = egret.TextFieldType.INPUT;
			this.UpassText.type = egret.TextFieldType.INPUT;
			this.EmailText.type = egret.TextFieldType.INPUT;

			this.UnameText.x = this.loginPanel.width/2 - this.UnameText.width/2+40;
			this.UpassText.x = this.loginPanel.width/2 - this.UpassText.width/2+40;
			this.EmailText.x = this.loginPanel.width/2 - this.EmailText.width/2+40;

			this.UnameText.y = 10;
			this.UpassText.y = 45;
			this.EmailText.y = 80;
			this.layTxBg(this.UnameText);
			this.layTxBg(this.UpassText);
			this.emailbg = this.layTxBg(this.EmailText);
			
			this.loginPanel.addChild(this.UnameText);
			this.loginPanel.addChild(this.UpassText);
			this.loginPanel.addChild(this.EmailText);
			this.IntrolText("用户名:",15,this.UnameText.y);
			this.IntrolText("密码:",15,this.UpassText.y);
			this.EmailTextIntrol = new egret.TextField();
			this.EmailTextIntrol.text="Email:";
			this.EmailTextIntrol.x = 15;
			this.EmailTextIntrol.y = this.EmailText.y;
			this.loginPanel.addChild(this.EmailTextIntrol);
			this.showEmail(false);
		}
		showEmail(flag:boolean):void{
			this.EmailText.visible=flag;
			this.emailbg.visible=flag;
			this.EmailTextIntrol.visible =flag;
		}
		initBtn(){
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
		}
		addEvent(){
			this.bta.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnTouch,this);
			this.btnSubmit.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.submitCreate,this);
			this.btcreate.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.createBtnTouched,this);
			this.btnBackLogin.bg.addEventListener(egret.TouchEvent.TOUCH_TAP,this.backLogin,this);
		}
		removeEvent(){
			this.bta.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnTouch,this);
			this.btnSubmit.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.submitCreate,this);
			this.btcreate.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.createBtnTouched,this);
			this.btnBackLogin.bg.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.backLogin,this);
		}
		loginBtnTouch(e):void{
			var user=new Model.User();
            user.setData(this.UnameText.text,this.UpassText.text);
            Model.ModelBase.instance.user = user;
			this.core.connect("login",this);
		}
		submitCreate():void{
			var user=new Model.User();
            user.setData(this.UnameText.text,this.UpassText.text,this.EmailText.text);
            Model.ModelBase.instance.user = user;
			this.core.connect("create",this);
		}
		createBtnTouched(e):void{
			this.bta.visible=false;
			this.btnSubmit.visible=true;
			this.btcreate.visible=false;
			this.btnBackLogin.visible=true;
			this.showEmail(true);
		}
		backLogin(e):void{
			this.bta.visible=true;
			this.btnSubmit.visible=false;
			this.btcreate.visible=true;
			this.btnBackLogin.visible=false;
			this.showEmail(false);
		}
		hide():void{
			this.visible=false;
		}
		started_callback(result){
			if(result.success === true) {
			//this.start();
			this.removeEvent();
			this.hide();
			this.ui.drawScreenMask();
			} else {
				//self.setPlayButtonState(true);
				switch(result.reason) {
					case 'invalidlogin':
						// Login information was not correct (either username or password)
						//self.addValidationError(null, 'The username or password you entered is incorrect.');
						this.resLogText.text = 'The username or password you entered is incorrect.';
						break;
					case 'userexists':
						// Attempted to create a new user, but the username was taken
						//self.addValidationError(self.getUsernameField(), 'The username you entered is not available.');
						this.resLogText.text = 'The username you entered is not available.';
						break;
					case 'invalidusername':
						// The username contains characters that are not allowed (rejected by the sanitizer)
						//self.addValidationError(self.getUsernameField(), 'The username you entered contains invalid characters.');
						this.resLogText.text = 'The username you entered contains invalid characters.';
						break;
					case 'loggedin':
						// Attempted to log in with the same user multiple times simultaneously
						//self.addValidationError(self.getUsernameField(), 'A player with the specified username is already logged in.');
						this.resLogText.text = 'A player with the specified username is already logged in.';
						break;
					default:
						//self.addValidationError(null, 'Failed to launch the game: ' + (result.reason ? result.reason : '(reason unknown)'));
						this.resLogText.text = 'Failed to launch the game: ' + (result.reason ? result.reason : '(reason unknown)');
						break;
				}
				Main.debugView.log("started_callback:"+result,"LoginView");
			}
        }
	}
}