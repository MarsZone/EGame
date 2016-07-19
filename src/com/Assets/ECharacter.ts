module Assets {
	/**
	 *
	 * @author mars
	 *
	 */
    export class ECharacter extends Common.Entity {
        public static BitMapSize=64;
        public static FramesNextTexture=5;
        public constructor(id:string,kind:string) {
            super(id,kind);
            this.init(id,kind);
        }
        animations: Array<Assets.EAnimation>;
        textures: Array<egret.Texture>;
        display: egret.Bitmap;
        bigTexture: egret.Texture
        sprites: egret.SpriteSheet;
        ifLeft:boolean=false;
        curAnimation:string="";

        init(id: string, kind: string): void {
            super.init(id, kind);
            this.id = id;
            this.kind = kind;
            this.display=new egret.Bitmap();
            
            var imgPath = id+"_png";
            var dataPath = id+"_json";
            //set Texture
            this.bigTexture = RES.getRes(imgPath);
            this.sprites= new egret.SpriteSheet(this.bigTexture);
            
            //load json
            var imgJson = RES.getRes(dataPath);

            //init array
            this.animations = new Array<Assets.EAnimation>();
            this.textures = new Array<egret.Texture>();

            //add all animation To animations
            for (var animate_json in imgJson.animations) {
                //Main.debugView.addLog(animate_json, "Role");
                var ob = imgJson.animations[animate_json];
                var animate: Assets.EAnimation = new Assets.RoleAnimation();
                animate.init(animate_json, ob.length, ob.row, ECharacter.BitMapSize, ECharacter.BitMapSize);
                this.animations.push(animate);
            }
            
            //create textures from SpriteSheet
            var bitGridRol:number = this.bigTexture.$getTextureHeight()/ECharacter.BitMapSize;
            var bitGridCow:number = this.bigTexture.$getTextureWidth()/ECharacter.BitMapSize;
            for(var i=0;i<bitGridRol;i++)
            {
                for(var k=0;k<bitGridCow;k++)
                {
                    var name = i+"_"+k;
                    var bity=i*ECharacter.BitMapSize;
                    var bitx=k*ECharacter.BitMapSize;
                    this.sprites.createTexture(name,bitx,bity,ECharacter.BitMapSize,ECharacter.BitMapSize);
                }
            }
            
            //set cur Animation
            this.setCurAnimation("idle_down");
            //this.setTrunLeft(true);
            //add bitmap
            //this.addChild(this.display);
            
        }
        setCurAnimation(animation,flag=false):void{
            this.curAnimation = animation;
            this.setDisplayTexture(this.getCurAnimationTexture());
            this.setTrunLeft(flag);
            //this.resetAnimation();
        }
        resetAnimation():void{
            var clip:Assets.EAnimation = this.getClip(this.curAnimation);
            clip.currentFrame=0;
            clip.lastCallCounter=0;
        }
        getClip(animation):Assets.EAnimation{
            //Find Clip
            for(var clip of this.animations)
            {
                if(clip.name == this.curAnimation)
                {
                    return clip;
                }
            }
            return;
        }
        setDisplayTexture(curTexture):void{
            this.display.texture = curTexture;
            if(this.ifLeft)
            {
                this.display.scaleX=-1;
                this.display.x =64;
            }else{
                this.display.scaleX=1;
                this.display.x =0;
            }
        }
        getCurAnimationTexture():egret.Texture{
            var clip:Assets.EAnimation = this.getClip(this.curAnimation);
            var index = clip.row+"_"+clip.currentFrame;
            try {
                return this.sprites.getTexture(index);
            } catch (error) {
                Main.debugView.log("Get Texture fail.","Role:"+clip.name);
            }
        }
        setTrunLeft(flag):void{
            this.ifLeft=flag;
        }
        update():void{
            if(this.curAnimation!="")
            {
                var clip:Assets.EAnimation = this.getClip(this.curAnimation);
                if(clip.lastCallCounter>=ECharacter.FramesNextTexture)
                {
                    clip.currentFrame += 1;
                    if(clip.currentFrame>=clip.length)
                    {
                        clip.currentFrame=0;
                    }
                    this.setDisplayTexture(this.getCurAnimationTexture());
                    clip.lastCallCounter=0;
                }else{
                    clip.lastCallCounter++;
                }
            }
        }
    }
}
