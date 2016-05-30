var Assets;
(function (Assets) {
    /**
     *
     * @author mars
     *
     */
    var Role = (function (_super) {
        __extends(Role, _super);
        function Role() {
            _super.call(this);
            this.ifLeft = false;
            this.curAnimation = "";
            this.init(0, "demo");
        }
        var d = __define,c=Role,p=c.prototype;
        p.init = function (id, kind) {
            _super.prototype.init.call(this, id, kind);
            this.id = id;
            this.kind = kind;
            this.display = new egret.Bitmap();
            //set Texture
            this.bigTexture = RES.getRes("leatherarmor_png");
            this.sprites = new egret.SpriteSheet(this.bigTexture);
            //load json
            var imgJson = RES.getRes("leatherarmor_json");
            //init array
            this.animations = new Array();
            this.textures = new Array();
            //add all animation To animations
            for (var animate_json in imgJson.animations) {
                Main.debugView.addLog(animate_json, "Role");
                var ob = imgJson.animations[animate_json];
                var animate = new Assets.RoleAnimation();
                animate.init(animate_json, ob.length, ob.row, Role.BitMapSize, Role.BitMapSize);
                this.animations.push(animate);
            }
            //create textures from SpriteSheet
            var bitGridRol = this.bigTexture.$getTextureHeight() / Role.BitMapSize;
            var bitGridCow = this.bigTexture.$getTextureWidth() / Role.BitMapSize;
            for (var i = 0; i < bitGridRol; i++) {
                for (var k = 0; k < bitGridCow; k++) {
                    var name = i + "_" + k;
                    var bity = i * Role.BitMapSize;
                    var bitx = k * Role.BitMapSize;
                    this.sprites.createTexture(name, bitx, bity, Role.BitMapSize, Role.BitMapSize);
                }
            }
            //set cur Animation
            this.setCurAnimation("walk_right");
            this.setDisplayTexture(this.getCurAnimationTexture());
            this.setTrunLeft(true);
            //add bitmap
            this.addChild(this.display);
        };
        p.setCurAnimation = function (animation) {
            this.curAnimation = animation;
        };
        p.getClip = function (animation) {
            //Find Clip
            for (var _i = 0, _a = this.animations; _i < _a.length; _i++) {
                var clip = _a[_i];
                if (clip.name == this.curAnimation) {
                    return clip;
                }
            }
            return;
        };
        p.setDisplayTexture = function (curTexture) {
            this.display.texture = curTexture;
            if (this.ifLeft) {
                this.display.scaleX = -1;
                this.display.x = 64;
            }
            else {
                this.display.scaleX = 1;
                this.display.x = 0;
            }
        };
        p.getCurAnimationTexture = function () {
            var clip = this.getClip(this.curAnimation);
            var index = clip.row + "_" + clip.currentFrame;
            try {
                return this.sprites.getTexture(index);
            }
            catch (error) {
                Main.debugView.addLog("Get Texture fail.", "Role:" + clip.name);
            }
        };
        p.setTrunLeft = function (flag) {
            this.ifLeft = flag;
        };
        p.update = function () {
            if (this.curAnimation != "") {
                var clip = this.getClip(this.curAnimation);
                if (clip.lastCallCounter >= Role.FramesNextTexture) {
                    clip.currentFrame += 1;
                    if (clip.currentFrame >= clip.length) {
                        clip.currentFrame = 0;
                    }
                    this.setDisplayTexture(this.getCurAnimationTexture());
                    clip.lastCallCounter = 0;
                }
                else {
                    clip.lastCallCounter++;
                }
            }
        };
        Role.BitMapSize = 64;
        Role.FramesNextTexture = 5;
        return Role;
    }(Assets.Entity));
    Assets.Role = Role;
    egret.registerClass(Role,'Assets.Role');
})(Assets || (Assets = {}));
//# sourceMappingURL=Role.js.map