module Assets {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Animation {
		public constructor() {
            
		}
        name:string;
        length:number;
        row:number;
        width:number;
        height:number;
        lastTime:number;
        currentFrame;
        
		init(name, length, row, width, height):void {
            this.name = name;
            this.length = length;
            this.row = row;
            this.width = width;
            this.height = height;
            this.reset();
        }
        
        reset() {
            this.lastTime = 0;
            this.currentFrame = { index: 0, x: 0, y: this.row * this.height };
        }
	}
}
