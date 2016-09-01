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
		
		bitmapBG:egret.Bitmap;
		inputArea:egret.Bitmap;
		loginPanel:egret.Sprite;
		registerView:RegistView;

		UnameText:egret.TextField;
		UpassText:egret.TextField;

		ReturnText:egret.TextField;
		init():void{
			this.loadBG();
		}
		btnLogin:BtnBase;
		btncreate:BtnBase;
		resLogText:egret.TextField;
		
		loadBG():void{
			this.bitmapBG =Main.createBitmapByName("BackGround_png");
			this.bitmapBG.width = Main.StageWidth;
			this.bitmapBG.height = Main.StageHeight;
			this.addChild(this.bitmapBG);

			this.loginPanel = new egret.Sprite();
			this.loginPanel.graphics.beginFill(0x000000,0);
			this.loginPanel.graphics.drawRoundRect(0,0,360,180,20,20);
			this.loginPanel.graphics.endFill();
			this.loginPanel.x = Main.StageWidth /2 -this.loginPanel.width - Main.StageWidth / 9;
			this.loginPanel.y = Main.StageHeight /2 -this.loginPanel.height/3;
			this.addChild(this.loginPanel);

			this.inputArea = Main.createBitmapByName("InputArea_png");
			this.inputArea.x +=70;
			this.inputArea.scaleX = this.inputArea.scaleY = 0.5;
			this.loginPanel.addChild(this.inputArea);

			this.resLogText = new egret.TextField();
			this.resLogText.x = 0;
			this.resLogText.y = 0;
			this.resLogText.width= 600;
			this.resLogText.height = 300;
			this.resLogText.multiline=true;
			this.resLogText.text="Demo版本，不要介意各种BUG。";
			this.resLogText.textColor=0xFF4930;
			this.addChild(this.resLogText);
			
			this.initBtn();
			this.initTextInput();

			this.registerView = new RegistView();
			this.registerView.scaleX = this.registerView.scaleY =0.5;
			this.registerView.x = 250;
			this.registerView.y = 50;
			this.addChild(this.registerView);
			this.showRegistView(false);

			this.addEvent();
		}
		initTextInput(){
			this.UnameText = new egret.TextField();
			this.UpassText = new egret.TextField();
			
			this.UnameText.inputType = egret.TextFieldInputType.TEXT;
			this.UnameText.text = "请输入用户名";
			this.UpassText.inputType = egret.TextFieldInputType.PASSWORD;
			this.UpassText.text = "";

			this.UnameText.type = egret.TextFieldType.INPUT;
			this.UpassText.type = egret.TextFieldType.INPUT;
			this.UpassText.displayAsPassword=true;
			this.UpassText.width = 250;
			this.UnameText.width = 250;
			this.UnameText.textColor = 0x000000;
			this.UpassText.textColor = 0x000000;
			this.UnameText.size=25;
			this.UpassText.size=25;
			
			this.UnameText.x = this.loginPanel.width/2 - this.UnameText.width/2+40;
			this.UpassText.x = this.loginPanel.width/2 - this.UpassText.width/2+40;
			
			this.UnameText.y = 10;
			this.UpassText.y = 65;
			
			this.loginPanel.addChild(this.UnameText);
			this.loginPanel.addChild(this.UpassText);
		}
		showRegistView(flag:boolean):void{
			this.registerView.visible=flag;
		}
		initBtn(){
			this.btnLogin = new BtnBase("LoginBtn_png");
			this.btnLogin.scaleX = this.btnLogin.scaleY =0.4;
			this.btncreate = new BtnBase("Regist_png");
			this.btncreate.scaleX = this.btncreate.scaleY =0.4;
			this.btnLogin.touchEnabled=true;
			this.btncreate.touchEnabled=true;

			this.btnLogin.x =100;
			this.btncreate.x = 250;
			this.btnLogin.y =120;
			this.btncreate.y =120;
			this.loginPanel.addChild(this.btnLogin);
			this.loginPanel.addChild(this.btncreate);
		}
		addEvent(){
			this.btnLogin.skin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnTouch,this);
			this.btncreate.skin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.createBtnTouched,this);
			this.registerView.addEventListener("Regist",this.accountCreate,this);
			this.registerView.addEventListener("InputError",this.registInputError,this);
		}
		// removeEvent(){
		// 	this.btnLogin.skin.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.loginBtnTouch,this);
		// 	this.btncreate.skin.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.createBtnTouched,this);
		// 	this.registerView.removeEventListener("Regist",this.accountCreate,this)
		// }
		loginBtnTouch(e):void{
			var user=new Model.User();
            user.setData(this.UnameText.text,this.UpassText.text);
            Model.ModelBase.instance.user = user;
			this.core.connect("login",this);
		}
		registInputError(e:egret.Event):void{
			this.resLogText.text = '错误：'+e.data;
		}
		accountCreate():void{
			this.core.connect("create",this);
		}
		createBtnTouched(e):void{
			this.showRegistView(true);
		}
		backLogin(e):void{
			this.showRegistView(false);
		}
		hide():void{
			this.showRegistView(false);
			this.visible=false;
		}
		started_callback(result){
			if(result.success === true) {
			//this.start();
			//this.removeEvent();
			this.ui.drawScreenMask();
			this.hide();
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