module Gmap {
	export class Area {
		id;
		x;
		y;
		width;
		height;
		world;
		entities;
		hasCompletelyRespawned;
		public constructor(id,x, y, width, height,world) {
			this.id = id;
			this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
			this.world=world;
			this.entities = [];
       		this.hasCompletelyRespawned = true;
		}

		contains(entity):boolean{
			if(entity) {
                return entity.gridX >= this.x
                    && entity.gridY >= this.y
                    && entity.gridX < this.x + this.width
                    && entity.gridY < this.y + this.height;
            } else {
                return false;
            }
		}
	}
}