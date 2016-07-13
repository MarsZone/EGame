module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Core extends egret.DisplayObjectContainer{
            public constructor(render:Content.Render,map:Gmap.Map,net:NetWork.Net) {
                super();
                this.renderer = render;
                this.map = map;
                this.net = net;
                // Player
                this.player = new Role.Warrior("player", "");
                this.player.moveUp = false;
                this.player.moveDown = false;
                this.player.moveLeft = false;
                this.player.moveRight = false;
                this.player.disableKeyboardNpcTalk = false;
                this.init("",this.started_callback);
            }
            player:Role.Warrior;
            ready = false;
            started = false;
            hasNeverStarted = true;
            updater = null;
            pathfinder = null;
            chatinput = null;
            bubbleManager = null;
            audioManager = null;

        // Game state
            entities = <any>{};
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
            hoveringCollidingTile = false;e

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
        isStopped;
        spriteNames = ["hand", "sword", "loot", "target", "talk", "sparks", "shadow16", "rat", "skeleton", "skeleton2", "spectre", "boss", "deathknight",
                                    "ogre", "crab", "snake", "eye", "bat", "goblin", "wizard", "guard", "king", "villagegirl", "villager", "coder", "agent", "rick", "scientist", "nyan", "priest",
                                    "sorcerer", "octocat", "beachnpc", "forestnpc", "desertnpc", "lavanpc", "clotharmor", "leatherarmor", "mailarmor",
                                    "platearmor", "redarmor", "goldenarmor", "firefox", "death", "sword1", "axe", "chest",
                                    "sword2", "redsword", "bluesword", "goldensword", "item-sword2", "item-axe", "item-redsword", "item-bluesword", "item-goldensword", "item-leatherarmor", "item-mailarmor",
                                    "item-platearmor", "item-redarmor", "item-goldenarmor", "item-flask", "item-cake", "item-burger", "morningstar", "item-morningstar", "item-firepotion"];
         
        public static CoreSrcName: string = "Net";

        started_callback(result){
                if(result.success === true) {
                //this.start();
                } else {
                    //self.setPlayButtonState(true);
                    switch(result.reason) {
                        case 'invalidlogin':
                            // Login information was not correct (either username or password)
                            //self.addValidationError(null, 'The username or password you entered is incorrect.');
                            break;
                        case 'userexists':
                            // Attempted to create a new user, but the username was taken
                            //self.addValidationError(self.getUsernameField(), 'The username you entered is not available.');
                            break;
                        case 'invalidusername':
                            // The username contains characters that are not allowed (rejected by the sanitizer)
                            //self.addValidationError(self.getUsernameField(), 'The username you entered contains invalid characters.');
                            break;
                        case 'loggedin':
                            // Attempted to log in with the same user multiple times simultaneously
                            //self.addValidationError(self.getUsernameField(), 'A player with the specified username is already logged in.');
                            break;
                        default:
                            //self.addValidationError(null, 'Failed to launch the game: ' + (result.reason ? result.reason : '(reason unknown)'));
                            break;
                    }
                }
            }
            map:Gmap.Map;
            net:NetWork.Net;
            renderer:Content.Render;
            index=0;
            frameControler:boolean=true;
            private time:number = 0;
            camera;

            setUpdater(updater:Common.Updater) {
                this.updater = updater;
            }

            setPathfinder(pathfinder) {
                this.pathfinder = pathfinder;
            }
            dotest;
            init(action="",started_callback){
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
                        Main.debugView.log('All sprites loaded.',Core.CoreSrcName);
                        
                        self.initAnimations();
                        self.initShadows();

                        self.initEntityGrid();
                        self.initItemGrid();
                        self.initPathingGrid();
                        self.initRenderingGrid();

                        self.setPathfinder(new Tools.Pathfinder(self.map.width, self.map.height));

                        self.initPlayer();
                        //self.setCursor("hand");

                        self.connect(action, started_callback);

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
                Main.debugView.log("Initialized the entity grid.",Core.CoreSrcName);
            }
            initItemGrid() {
                this.itemGrid = [];
                for(var i=0; i < this.map.height; i += 1) {
                    this.itemGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.itemGrid[i][j] = {};
                    }
                }
                Main.debugView.log("Initialized the item grid.",Core.CoreSrcName);
            }
            initPathingGrid() {
                this.pathingGrid = [];
                for(var i=0; i < this.map.height; i += 1) {
                    this.pathingGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.pathingGrid[i][j] = this.map.grid[i][j];
                    }
                }
                Main.debugView.log("Initialized the pathing grid with static colliding cells.",Core.CoreSrcName);
            }
            initRenderingGrid() {
                this.renderingGrid = [];
                for(var i=0; i < this.map.height; i += 1) {
                    this.renderingGrid[i] = [];
                    for(var j=0; j < this.map.width; j += 1) {
                        this.renderingGrid[i][j] = {};
                    }
                }
                Main.debugView.log("Initialized the rendering grid.",Core.CoreSrcName);
            }
            shadows;
            initShadows() {
                this.shadows = {};
                this.shadows["small"] = this.sprites["shadow16"];
            }
            initPlayer(){
                //this.player.setSprite(this.sprites[this.player.getSpriteName()]);
                //this.player.idle();
            }
            initAnimatedTiles() {
                var self = this,
                    m = this.map;

                this.animatedTiles = [];
                this.forEachVisibleTile(function (id, index) {
                    if(m.isAnimatedTile(id)) {
                        var tile = new Assets.AnimatedTile(id, m.getTileAnimationLength(id), m.getTileAnimationDelay(id), index),
                            pos = self.map.tileIndexToGridPosition(tile.index);

                        tile.x = pos.x;
                        tile.y = pos.y;
                        self.animatedTiles.push(tile);
                    }
                }, 1);
                //log.info("Initialized animated tiles.");
            }

            // intervalTest(core):void{
            //     Main.debugView.log("After 100 "+core.dotest);
            //     clearInterval(core.dotest);
            // }
            spritesets;
            loadSprites() {
                Main.debugView.log("Loading sprites...",Core.CoreSrcName);
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
         //update(timeStamp:number):boolean{
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
        tick(timeStamp:number):boolean {
            this.currentTime = new Date().getTime();
            //egret.startTick(this.update,this);
            if(this.started) {
                //this.updateCursorLogic();
                this.updater.update();
                this.renderer.renderFrame();
            }
            // if(!this.isStopped) {
            //     requestAnimFrame(this.tick.bind(this));
            // }
            return true;
        }

        start() {
            egret.startTick(this.tick,this);
            this.hasNeverStarted = false;
            Main.debugView.log("Game loop started.");
        }

        stop() {
            egret.stopTick(this.tick,this);
            Main.debugView.log("Game stopped.");
            this.isStopped = true;
        }

        entityIdExists(id) {
            return id in this.entities;
        }

        getEntityById(id) {
            if(id in this.entities) {
                return this.entities[id];
            }
            else {
                Main.debugView.log("Unknown entity id : " + id);
            }
        }

            connecting;
            host="127.0.0.1";
            port="8000";
            obsoleteEntities=<any>{};
            playerId;
            connect(action, started_callback){
                var self = this;            
                this.connecting = false; // always in dispatcher mode in the build version
                this.net.connect(this.host, this.port);
                this.net.fail_callback = function(reason){
                    started_callback({
                        success: false,
                        reason: reason
                    });
                    self.started = false;
                };
                
                this.net.onConnected(function() {
                    Main.debugView.log("Starting client/server handshake",this.CoreSrcName);

                    self.started = true;
                    if(action === 'create') {
                        //self.client.sendCreate(self.player);
                    } else {
                        //self.client.sendLogin(self.player);
                    }
                    self.net.sendLogin();
                });
                this.net.onEntityList(function(list) {
                    var entityIds = _.pluck(self.entities, 'id'),
                        knownIds = _.intersection(entityIds, list),
                        newIds = _.difference(list, knownIds);

                    self.obsoleteEntities = _.reject(self.entities, function(entity:Common.Entity) {
                        return _.include(knownIds, entity.id) || entity.id === self.player.id;
                    });

                    // Destroy entities outside of the player's zone group
                    self.removeObsoleteEntities();

                    // Ask the server for spawn information about unknown entities
                    if(_.size(newIds) > 0) {
                        self.net.sendWho(newIds);
                    }
                });
                
                this.net.onWelcome(function(id, name, x, y, hp, armor, weapon,
                                           avatar, weaponAvatar, experience) {
                     //Main.debugView.log("id"+id+"|name:"+name,Core.CoreSrcName);
                    Main.debugView.log("Received player ID from server : "+ id,Core.CoreSrcName);
                    self.player.id = id;
                    self.playerId = id;
                    // Always accept name received from the server which will
                    // sanitize and shorten names exceeding the allowed length.
                    self.player.name = name;
                    self.player.setGridPosition(x, y);
                    self.player.setMaxHitPoints(hp);
                    self.player.setArmorName(armor);
                    self.player.setSpriteName(avatar);
                    self.player.setWeaponName(weapon);
                    self.initPlayer();
                    self.player.experience = experience;
                    self.player.level = Types.getLevel(experience);

                    self.updateBars();
                    self.updateExpBar();
                    self.resetCamera();
                    self.updatePlateauMode();
                    self.audioManager.updateMusic();

                    self.addEntity(self.player);



                    self.gamestart_callback();
                });
            }
            
            gamestart_callback;
            onGameStart(callback) {
             this.gamestart_callback = callback;
            }
            update():boolean{
                return true;
            }
           
        /**
         * Loops through all the entities currently present in the game.
         * @param {Function} callback The function to call back (must accept one entity argument).
         */
        forEachEntity(callback) {
            _.each(this.entities, function(entity) {
                callback(entity);
            });
        }

        /**
         * Same as forEachEntity but only for instances of the Mob subclass.
         * @see forEachEntity
         */
        forEachMob(callback) {
            _.each(this.entities, function(entity) {
                if(entity instanceof Role.Mob) {
                    callback(entity);
                }
            });
        }

        /**
         * Loops through all entities visible by the camera and sorted by depth :
         * Lower 'y' value means higher depth.
         * Note: This is used by the Renderer to know in which order to render entities.
         */
        forEachVisibleEntityByDepth(callback) {
            var self = this,
                m = this.map;

            this.camera.forEachVisiblePosition(function(x, y) {
                if(!m.isOutOfBounds(x, y)) {
                    if(self.renderingGrid[y][x]) {
                        _.each(self.renderingGrid[y][x], function(entity) {
                            callback(entity);
                        });
                    }
                }
            }, this.renderer.mobile ? 0 : 2);
        }

        /**
         *
         */
        forEachVisibleTileIndex(callback, extra) {
            var m = this.map;

            this.camera.forEachVisiblePosition(function(x, y) {
                if(!m.isOutOfBounds(x, y)) {
                    callback(m.GridPositionToTileIndex(x, y) - 1);
                }
            }, extra);
        }

        /**
         *
         */
        forEachVisibleTile(callback, extra) {
            var self = this,
                m = this.map;

            if(m.isLoaded) {
                this.forEachVisibleTileIndex(function(tileIndex) {
                    if(_.isArray(m.data[tileIndex])) {
                        _.each(m.data[tileIndex], function(id:any) {
                            callback((id-1), tileIndex);
                        });
                    }
                    else {
                        if(_.isNaN(m.data[tileIndex]-1)) {
                            //throw Error("Tile number for index:"+tileIndex+" is NaN");
                        } else {
                            callback(m.data[tileIndex]-1, tileIndex);
                        }
                    }
                }, extra);
            }
        }

        /**
         *
         */
        forEachAnimatedTile(callback) {
            if(this.animatedTiles) {
                _.each(this.animatedTiles, function(tile) {
                    callback(tile);
                });
            }
        }


        removeObsoleteEntities() {
                var nb = _.size(this.obsoleteEntities),
                    self = this;

                if(nb > 0) {
                    _.each(this.obsoleteEntities, function(entity:Common.Entity) {
                        if(entity.id != self.player.id) { // never remove yourself
                            self.removeEntity(entity);
                        }
                    });
                    Main.debugView.log("Removed "+nb+" entities: "+_.pluck(_.reject(this.obsoleteEntities, function(id) { return id === self.player.id }), 'id'),Core.CoreSrcName);
                    this.obsoleteEntities = null;
                }
        }
        currentTime;
        addEntity(entity) {
            var self = this;

            if(this.entities[entity.id] === undefined) {
                this.entities[entity.id] = entity;
                this.registerEntityPosition(entity);

                if(!(entity instanceof Common.Item && entity.wasDropped)
                && !(this.renderer.mobile || this.renderer.tablet)) {
                    entity.fadeIn(this.currentTime);
                }

                if(this.renderer.mobile || this.renderer.tablet) {
                    entity.onDirty(function(e) {
                        if(self.camera.isVisible(e)) {
                            e.dirtyRect = self.renderer.getEntityBoundingRect(e);
                            //self.checkOtherDirtyRects(e.dirtyRect, e, e.gridX, e.gridY);
                        }
                    });
                }
            }
            else {
                Main.debugView.log("This entity already exists : " + entity.id + " ("+entity.kind+")",Core.CoreSrcName);
            }
        }


        removeEntity(entity) {
            if(entity.id in this.entities) {
                this.unregisterEntityPosition(entity);
                delete this.entities[entity.id];
            }
            else {
                Main.debugView.log("Cannot remove entity. Unknown ID : " + entity.id,"Error");
            }
        }

        /**
         * Clears the position(s) of this entity in the entity grid.
         *
         * @param {Entity} entity The moving entity
         */
        unregisterEntityPosition(entity) {
            if(entity) {
                this.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                this.removeFromPathingGrid(entity.gridX, entity.gridY);

                this.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);

                if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                    this.removeFromEntityGrid(entity, entity.nextGridX, entity.nextGridY);
                    this.removeFromPathingGrid(entity.nextGridX, entity.nextGridY);
                }
            }
        }

        registerEntityPosition(entity) {
            var x = entity.gridX,
                y = entity.gridY;

            if(entity) {
                if(entity instanceof Common.Character || entity instanceof Common.Chest) {
                    this.entityGrid[y][x][entity.id] = entity;
                    if(!(entity instanceof Player)) {
                        this.pathingGrid[y][x] = 1;
                    }
                }
                if(entity instanceof Common.Item) {
                    this.itemGrid[y][x][entity.id] = entity;
                }

                this.addToRenderingGrid(entity, x, y);
            }
        }

        addToRenderingGrid(entity, x, y) {
            if(!this.map.isOutOfBounds(x, y)) {
                this.renderingGrid[y][x][entity.id] = entity;
            }
        }

        removeFromRenderingGrid(entity, x, y) {
            if(entity && this.renderingGrid[y][x] && entity.id in this.renderingGrid[y][x]) {
                delete this.renderingGrid[y][x][entity.id];
            }
        }

        removeFromEntityGrid(entity, x, y) {
            if(this.entityGrid[y][x][entity.id]) {
                delete this.entityGrid[y][x][entity.id];
            }
        }

        removeFromItemGrid(item, x, y) {
            if(item && this.itemGrid[y][x][item.id]) {
                delete this.itemGrid[y][x][item.id];
            }
        }

        removeFromPathingGrid(x, y) {
            this.pathingGrid[y][x] = 0;
        }
        playerhp_callback;
        updateBars() {
            if(this.player && this.playerhp_callback) {
                this.playerhp_callback(this.player.hitPoints, this.player.maxHitPoints);
            }
        }
        playerexp_callback;
        updateExpBar(){
            if(this.player && this.playerexp_callback){
                var expInThisLevel = this.player.experience - Types.expForLevel[this.player.level-1];
                var expForLevelUp = Types.expForLevel[this.player.level] - Types.expForLevel[this.player.level-1];
                this.playerexp_callback(expInThisLevel, expForLevelUp);
            }
        }
         /**
         *
         */
        isZoningTile(x, y) {
            var c = this.camera;

            x = x - c.gridX;
            y = y - c.gridY;

            if(x === 0 || y === 0 || x === c.gridW-1 || y === c.gridH-1) {
                return true;
            }
            return false;
        }

        /**
         *
         */
        getZoningOrientation(x, y) {
            var orientation = "",
                c = this.camera;

            x = x - c.gridX;
            y = y - c.gridY;

            if(x === 0) {
                orientation = ""+Types.Orientations.LEFT;
            }
            else if(y === 0) {
                orientation = ""+Types.Orientations.UP;
            }
            else if(x === c.gridW-1) {
                orientation = ""+Types.Orientations.RIGHT;
            }
            else if(y === c.gridH-1) {
                orientation = ""+Types.Orientations.DOWN;
            }

            return orientation;
        }
        zoningOrientation;
        startZoningFrom(x, y) {
            this.zoningOrientation = this.getZoningOrientation(x, y);

            if(this.renderer.mobile || this.renderer.tablet) {
                var z = this.zoningOrientation,
                    c = this.camera,
                    ts = this.renderer.tilesize,
                    x = c.x,
                    y = c.y,
                    xoffset = (c.gridW - 2) * ts,
                    yoffset = (c.gridH - 2) * ts;

                if(z === Types.Orientations.LEFT || z === Types.Orientations.RIGHT) {
                    x = (z === Types.Orientations.LEFT) ? c.x - xoffset : c.x + xoffset;
                } else if(z === Types.Orientations.UP || z === Types.Orientations.DOWN) {
                    y = (z === Types.Orientations.UP) ? c.y - yoffset : c.y + yoffset;
                }
                c.setPosition(x, y);

                this.renderer.clearScreen();
                this.endZoning();

                // Force immediate drawing of all visible entities in the new zone
                this.forEachVisibleEntityByDepth(function(entity) {
                    entity.setDirty();
                });
            }
            else {
                this.currentZoning = new Common.Transition();
            }
            //this.bubbleManager.clean();
            this.net.sendZone();
        }

        enqueueZoningFrom(x, y) {
            this.zoningQueue.push({x: x, y: y});

            if(this.zoningQueue.length === 1) {
                this.startZoningFrom(x, y);
            }
        }

        endZoning() {
            this.currentZoning = null;
            this.resetZone();
            this.zoningQueue.shift();

            if(this.zoningQueue.length > 0) {
                var pos = this.zoningQueue[0];
                this.startZoningFrom(pos.x, pos.y);
            }
        }

        isZoning() {
            return !_.isNull(this.currentZoning);
        }

        resetZone() {
            //this.bubbleManager.clean();
            this.initAnimatedTiles();
            this.renderer.renderStaticCanvases();
        }

        resetCamera() {
            this.camera.focusEntity(this.player);
            this.resetZone();
        }

        /**
         * Change player plateau mode when necessary
         */
        updatePlateauMode() {
            if(this.map.isPlateau(this.player.gridX, this.player.gridY)) {
                this.player.isOnPlateau = true;
            } else {
                this.player.isOnPlateau = false;
            }
        }

        updatePlayerCheckpoint() {
            var checkpoint = this.map.getCurrentCheckpoint(this.player);

            if(checkpoint) {
                var lastCheckpoint = this.player.lastCheckpoint;
                if(!lastCheckpoint || (lastCheckpoint && lastCheckpoint.id !== checkpoint.id)) {
                    this.player.lastCheckpoint = checkpoint;
                    this.net.sendCheck(checkpoint.id);
                }
            }
        }
    }
}
