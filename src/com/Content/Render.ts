module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Render extends egret.Sprite {
		public constructor(map:Gmap.Map) {
			super();
			this.map = map;
			this.init();
		}
		core:Core;
		chara: Assets.ECharacter;
		context:egret.Sprite; //entities
        backGound:egret.Sprite;
		foreground:egret.Sprite;
		map:Gmap.Map;
		camera:Content.Camera;
		static mobile:boolean=false;
		static tablet=false;
		tilesize=16;
		animatedTileCount=0;
		highTileCount=0;
		static upscaledRendering=false;
		supportsSilhouettes;
		init(): void {

			this.initFPS();
			//add BG
			this.backGound=new egret.Sprite();
			this.context = new egret.Sprite();
			this.foreground = new egret.Sprite();
			this.addSP(this.backGound,Main.StageWidth,Main.StageHeight);
			this.addSP(this.context,Main.StageWidth,Main.StageHeight);
			//this.addSP(this.foreground,Main.StageWidth,Main.StageHeight);
			//this.addRole();
			//this.renderStaticCanvases();
			this.camera =new Content.Camera(this);
			//this.upscaledRendering = this.context.mozImageSmoothingEnabled !== undefined;
			Render.upscaledRendering = false;
            this.supportsSilhouettes = Render.upscaledRendering;
		}
		FPS;
		initFPS() {
            this.FPS = 50;
        }
		getScaleFactor() {
            var w = window.innerWidth,
                h = window.innerHeight,
                scale;

            Render.mobile = false;

            // if(w <= 1000) {
            //     scale = 2;
            //     Render.mobile= true;
            // }
            // // else if(w <= 1500 || h <= 870) {
            // //     scale = 2;
            // // }
            // else {
            //     scale = 3;
            // }
			scale=2;
            return scale;
        }
		setCore(core:Core){
			this.core = core;
		}
		addSP(sp:egret.Sprite,width,height){
			sp.width = width;
			sp.height = height;
			this.addChild(sp);
		}

		drawText(text, x, y, centered, color, strokeColor){
			//Main.debugView.log("drawText");

		}
		drawCellRect(x, y, color,alpha=1) {
			Main.debugView.log("drawCellRect","Render");
			this.context.graphics.lineStyle(2,color,alpha);
			this.context.graphics.drawRect(x,y,this.tilesize-4,this.tilesize-4);
            //this.context.strokeRect(0, 0, (this.tilesize * this.scale) - 4, (this.tilesize * this.scale) - 4);
		}
		drawRectStroke(x, y, width, height, color,alpha=1) {
			Main.debugView.log("drawRectStroke","Render");
			this.context.graphics.beginFill(color,alpha);
			this.context.graphics.drawRect(x,y,this.tilesize *width,this.tilesize *height);
			this.context.graphics.endFill();
			
			this.context.graphics.lineStyle(5,0x000000);
			this.context.graphics.drawRect(x,y,this.tilesize *width,this.tilesize *height);
		}
		drawRect(x, y, width, height, color,alpha=1) {
			Main.debugView.log("drawRect","Render");
			this.context.graphics.beginFill(color,alpha);
			this.context.graphics.lineStyle(5);
			this.context.graphics.drawRect(x,y,this.tilesize *width,this.tilesize *height);
			this.context.graphics.endFill();
		}

		drawCellHighlight(x, y, color ,alpha=1) {
			var ts = this.tilesize;
			var tx = x * ts;
			var ty = y * ts;
            this.drawCellRect(tx, ty, color,alpha);
        }
		drawTargetCell(){
			Main.debugView.log("drawTargetCell","Render");
			
		}
		drawAttackTargetCell(){
			Main.debugView.log("drawAttackTargetCell","Render");
		}
		drawOccupiedCells(){

		}
		drawPathingCells(){

		}
		drawSelectedCell(){

		}
		clearScaledRect(){
			Main.debugView.log("ClearScaleRect","Render");
			this.context.graphics.clear();
		}
		drawCursor(){

		}
		clearTile(){

		}

		renderStaticCanvases():void{
			this.setCameraView(this.backGound);
			this.drawTerrain();
			//this.drawHighTiles(this.foreground);
		}
		GridS:Array<egret.Sprite>;

		// drawHighTiles(ctx) {
        //     var self = this,
        //         m = this.core.map,
        //         tilesetwidth = this.map.tileSetWidth / this.map.tilesize;

        //     this.highTileCount = 0;
        //     this.core.forEachVisibleTile(function (id, index) {
        //         if(m.isHighTile(id)) {
        //             //self.drawTile(ctx, id, self.tileset, tilesetwidth, m.width, index);
        //             self.highTileCount += 1;
        //         }
        //     }, 1);
        // }
		EgetX(id, w):number {
			if(id == 0) {
				return 0;
			}
			return (id % w == 0) ? w - 1 : (id % w) - 1;
   		}
		drawTerrain():void{
			var self = this;
			var tilesetwidth:number = this.map.tileSetWidth / this.map.tilesize;
			var horizontal_tiles = Main.StageWidth / tilesetwidth;
			var vertical_tiles = Math.floor(Main.StageHeight / tilesetwidth);
			Main.debugView.log("H:"+horizontal_tiles+"|V:"+vertical_tiles,"Render");
			var s = Render.upscaledRendering ? 1 : this.scale;

			this.GridS = new Array();
			var CenterX = 0;
			var CenterY = 0;
			
			//GridBits.width=self.backGound.width;
			//GridBits.height=self.backGound.height;
			//self.backGound.addChild(GridBits);
			//id tileset |  index map index arr or one
			
			this.core.forEachVisibleTile(function (id, index) {
				// Main.debugView.log("___________________________________________");
				// Main.debugView.log("draw index:"+index+"|id:"+id);
				// Main.debugView.log(":"+self.EgetX(id + 1, (tilesetwidth / s)) * self.map.tilesize+"|:"+ Math.floor(id / (tilesetwidth / s)) * self.tilesize);
				// Main.debugView.log(":"+self.EgetX(index+1,tilesetwidth)* self.map.tilesize +"|:"+Math.floor(index/tilesetwidth)*self.map.tilesize);
                //if(!m.isHighTile(id) && !m.isAnimatedTile(id)) { // Don't draw unnecessary tiles
                    //self.drawTile(self.background, id, self.tileset, tilesetwidth, m.width, index);
                //}
				var bitmap:egret.Bitmap = new egret.Bitmap();
				bitmap.width = self.tilesize * self.scale;
				bitmap.height = self.tilesize * self.scale;
				bitmap.x = 0;
				bitmap.y = 0;
				bitmap.texture = self.map.SpritesSheet.getTexture((id+1));
				if(!self.GridS[index])
				{
					var GridBits:egret.Sprite = new egret.Sprite();
					GridBits.x = self.EgetX(index + 1, self.map.width) * (self.map.tilesize*self.scale);
					GridBits.y = Math.floor(index / self.map.width) * (self.map.tilesize*self.scale);
					GridBits.addChild(bitmap);
					self.GridS.push(GridBits);
					self.backGound.addChild(GridBits);
				}else{
					self.GridS[index].addChild(bitmap);
				}
				//Main.debugView.log("x:"+GridBits.x+"|y:"+GridBits.y+"|id:"+id+"|tilesetwidth:"+tilesetwidth,"Render");
            }, 1);
			
			
		}
		forEachVisibleTile():void{
			if(this.map.mapLoaded)
			{
				for(var tile of this.map.data)
				{
					if(tile instanceof Array)
					{
						//Main.debugView.addLog("Array.");
					}else{
						//Main.debugView.addLog("Signer");						
					}
				}
			}
		}

		//AddRole_test
		addRole():void{
			//ForTest AddRole
			this.chara = new Assets.ECharacter("leatherarmor", "character");
			this.chara.Px += 100;
			this.chara.Py += 100;
			//this.addChild(this.chara);
			var self = this;
			//test key controler.
			document.addEventListener("keydown",function(event:KeyboardEvent){
				switch (event.keyCode) {
					case Types.KeyMap.Up:
						self.chara.setCurAnimation("walk_up");
						break;
					case Types.KeyMap.Down:
						self.chara.setCurAnimation("walk_down");
						break;
					case Types.KeyMap.Left:
						self.chara.setCurAnimation("walk_right",true);
						break;
					case Types.KeyMap.Right:
						self.chara.setCurAnimation("walk_right");
						break;
				}
			})
			EGEvent.UIEventHandler.instance.addEventListener(EGEvent.GameEvent.CHANGE,this.onChange,this);
		}
		update(): void {
			this.chara.update();
		}
		onChange(e:EGEvent.GameEvent):void{
			this.chara.setCurAnimation("walk_right");
		}
		clearContextScreen() {
			Main.debugView.log("ClearScreen:","Render");
            this.context.graphics.clear();
        }

		scale=2;
		getEntityBoundingRect(entity) {
            var rect = <any>{},
                s = this.scale,
                spr;

            if(entity instanceof Player && entity.hasWeapon()) {
                var weapon = this.core.sprites[entity.getWeaponName()];
                spr = weapon;
            } else {
                spr = entity.sprite;
            }

            if(spr) {
                rect.x = (entity.x + spr.offsetX - this.camera.x) * s;
                rect.y = (entity.y + spr.offsetY - this.camera.y) * s;
                rect.w = spr.width * s;
                rect.h = spr.height * s;
                rect.left = rect.x;
                rect.right = rect.x + rect.w;
                rect.top = rect.y;
                rect.bottom = rect.y + rect.h;
            }
            return rect;
        }

		setCameraView(ctx:egret.Sprite) {
			ctx.x = -this.camera.x * this.scale;
			ctx.y = -this.camera.y * this.scale;			
        }

		renderFrame() {
            if(Render.mobile || Render.tablet) {
                this.renderFrameMobile();
            }
            else {
                this.renderFrameDesktop();
            }
        }

        renderFrameDesktop() {
            //this.clearContextScreen();
			this.setCameraView(this.context);
			//this.drawTerrain();

			//this.drawOccupiedCells();
			this.drawPathingCells();
			this.drawEntities();
			//this.drawCombatInfo();

        }
		renderFrameMobile(){};


		drawEntities(dirtyOnly?) {
            var self = this;

            this.core.forEachVisibleEntityByDepth(function(entity) {
                if(entity.isLoaded) {
                    if(dirtyOnly) {
                        if(entity.isDirty) {
                            self.drawEntity(entity);

                            entity.isDirty = false;
                            entity.oldDirtyRect = entity.dirtyRect;
                            entity.dirtyRect = null;
                        }
                    } else {
                        self.drawEntity(entity);
                    }
                }
            });
        }

        drawDirtyEntities() {
            this.drawEntities(true);
        }

		drawEntity(entity) {
            var sprite = entity.sprite,
                shadow = this.core.shadows["small"],
                anim = entity.currentAnimation,
                os = Render.upscaledRendering ? 1 : this.scale,
                ds = Render.upscaledRendering ? this.scale : 1;

            if(anim && sprite) {
                var frame = anim.currentFrame,
                    s = this.scale,
                    x = frame.x * os,
                    y = frame.y * os,
                    w = sprite.width * os,
                    h = sprite.height * os,
                    ox = sprite.offsetX * s,
                    oy = sprite.offsetY * s,
                    dx = entity.Px * s,
                    dy = entity.Py * s,
                    dw = w * ds,
                    dh = h * ds;

                this.drawEntityName(entity);

                if(entity.isVisible()) {
					//Main.debugView.log("updateX:"+entity.Px * s+"|updateY:"+entity.Py * s+"|WDS:"+w * ds+"|HDS:"+h*ds,"Render");
                    entity.updateBitmap(entity.Px * s,entity.Py * s,w * ds,h * ds);
					//this.context.drawImage(sprite.image, x, y, w, h, ox, oy, dw, dh);

                    if(entity instanceof Common.Item && entity.kind !== Types.Entities.CAKE) {
                        // var sparks = this.core.sprites["sparks"],
                        //     anim = this.core.sparksAnimation,
                        //     frame = anim.currentFrame,
                        //     sx = sparks.width * frame.index * os,
                        //     sy = sparks.height * anim.row * os,
                        //     sw = sparks.width * os,
                        //     sh = sparks.width * os;
                    }
                }

                if(entity instanceof Common.Character && !entity.isDead && entity.hasWeapon()) {
                    var weapon = this.core.sprites[entity.getWeaponName()];

                    if(weapon) {
                        var weaponAnimData = weapon.animationData[anim.name],
                            index = frame.index < weaponAnimData.length ? frame.index : frame.index % weaponAnimData.length,
                            wx = weapon.width * index * os,
                            wy = weapon.height * anim.row * os,
                            ww = weapon.width * os,
                            wh = weapon.height * os;
                    }
                }				
            }
        }
		addEntityToLayer(entity):void{
			this.context.addChild(entity.displayBitmap);
		}

		removeEntityFromLayer(entity):void{
			this.context.removeChild(entity.displayBitmap);
		}

		drawEntityName(entity) {
            //this.context.save();
            if(entity.name && entity instanceof Player) {
                var color = (entity.id === this.core.playerId) ? "#fcda5c" : "white";
                var name = (entity.level) ? "lv." + entity.level + " " + entity.name : entity.name;
                // this.drawText(entity.name,
                //               (entity.x + 8) * this.scale,
                //               (entity.y + entity.nameOffsetY) * this.scale,
                //               true,
                //               color);
            }
        }

		isIntersecting(rect1, rect2) {
            return !((rect2.left > rect1.right) ||
                     (rect2.right < rect1.left) ||
                     (rect2.top > rect1.bottom) ||
                     (rect2.bottom < rect1.top));
        }
		targetRect;
		getTargetBoundingRect(x?, y?) {
            var rect = <any>{},
                s = this.scale,
                ts = this.tilesize,
                tx = x || this.core.selectedX,
                ty = y || this.core.selectedY;

            rect.x = ((tx * ts) - this.camera.x) * s;
            rect.y = ((ty * ts) - this.camera.y) * s;
            rect.w = ts * s;
            rect.h = ts * s;
            rect.left = rect.x;
            rect.right = rect.x + rect.w;
            rect.top = rect.y;
            rect.bottom = rect.y + rect.h;

            return rect;
        }
		getTileBoundingRect(tile) {
            var rect = <any>{},
                gridW = this.core.map.width,
                s = this.scale,
                ts = this.tilesize,
                cellid = tile.index;

            rect.x = ((this.EgetX(cellid + 1, gridW) * ts) - this.camera.x) * s;
            rect.y = ((Math.floor(cellid / gridW) * ts) - this.camera.y) * s;
            rect.w = ts * s;
            rect.h = ts * s;
            rect.left = rect.x;
            rect.right = rect.x + rect.w;
            rect.top = rect.y;
            rect.bottom = rect.y + rect.h;

            return rect;
        }
	}
}
