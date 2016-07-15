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
            //this.core.start();
        }
	}
}
