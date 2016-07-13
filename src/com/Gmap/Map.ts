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
	}
}