module Gmap {
	export class Map {
		public constructor() {
			this.init();
		}
		public mapLoaded = false;
		grid;
		plateauGrid;
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
            this._generateCollisionGrid();
            this._generatePlateauGrid();
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

            this.doors = this._getDoors(map);
            this.checkpoints = this._getCheckpoints(map);
		}
		doors;
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

        _generateCollisionGrid() {
            var tileIndex = 0,
                self = this;

            this.grid = [];
            for(var j, i = 0; i < this.height; i++) {
                this.grid[i] = [];
                for(j = 0; j < this.width; j++) {
                    this.grid[i][j] = 0;
                }
            }

             _.each(this.collisions, function(tileIndex) {
                var tindex:Number = Number(tileIndex)+1;
                var pos = self.tileIndexToGridPosition(tindex);
                self.grid[pos.y][pos.x] = 1;
            });

            _.each(this.blocking, function(tileIndex) {
                var tindex:Number = Number(tileIndex)+1;
                var pos = self.tileIndexToGridPosition((tindex));
                if(self.grid[pos.y] !== undefined) {
                    self.grid[pos.y][pos.x] = 1;
                }
            });
            Main.debugView.log("Collision grid generated.","Map");
        }

        _generatePlateauGrid() {
            var tileIndex = 0;

            this.plateauGrid = [];
            for(var j, i = 0; i < this.height; i++) {
                this.plateauGrid[i] = [];
                for(j = 0; j < this.width; j++) {
                    if(_.include(this.plateau, tileIndex)) {
                        this.plateauGrid[i][j] = 1;
                    } else {
                        this.plateauGrid[i][j] = 0;
                    }
                    tileIndex += 1;
                }
            }
            Main.debugView.log("Plateau grid generated.","Map");
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
             var self = this;
			 self.checkpoints=new Array();
            _.each(map.checkpoints, function(cp:any) {
                var area = new Gmap.Area(cp.id,cp.x, cp.y, cp.w, cp.h);
                //area.id = cp.id;
                self.checkpoints.push(area);
            });
            return self.checkpoints;
        }

        getCurrentCheckpoint(entity) {
            return _.detect(this.checkpoints, function(checkpoint) {
                return checkpoint.contains(entity);
            });
        }
		isDoor(x, y) {
            return this.doors[this.GridPositionToTileIndex(x, y)] !== undefined;
        }
		_getDoors(map) {
            var doors = {},
                self = this;

            _.each(map.doors, function(door:any) {
                var o;

                switch(door.to) {
                    case 'u': o = Types.Orientations.UP;
                        break;
                    case 'd': o = Types.Orientations.DOWN;
                        break;
                    case 'l': o = Types.Orientations.LEFT;
                        break;
                    case 'r': o = Types.Orientations.RIGHT;
                        break;
                    default : o = Types.Orientations.DOWN;
                }

                doors[self.GridPositionToTileIndex(door.x, door.y)] = {
                    x: door.tx,
                    y: door.ty,
                    orientation: o,
                    cameraX: door.tcx,
                    cameraY: door.tcy,
                    portal: door.p === 1
                };
            });

            return doors;
        }
		getDoorDestination(x, y) {
            return this.doors[this.GridPositionToTileIndex(x, y)];
        }
	}
}