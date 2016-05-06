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
            //this.Test();
            //顶层Bar
            this.core=new Content.Core();
            //this.core.start();
            
            //底层Bar
            
        }
        //circle: egret.Sprite;
	}
}
