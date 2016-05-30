module Assets {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Role extends Assets.Entity{
    	public constructor() {
    	    super();
            this.init(0,"demo");
		}
        animiations:Array<Assets.Animation>;
        display:egret.Bitmap;
        textures:Array<egret.Texture>;
        
        init(id:number, kind:string):void{
            super.init(id,kind);
            this.id=id;
            this.kind=kind;
            var bigTexture:egret.Texture = RES.getRes("leatherarmor_png");
            var sps:egret.SpriteSheet  = new egret.SpriteSheet(bigTexture);
            var imgJson = RES.getRes("leatherarmor_json");
            for(var animate_json in imgJson.animations)
            {
                Main.debugView.addLog(""+animate_json);
                var animate:Assets.Animation = new Assets.RoleAnimation();
            }
        }
	}
}
