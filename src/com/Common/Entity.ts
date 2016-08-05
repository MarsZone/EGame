module Common {
    export /**
     * Entity
     */
        class Entity{
        constructor(id, kind) {
            //super();
            this.id = id;
            this.kind = kind;

            // Renderer
            this.sprite = null;
            this.flipSpriteX = false;
            this.flipSpriteY = false;
            this.animations = null;
            this.currentAnimation = null;
            this.shadowOffsetY = 0;
            
            this.displayBitmap = new egret.Bitmap();
            this.weaponBitmap = new egret.Bitmap();
            // Position
            this.setGridPosition(0, 0);

            // Modes
            this.isLoaded = false;
            this.isHighlighted = false;
            this.visible = true;
            this.isFading = false;
            
            this.setDirty();
        }

        id;
        kind;
        Ename;
        sprite;
        visible;
        normalSprite;
        hurtSprite;
        flipSpriteX;flipSpriteY;
        animations;
        currentAnimation:Assets.Animation;
        shadowOffsetY;
        isLoaded;
        isHighlighted;
        isFading;
        ready_func;
        fadingAlpha;
        displayBitmap:egret.Bitmap;
        weaponBitmap:egret.Bitmap;
        init(id, kind): void {
            
        }

        setName(name) {
            this.Ename = name;
        }
        x;
        y;
        setPosition(x, y) {
            this.x = x;
            this.y = y;
            //Main.debugView.log("SetPos:"+this.x+"|"+this.y);
        }
        gridX=0;
        gridY=0;
        setGridPosition(x, y) {
            this.gridX = x;
            this.gridY = y;
            this.setPosition(x * 16, y * 16);
        }
        setSprite(sprite:Assets.Sprite) {
            if(!sprite) {
                Main.debugView.log(this.id + " : sprite is null","Entity");
                throw "Sprite error";
            }

            if(this.sprite && this.sprite.name === sprite.name) {
                return;
            }

            this.sprite = sprite;
            this.normalSprite = this.sprite;

            if(Types.isMob(this.kind) || Types.isPlayer(this.kind)) {
                //this.hurtSprite = sprite.getHurtSprite();
            }

            this.animations = sprite.createAnimations();


            this.isLoaded = true;
            if(this.ready_func) {
                this.ready_func();
            }
        }

        getSprite() {
            return this.sprite;
        }

        getSpriteName() {
            //Main.debugView.log("Kind:"+this.kind+"Result:"+Types.getKindAsString(this.kind),"Entity");
            return Types.getKindAsString(this.kind);
        }

        getAnimationByName(name) {
            var animation = null;

            if(name in this.animations) {
                animation = this.animations[name];
            }
            else {
                Main.debugView.log("No animation called "+ name,"Entity");
            }
            return animation;
        }
        updateBitmap(x,y,height,width){
            this.displayBitmap.scaleX=1;
            this.displayBitmap.scaleY=1;
            this.displayBitmap.texture = this.currentAnimation.texture;
            this.displayBitmap.width = height;
            this.displayBitmap.height = width;
            this.displayBitmap.x = x;
            this.displayBitmap.y = y;
            if(this.flipSpriteX) {
                this.displayBitmap.scaleX=-1;
                this.displayBitmap.x = this.displayBitmap.x + this.displayBitmap.width ;
            }else if(this.flipSpriteY) {
                this.displayBitmap.scaleY=-1; 
                this.displayBitmap.y = this.displayBitmap.y+this.displayBitmap.height ;
            }
            
            //Main.debugView.log("Current Entity:"+this.kind+"|Current Animation:"+this.currentAnimation.name,"Update");
            //Main.debugView.log("updateBitmap:"+this.displayBitmap.x+"|"+this.displayBitmap.y,"Entity");
        }
        updateWeaponBitmap(x,y,height,width,texture){
            this.weaponBitmap.scaleX=1;
            this.weaponBitmap.texture =texture;
            this.weaponBitmap.width = height;
            this.weaponBitmap.height = width;
            this.weaponBitmap.x = x;
            this.weaponBitmap.y = y;

            if(this.flipSpriteX) {
                this.weaponBitmap.scaleX=-1;
                //Main.debugView.log("weaponx:"+this.weaponBitmap.x+"|weaponWdith:"+this.weaponBitmap.width,"Entity");
                this.weaponBitmap.x = this.weaponBitmap.x + this.weaponBitmap.width;
                //Main.debugView.log("weaponx:"+this.weaponBitmap.x+"|weaponWdith:"+this.weaponBitmap.width,"Entity");
            }else if(this.flipSpriteY) {
                // this.weaponBitmap.scaleY=-1; 
                // this.weaponBitmap.y = this.weaponBitmap.y+this.weaponBitmap.height ;
            }
        }

        setAnimation(name, speed, count, onEndCount) {
            var self = this;

            if(this.isLoaded) {
                if(this.currentAnimation && this.currentAnimation.name === name) {
                    return;
                }

                var s = this.sprite,
                    a = this.getAnimationByName(name);

                if(a) {
                    this.currentAnimation = a;
                    if(name.substr(0, 3) === "atk") {
                        this.currentAnimation.reset();
                    }
                    this.currentAnimation.setSpeed(speed);
                    this.currentAnimation.setCount(count ? count : 0, onEndCount || function() {
                        self.idel();
                    });
                }
            }
            else {
                Main.debugView.log("Not ready for animation","Entity");
            }
        }
        idel(){
            //Main.debugView.log("Entity Idel");
        }

        hasShadow() {
            return false;
        }

        ready(f) {
            this.ready_func = f;
        }

        clean() {
            this.stopBlinking();
        }

        log_info(message) {
            Main.debugView.log("["+this.id+"] " + message,"Entity");
        }

        log_error(message) {
            Main.debugView.log("["+this.id+"] " + message,"Entity");
        }

        setHighlight(value) {
            if(value === true) {
                this.sprite = this.sprite.silhouetteSprite;
                this.isHighlighted = true;
            }
            else {
                this.sprite = this.normalSprite;
                this.isHighlighted = false;
            }
        }

        setVisible(value) {
            this.visible = value;
        }

        isVisible() {
            return this.visible;
        }

        toggleVisibility() {
            // if(this.visible) {
            //     this.setVisible(false);
            // } else {
            //     this.setVisible(true);
            // }
        }
        		/**
         *
         */
        getDistanceToEntity(entity) {
            var distX = Math.abs(entity.gridX - this.gridX),
                distY = Math.abs(entity.gridY - this.gridY);

            return (distX > distY) ? distX : distY;
        }

        isCloseTo(entity) {
            var dx, dy, d, close = false;
            if(entity) {
                dx = Math.abs(entity.gridX - this.gridX);
                dy = Math.abs(entity.gridY - this.gridY);

                if(dx < 30 && dy < 14) {
                    close = true;
                }
            }
            return close;
        }

        /**
         * Returns true if the entity is adjacent to the given one.
         * @returns {Boolean} Whether these two entities are adjacent.
         */
        isAdjacent(entity) {
            var adjacent = false;

            if(entity) {
                adjacent = this.getDistanceToEntity(entity) > 1 ? false : true;
            }
            return adjacent;
        }

        /**
         *
         */
        isAdjacentNonDiagonal(entity) {
            var result = false;

            if(this.isAdjacent(entity) && !(this.gridX !== entity.gridX && this.gridY !== entity.gridY)) {
                result = true;
            }

            return result;
        }

        isDiagonallyAdjacent(entity) {
            return this.isAdjacent(entity) && !this.isAdjacentNonDiagonal(entity);
        }

        forEachAdjacentNonDiagonalPosition(callback) {
            callback(this.gridX - 1, this.gridY, Types.Orientations.LEFT);
            callback(this.gridX, this.gridY - 1, Types.Orientations.UP);
            callback(this.gridX + 1, this.gridY, Types.Orientations.RIGHT);
            callback(this.gridX, this.gridY + 1, Types.Orientations.DOWN);

        }
        startFadingTime;

        fadeIn(currentTime) {
            this.isFading = true;
            this.startFadingTime = currentTime;
        }
        blinking;
        blink(speed, callback) {
            var self = this;

            this.blinking = setInterval(function() {
                self.toggleVisibility();
            } ,speed);
        }

        stopBlinking() {
            if(this.blinking) {
                clearInterval(this.blinking);
            }
            this.setVisible(true);
        }
        isDirty;
        dirty_callback;
        setDirty() {
            this.isDirty = true;
            if(this.dirty_callback) {
                this.dirty_callback(this);
            }
        }

        onDirty(dirty_callback) {
            this.dirty_callback = dirty_callback;
        }
    }
}