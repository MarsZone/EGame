module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Core extends egret.DisplayObjectContainer{
		public constructor(render:Content.Render,map) {
            super();
            this.renderer = render;
            this.map = map;
            // Player
            this.player = new Role.Warrior("player", "");
            this.player.moveUp = false;
            this.player.moveDown = false;
            this.player.moveLeft = false;
            this.player.moveRight = false;
            this.player.disableKeyboardNpcTalk = false;
		}
        map:Gmap.Map;
        renderer:Content.Render;
        index=0;
        frameControler:boolean=true;
        private time:number = 0;
        camera;

        setUpdater(updater) {
            this.updater = updater;
        }

        setPathfinder(pathfinder) {
            this.pathfinder = pathfinder;
        }
        dotest;
        start(){
            var self = this;
            //egret.startTick(this.update,this);
            //
            this.loadSprites();
            this.setUpdater(new Common.Updater(this));
            this.camera = this.renderer.camera;
            //this.dotest=setInterval(this.intervalTest(this),100);
            //Main.debugView.log("Begin "+this.dotest);

            var wait = setInterval(function() {
                if(self.map.isLoaded) {
                    self.ready = true;
                    Main.debugView.log('All sprites loaded.');
                    
                    self.initAnimations();
                    self.initShadows();

                    self.initEntityGrid();
                    self.initItemGrid();
                    self.initPathingGrid();
                    self.initRenderingGrid();

                    self.setPathfinder(new Tools.Pathfinder(self.map.width, self.map.height));

                    //self.initPlayer();
                    //self.setCursor("hand");

                    //self.connect(action, started_callback);

                    clearInterval(wait);
                }
            }, 100);
        }
        targetAnimation;
        sparksAnimation;
        initAnimations() {
            this.targetAnimation = new Assets.Animation("idle_down", 4, 0, 16, 16);
            this.targetAnimation.setSpeed(50);

            this.sparksAnimation = new Assets.Animation("idle_down", 6, 0, 16, 16);
            this.sparksAnimation.setSpeed(120);
        }
        initEntityGrid() {
            this.entityGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.entityGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.entityGrid[i][j] = {};
                }
            }
            Main.debugView.log("Initialized the entity grid.");
        }
        initItemGrid() {
            this.itemGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.itemGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.itemGrid[i][j] = {};
                }
            }
            Main.debugView.log("Initialized the item grid.");
        }
        initPathingGrid() {
            this.pathingGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.pathingGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.pathingGrid[i][j] = this.map.grid[i][j];
                }
            }
            Main.debugView.log("Initialized the pathing grid with static colliding cells.");
        }
        initRenderingGrid() {
            this.renderingGrid = [];
            for(var i=0; i < this.map.height; i += 1) {
                this.renderingGrid[i] = [];
                for(var j=0; j < this.map.width; j += 1) {
                    this.renderingGrid[i][j] = {};
                }
            }
            Main.debugView.log("Initialized the rendering grid.");
        }
        shadows;
        initShadows() {
            this.shadows = {};
            this.shadows["small"] = this.sprites["shadow16"];
        }
        // intervalTest(core):void{
        //     Main.debugView.log("After 100 "+core.dotest);
        //     clearInterval(core.dotest);
        // }
        spritesets;
        loadSprites() {
            Main.debugView.log("Loading sprites...");
            this.spritesets = [];
            this.spritesets[0] = {};
            this.spritesets[1] = {};
            this.spritesets[2] = {};
            _.map(this.spriteNames, this.loadSprite, this);
        }
        loadSprite(name) {
            if(this.renderer.upscaledRendering) {
                this.spritesets[0][name] = new Assets.Sprite(name, 1);
            } else {
                this.spritesets[1][name] = new Assets.Sprite(name, 2);
                if(!this.renderer.mobile && !this.renderer.tablet) {
                    this.spritesets[2][name] = new Assets.Sprite(name, 3);
                }
            }
        }
        update():boolean{
            return true;
        }
        // update(timeStamp:number):boolean{
        //     var now = timeStamp;
        //     var time = this.time;
        //     var pass = now - time;
        //     //console.log("moveStar: ",(1000 / pass).toFixed(5));
        //     //Main.debugView.log("moveStar: "+(1000 / pass).toFixed(5)+"_index"+this.index,"Core");
        //     this.time = now;
        //     //Every 30 frame.update.
        //     if(this.frameControler)
        //     {
        //         this.renderer.update();
        //     }
        //     this.frameControler=!this.frameControler;
        //     this.index++;
        //     return true;
        // }
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
        infoManager = new Content.InfoManager(this);

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
    // sprites
    spriteNames = ["hand", "sword", "loot", "target", "talk", "sparks", "shadow16", "rat", "skeleton", "skeleton2", "spectre", "boss", "deathknight",
                                "ogre", "crab", "snake", "eye", "bat", "goblin", "wizard", "guard", "king", "villagegirl", "villager", "coder", "agent", "rick", "scientist", "nyan", "priest",
                                "sorcerer", "octocat", "beachnpc", "forestnpc", "desertnpc", "lavanpc", "clotharmor", "leatherarmor", "mailarmor",
                                "platearmor", "redarmor", "goldenarmor", "firefox", "death", "sword1", "axe", "chest",
                                "sword2", "redsword", "bluesword", "goldensword", "item-sword2", "item-axe", "item-redsword", "item-bluesword", "item-goldensword", "item-leatherarmor", "item-mailarmor",
                                "item-platearmor", "item-redarmor", "item-goldenarmor", "item-flask", "item-cake", "item-burger", "morningstar", "item-morningstar", "item-firepotion"];
	}
}
