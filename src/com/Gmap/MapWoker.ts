module Gmap {
	export class MapWoker {
		public constructor() {
			this.load();
		}
		mapData;
		load():void{
			this.mapData = RES.getRes("world_client_json");
			this.generateCollisionGrid();
    		this.generatePlateauGrid();
		}
		generateCollisionGrid(){
			 var tileIndex = 0;
			 this.mapData.grid=[];
			 for(var j, i = 0; i < this.mapData.height; i++) {
				this.mapData.grid[i] = [];
				for(j = 0; j < this.mapData.width; j++) {
					this.mapData.grid[i][j] = 0;
				}
			 }
		}
		generatePlateauGrid(){
			var tileIndex = 0;

			this.mapData.plateauGrid = [];
			for(var j, i = 0; i < this.mapData.height; i++) {
				this.mapData.plateauGrid[i] = [];
				for(j = 0; j < this.mapData.width; j++) {
					if(_.include(this.mapData.plateau, tileIndex)) {
						this.mapData.plateauGrid[i][j] = 1;
					} else {
						this.mapData.plateauGrid[i][j] = 0;
					}
					tileIndex += 1;
				}
			}
		}
		tileIndexToGridPosition(tileNum){
			var x = 0,
        	y = 0;

			tileNum -= 1;
			x = this.getX(tileNum + 1, this.mapData.width);
			y = Math.floor(tileNum / this.mapData.width);
			return { x: x, y: y };
		}
		getX(num, w):number{
			if(num == 0) {
            	return 0;
        	}
			return (num % w == 0) ? w - 1 : (num % w) - 1;
		}
	}
}