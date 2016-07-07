module Assets {
	/**
	 *
	 * @author mars
	 *
	 */
    export interface EAnimation {
        name: string;
        length: number;
        row: number;
        width: number;
        height: number;
        lastCallCounter: number;
        currentFrame:number;
        init(name, length, row, width, height): void;
        reset();
    }


    export class RoleAnimation implements Assets.EAnimation {
        public constructor() {
        }
        name: string;
        length: number;
        row: number;
        width: number;
        height: number;
        lastCallCounter: number;
        currentFrame:number;

        init(name, length, row, width, height): void {
            this.name = name;
            this.length = length;
            this.row = row;
            this.width = width;
            this.height = height;
            this.reset();
        }
        
        reset()  {
            this.lastCallCounter = 0;
            this.currentFrame = 0;
        }
    }
}
