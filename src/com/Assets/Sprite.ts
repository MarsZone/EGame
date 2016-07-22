module Assets {
	export class Sprite extends egret.Sprite{
		public constructor(name, scale=2) {
			super();
			this.name = name;
            this.scale = scale;
            this.isLoaded = false;
            this.offsetX = 0;
            this.offsetY = 0;
			this.loadJSON(name);
		}
		name;
		scale;
		isLoaded;
		offsetX;
		offsetY;
		id;
		imgPath;
		dataJson;
		animationData;
		image: egret.Texture;
		sps:egret.SpriteSheet;
		width;
		height;
		animations;
		loadJSON(name)
		{
			var imgPath = name+"_png";
			var dataPath = name+"_json";
			var dataJson = RES.getRes(dataPath);
			this.image = RES.getRes(imgPath);
			this.id = dataJson.id;
            this.animationData = dataJson.animations;
            this.width = dataJson.width;
            this.height = dataJson.height;
            this.offsetX = (dataJson.offset_x !== undefined) ? dataJson.offset_x : -16;
            this.offsetY = (dataJson.offset_y !== undefined) ? dataJson.offset_y : -16;
			this.sps = new egret.SpriteSheet(this.image);
		}
		createAnimations() {
            var animations = {};

            for(var name in this.animationData) {
                var a = this.animationData[name];
				//this.sps.createTexture(name,this.width,this.height);
				var textureArr:Array<egret.Texture>=new Array();
				for(var i=0;i<a.length;i++)
				{
					var startx=this.width * i * this.scale;
					var starty=this.height * a.row * this.scale;
					var textureWidth = this.width*this.scale;
					var textureHeight = this.height*this.scale;
					this.sps.createTexture(name+"_"+i,startx,starty,textureWidth,textureHeight);
					var texture:egret.Texture = this.sps.getTexture(name+"_"+i);
					textureArr.push(texture);
				}
                animations[name] = new Animation(name, a.length, a.row, this.width, this.height,textureArr);
            }
            return animations;
        }
		createSilhouette(){
			
		}
	}
}