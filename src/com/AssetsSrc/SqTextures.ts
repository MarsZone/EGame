module Unit {
	/**
	 *
	 * @author mars
	 *
	 */
	export class SqTextures {
		public constructor() {
            
		}
		public static GetSQTexture():egret.MovieClip{
            var data = RES.getRes("SqTextures_json");
            var texture = RES.getRes("SqTextures_png");
            var mcDataFactory:egret.MovieClipDataFactory = new egret.MovieClipDataFactory(data, texture);
            var sqUnit:egret.MovieClip = new egret.MovieClip(mcDataFactory.generateMovieClipData("sqUnit"));
            //egret.MainContext.instance.stage.addChild(sqUnit);
            //sqUnit.gotoAndPlay(1,-1);
            return sqUnit;
		}
	}
}
