module Gmap {
	export class Map {
		public constructor() {
			this.init();
		}
		grid;
		plateauGrid = false;
		mapLoaded = false;
		isLoaded=false;
		tilesetsLoaded = false;
		init():void{
			this.loadMap();
			this.loadTileSets();
			//Done.
		}
		loadMap():void{
			var worker = new Gmap.MapWoker();
			this.initMap(worker.mapData);
			this.grid = worker.mapData.grid;
			this.plateauGrid = worker.mapData.plateauGrid;
            this.mapLoaded = true;
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
		PerTilesetSize=32;
		row;
		col;
		//32*32
		loadTileSets():void{
			this.mapTexture = RES.getRes("tilesheet_png");
			this.row = this.mapTexture.$getTextureHeight() / this.PerTilesetSize;
			this.col = this.mapTexture.$getTextureWidth() / this.PerTilesetSize;
			this.SpritesSheet = new egret.SpriteSheet(this.mapTexture);
			for(var i =0 ;i<this.row;i++)
			{
				for(var k=0;k<this.col;k++)
				{
					var index=i*this.col+k;
					var bitx = k*this.PerTilesetSize;
					var bity = i*this.PerTilesetSize;
					this.SpritesSheet.createTexture(""+index,bitx,bity,this.PerTilesetSize,this.PerTilesetSize);
					//Main.debugView.addLog("Map Index:"+index+"|BitX:"+bitx+"|BitY:"+bity);
				}
			}
			Main.debugView.addLog("MapTileSets was Loaded","Map");
		}
	}
}