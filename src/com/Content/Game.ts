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
        render:Content.Render;
		public constructor(map:Gmap.Map,net:NetWork.Net) {
            super();
            this.map = map;
            this.net = net;
            this.Init();
		}
        sprites={};
        Init():void{
            //init view
            this.render = new Content.Render(this.map);
            this.addChild(this.render);
            //init core
            this.core=new Content.Core(this.render,this.map,this.net);
            //this.core.start();
        }
	}
}
