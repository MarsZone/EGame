module Common {
	export class RegistView extends egret.Sprite{
		public constructor() {
			super();
			this.viewBG = Main.createBitmapByName("RegistPanel_png");
			this.addChild(this.viewBG);
			
			this.initBtn();
			this.initInputArea();
			this.addEvent();

			this.Uname=new egret.TextField();
			this.UPass=new egret.TextField();
			this.UPassConfirm = new egret.TextField();
			this.EmailText = new egret.TextField();
			this.initNormalTF(this.Uname);
			this.initPassTF(this.UPass);
			this.initPassTF(this.UPassConfirm);
			this.initNormalTF(this.EmailText);
			this.Uname.y = 220;
			this.UPass.y = 340;
			this.UPassConfirm.y = 460;
			this.EmailText.y = 570;
			
		}
		viewBG:egret.Bitmap;

		btnSubmit:BtnBase;
		btnCancel:BtnBase;

		Uname:egret.TextField;
		UPass:egret.TextField;
		UPassConfirm:egret.TextField;
		EmailText:egret.TextField;

		initPassTF(tf:egret.TextField){
			tf.textColor = 0xFF8216;
			tf.size = 35;
			tf.width =500;
			tf.height=80;
			tf.text ="";
			tf.inputType = egret.TextFieldInputType.PASSWORD;
			tf.type = egret.TextFieldType.INPUT;
			tf.displayAsPassword=true;
			tf.x = 310;
			this.addChild(tf);
		}
		initNormalTF(tf:egret.TextField){
			tf.textColor = 0xFF8216;
			tf.size = 35;
			tf.width =500;
			tf.height=100;
			tf.text ="";
			tf.inputType = egret.TextFieldInputType.TEXT;
			tf.type = egret.TextFieldType.INPUT;
			tf.x = 310;
			this.addChild(tf);
		}
		initBtn():void{
			this.btnSubmit = new BtnBase("Confirm_png");
			this.btnCancel = new BtnBase("CancelBtn_png");
			this.addbtn(this.btnSubmit);
			this.addbtn(this.btnCancel);
			this.btnSubmit.x = 150;
			this.btnCancel.x = this.width -this.btnCancel.width -100;
		}
		addbtn(btn:BtnBase):void{
			btn.scaleX = btn.scaleY =0.9;
			btn.touchEnabled=true;
			btn.y = this.height-btn.height -80;
			this.addChild(btn);
		}
		addEvent():void{
			this.btnSubmit.skin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.regist,this);
			this.btnCancel.skin.addEventListener(egret.TouchEvent.TOUCH_TAP,this.cancel,this);
		}
		// removeEvent(){
		// 	this.btnSubmit.skin.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.regist,this);
		// 	this.btnCancel.skin.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.cancel,this);
		// }
		regist(){
			var user=new Model.User();
			if(this.Uname&&this.UPass&&this.UPassConfirm)
			{
				if(this.UPass.text ===this.UPassConfirm.text)
				{
					user.setData(this.Uname.text,this.UPass.text,this.EmailText.text);
					Model.ModelBase.instance.user = user;
					this.dispatchEvent(new egret.Event("Regist"));
				}else{
					this.dispatchEvent(new egret.Event("InputError",false,false,"两次密码输入不同."));
				}
			}else{
				this.dispatchEvent(new egret.Event("InputError",false,false,"请输入全部信息,用户名，密码密码确认和邮箱."));
			}
		}
		cancel(){
			this.reset();
			this.visible=false;
		}
		initInputArea():void{

		}
		reset(){
			this.Uname.text="";
			this.EmailText.text="";
			this.UPass.text="";
			this.UPassConfirm.text="";
		}
		destroy(){
			
		}
	}
}