module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Core extends egret.DisplayObjectContainer{
		public constructor(render:Content.Render) {
            super();
            this._render = render;
            // Player
            this.player = new Role.Warrior("player", "");
            this.player.moveUp = false;
            this.player.moveDown = false;
            this.player.moveLeft = false;
            this.player.moveRight = false;
            this.player.disableKeyboardNpcTalk = false;
		}
        _render:Content.Render;
        index=0;
        frameControler:boolean=true;
        private time:number = 0;
        
        start(){
            egret.startTick(this.update,this);
        }
        update(timeStamp:number):boolean{
            var now = timeStamp;
            var time = this.time;
            var pass = now - time;
            //console.log("moveStar: ",(1000 / pass).toFixed(5));
            //Main.debugView.log("moveStar: "+(1000 / pass).toFixed(5)+"_index"+this.index,"Core");
            this.time = now;
            //Every 30 frame.update.
            if(this.frameControler)
            {
                this._render.update();
            }
            this.frameControler=!this.frameControler;
            this.index++;
            return true;
        }
        pause(){
            
        }
        stop(){
            egret.stopTick(this.update,this);
        }
        reset(){
            
        }

        player;
        ready = false;
        started = false;
        hasNeverStarted = true;

        renderer = null;
        updater = null;
        pathfinder = null;
        chatinput = null;
        bubbleManager = null;
        audioManager = null;

    // Game state
        entities = {};
        deathpositions = {};
        entityGrid = null;
        pathingGrid = null;
        renderingGrid = null;
        itemGrid = null;
        currentCursor = null;
        mouse = { x: 0, y: 0 };
        zoningQueue = [];
        previousClickPosition = {};

        cursorVisible = true;
        selectedX = 0;
        selectedY = 0;
        selectedCellVisible = false;
        targetColor = "rgba(255, 255, 255, 0.5)";
        targetCellVisible = true;
        hoveringTarget = false;
        hoveringPlayer = false;
        hoveringMob = false;
        hoveringItem = false;
        hoveringCollidingTile = false;

    // combat
        infoManager = new InfoManager(this);

    // zoning
        currentZoning = null;

        cursors = {};

        sprites = {};

    // tile animation
        animatedTiles = null;

    // debug
        debugPathing = false;
    
    // pvp
        pvpFlag = false;
	}
}
