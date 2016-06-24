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
        private render:Content.Render;
        Init():void{
            //init view
            this.render = new Content.Render();
            this.addChild(this.render);
            //init core
            this.core=new Content.Core(this.render);
            this.core.start();
        }
	}
}
