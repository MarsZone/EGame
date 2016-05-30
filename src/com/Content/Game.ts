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
            //init view
            this.view = new Content.View();
            this.addChild(this.view);
            //init core
            this.core=new Content.Core(this.view);
            this.core.start();
        }
	}
}
