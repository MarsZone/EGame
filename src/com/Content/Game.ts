module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Game extends egret.Sprite{
		public constructor() {
            super();
            this.Init();
		}
        private core:Content.Core;
        private view:Content.View;
        Init():void{
            //交互区
            //顶层Bar
            this.view = new Content.View();
            this.core=new Content.Core(this.view);
            
            this.core.start();
            //底层Bar
        }
	}
}
