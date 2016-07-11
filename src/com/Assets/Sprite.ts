module Assets {
	export class Sprite extends egret.Sprite{
		public constructor(name, scale=1) {
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
		image: egret.Texture
		width;
		height;
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

			this.createAnimations();
		}
		createAnimations() {
            var animations = {};

            for(var name in this.animationData) {
                var a = this.animationData[name];
                animations[name] = new Animation(name, a.length, a.row, this.width, this.height);
            }

            return animations;
        }
		createSilhouette(){
			
		}
	}
}