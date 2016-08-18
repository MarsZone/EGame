module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Game extends egret.Sprite{
        map:Gmap.Map;
        net:NetWork.Net;
        core:Content.Core;
        render:Render;
        public static GameLayerOffsetX=0;
        public static GameLayerOffsetY=0;
		public constructor(map:Gmap.Map,net:NetWork.Net) {
            super();
            this.map = map;
            this.net = net;
            this.Init();
		}
        sprites={};
        Init():void{
            //init view
            //init core
            this.render = new Content.Render(this.map);
            this.core=new Content.Core(this.render,this.map,this.net);
            this.addChild(this.render);
            Game.GameLayerOffsetX = (Main.StageWidth - this.render.camera.gridW *32)/2;
            Game.GameLayerOffsetY = (Main.StageHeight - this.render.camera.gridH *32)/2;
            this.render.x += Game.GameLayerOffsetX;
            this.render.y += Game.GameLayerOffsetY;
            //UI层
            var ui:Common.UI = new Common.UI();
            this.addChild(ui);
            //this.core.start();
        }
	}
}
