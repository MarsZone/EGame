module Tools {
	/**
	 *
	 * @author Mars
	 *
	 */
	export class DebugView extends egret.Sprite{
        tf: egret.TextField;
        org_Ypos: number;
        MaxScrollV: number;
        LineHeightGap: number;
        CloseBtn: egret.Sprite;
    	public constructor() {
            super();
            this.touchEnabled = true;
		}
		init(w:number,h:number):void{
            this.drawBG(w,h);
            this.createCloseBtn();
            this.initTF();
		}
		createCloseBtn():void{
            //this.CloseBtn = Main.createBitmapByName("closeBtn_png");
            this.CloseBtn = new egret.Sprite();
            this.CloseBtn.graphics.lineStyle(5,0x000000,1);
            this.CloseBtn.graphics.moveTo(0,0);
            this.CloseBtn.graphics.lineTo(50,50);
            this.CloseBtn.graphics.moveTo(50,0);
            this.CloseBtn.graphics.lineTo(0,50);
            this.addChild(this.CloseBtn);
            this.CloseBtn.touchEnabled = true;
            this.CloseBtn.x = this.width - this.CloseBtn.width;
            this.CloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onCloseBtnClick,this);
		}
        onCloseBtnClick(e: egret.TouchEvent){
            this.visible = false;
         }
        drawBG(w:number,h:number): void { 
            this.graphics.beginFill(0x300bc4,0.5);
            this.graphics.drawRect(0,0,w,h);
            this.graphics.endFill();
        }
       
        initTF():void{
            this.tf = new egret.TextField();
            this.tf.touchEnabled = true;
            this.tf.size = 15;
            this.tf.height = Main.StageHeight;
            this.tf.width = Main.StageWidth - this.CloseBtn.width;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onTouchStartTF,this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onTouchMoveTF,this);
            this.addEventListener(egret.TouchEvent.TOUCH_END,this.onTouchEndTF,this);
            this.addChild(this.tf);
        }
        onTouchStartTF(event:egret.TouchEvent):void{
            this.org_Ypos = event.stageY;
            //console.log("Start");
            
        }
        onTouchMoveTF(event:egret.TouchEvent):void{
            var offsetY:number = event.stageY -this.org_Ypos;
            //console.log("Move");
            if(offsetY<0)
            { 
                var gap: number = Math.abs(offsetY);
                var count:number = parseInt((gap / this.LineHeightGap).toString())+this.tf.scrollV;
                if(count>this.MaxScrollV)
                { 
                    this.tf.scrollV = this.MaxScrollV;
                }else{
                    this.tf.scrollV = count;
                }
            }else{
                var gap: number = Math.abs(offsetY);
                var count:number = this.tf.scrollV - parseInt((gap / this.LineHeightGap).toString());
                if(count<1)
                { 
                    this.tf.scrollV = 1;
                }else{
                    this.tf.scrollV = count;
                }
            }
            
        }
        
        onTouchEndTF(event:egret.TouchEvent):void{
            
        }
        log(word:string,src:string ,onDisplay:boolean=false):void{
            //var dateTime: string = (new Date()).toDateString()+(new Date()).toTimeString();
            var dateTime: string = ""+(new Date()).getHours()+":"+(new Date()).getMinutes()+":"+(new Date()).getSeconds();
            console.log("["+src+"]: "+"["+dateTime+"]"+" "+word);
            if(onDisplay)
            {
                this.tf.appendText("["+src+"]: "+"["+dateTime+"]");
                this.tf.appendText(" "+word+"\n");
                this.LineHeightGap = this.tf.textHeight / this.tf.maxScrollV;
                this.tf.scrollV = parseInt(((this.tf.textHeight- Main.StageHeight) / this.LineHeightGap).toString()) ;
                this.MaxScrollV = this.tf.scrollV;
                
                if (this.tf.numLines>500)
                {
                   var firstLineEnd: number = this.tf.text.indexOf("\n")+1;
                   this.tf.text = this.tf.text.substring(firstLineEnd,this.tf.text.length);
                }
            }
            
        }
        
        toStringLog():void{
            console.log(this.tf.text.toString());
        }
	}
}
