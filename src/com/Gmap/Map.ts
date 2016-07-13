module Gmap {
	export class Map {
		public constructor() {
			this.init();
		}
		public mapLoaded = false;
		grid;
		plateauGrid = false;
		isLoaded=false;
		tilesetsLoaded = false;
		init():void{
			this.loadMap();
			this.loadTileSets();
			this.mapLoaded = true;
			this.isLoaded = true;
			//Done.
		}
		loadMap():void{
			var worker = new Gmap.MapWoker();
			this.initMap(worker.mapData);
			this.grid = worker.mapData.grid;
			this.plateauGrid = worker.mapData.plateauGrid;
            
		}
		width;
		height;
		tilesize;
		data;
		blocking;
		plateau;
		musicAreas;
		collisions;
		high;
		animated;
		initMap(map):void{
			this.width = map.width;
            this.height = map.height;
            this.tilesize = map.tilesize;
            this.data = map.data;
            this.blocking = map.blocking || [];
            this.plateau = map.plateau || [];
            this.musicAreas = map.musicAreas || [];
            this.collisions = map.collisions;
            this.high = map.high;
            this.animated = map.animated;

            //this.doors = this._getDoors(map);
            //this.checkpoints = this._getCheckpoints(map);
		}
		mapTexture:egret.Texture;
		SpritesSheet:egret.SpriteSheet;
		tileSetWidth:number;
		tileSetHeight:number;
		PerTilesetSize=32;
		WhiteSpaceGap=0.2;
		row;
		col;
		//32*32
		loadTileSets():void{
			this.mapTexture = RES.getRes("tilesheet_png");
			this.row = this.mapTexture.$getTextureHeight() / this.PerTilesetSize;
			this.col = this.mapTexture.$getTextureWidth() / this.PerTilesetSize;
			this.tileSetHeight = this.mapTexture.$getTextureHeight();
			this.tileSetWidth = this.mapTexture.$getTextureWidth();
			this.SpritesSheet = new egret.SpriteSheet(this.mapTexture);
			
			for(var i =0 ;i<this.row;i++)
			{
				for(var k=0;k<this.col;k++)
				{
					var index=i*this.col+k+1;
					var bitx = k*this.PerTilesetSize+this.WhiteSpaceGap;
					var bity = i*this.PerTilesetSize+this.WhiteSpaceGap;
					this.SpritesSheet.createTexture(""+index,bitx,bity,this.PerTilesetSize-this.WhiteSpaceGap,this.PerTilesetSize-this.WhiteSpaceGap);
					//Main.debugView.addLog("Map Index:"+index+"|BitX:"+bitx+"|BitY:"+bity);
				}
			}
			Main.debugView.log("MapTileSets was Loaded"+" Row:"+this.row
			+"Col:"+this.col,"Map");
		}
		isColliding(x, y) {
            if(this.isOutOfBounds(x, y) || !this.grid) {
                return false;
            }
            return (this.grid[y][x] === 1);
        }

        isPlateau(x, y) {
            if(this.isOutOfBounds(x, y) || !this.plateauGrid) {
                return false;
            }
            return (this.plateauGrid[y][x] === 1);
        }
		isOutOfBounds(x, y) {
            return this.isInt(x) && this.isInt(y) && (x < 0 || x >= this.width || y < 0 || y >= this.height);
        }
		isInt = function(n) {
   		 return (n % 1) === 0;
		};

		GridPositionToTileIndex(x, y) {
            return (y * this.width) + x + 1;
        }
		isAnimatedTile(id) {
            return id+1 in this.animated;
        }
		 isHighTile(id) {
            return _.indexOf(this.high, id+1) >= 0;
        }
		getTileAnimationLength(id) {
            return this.animated[id+1].l;
        }

		/**
         *
         */
        getTileAnimationDelay(id) {
            var animProperties = this.animated[id+1];
            if(animProperties.d) {
                return animProperties.d;
            } else {
                return 100;
            }
        }

		tileIndexToGridPosition(tileNum) {
            var x = 0,
                y = 0;

            var getX = function(num, w) {
                if(num == 0) {
                    return 0;
                }
                return (num % w == 0) ? w - 1 : (num % w) - 1;
            };

            tileNum -= 1;
            x = getX(tileNum + 1, this.width);
            y = Math.floor(tileNum / this.width);

            return { x: x, y: y };
        }
		checkpoints= [];
		 _getCheckpoints(map) {
			 this.checkpoints=[];
            _.each(map.checkpoints, function(cp:any) {
                var area = new Gmap.Area(cp.id,cp.x, cp.y, cp.w, cp.h);
                //area.id = cp.id;
                this.checkpoints.push(area);
            });
            return this.checkpoints;
        }

        getCurrentCheckpoint(entity) {
            return _.detect(this.checkpoints, function(checkpoint) {
                return checkpoint.contains(entity);
            });
        }
	}
}