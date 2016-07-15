module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Core extends egret.EventDispatcher{
            public constructor(render:Render,map:Gmap.Map,net:NetWork.Net) {
                super();
                this.renderer = render;
                this.map = map;
                this.net = net;
                var bubbleSp = new egret.Sprite();
                this.bubbleManager = new Tools.BubbleManager(bubbleSp);
                // Player
                this.player = new Role.Warrior("player", "");
                this.player.moveUp = false;
                this.player.moveDown = false;
                this.player.moveLeft = false;
                this.player.moveRight = false;
                this.player.disableKeyboardNpcTalk = false;
                this.renderer.setCore(this);
                this.init("",this.started_callback);    
            }
            
            map:Gmap.Map;
            net:NetWork.Net;
            renderer:Content.Render;
            index=0;
            frameControler:boolean=true;
            private time:number = 0;
            camera:Camera;

            player:Role.Warrior;
            ready = false;
            started = false;
            hasNeverStarted = true;
            updater:Common.Updater = null;
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
            addItem(item, x, y) {
                item.setSprite(this.sprites[item.getSpriteName()]);
                item.setGridPosition(x, y);
                item.setAnimation("idle", 150);
                this.addEntity(item);
            }

            removeItem(item) {
                if(item) {
                    this.removeFromItemGrid(item, item.gridX, item.gridY);
                    this.removeFromRenderingGrid(item, item.gridX, item.gridY);
                    delete this.entities[item.id];
                } else {
                    Main.debugView.log("Cannot remove item. Unknown ID : " + item.id);
                }
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
                if(Render.upscaledRendering) {
                    this.spritesets[0][name] = new Assets.Sprite(name, 1);
                } else {
                    this.spritesets[1][name] = new Assets.Sprite(name, 2);
                    if(!Render.mobile && !Render.tablet) {
                        this.spritesets[2][name] = new Assets.Sprite(name, 3);
                    }
                }
            }
            /**
             * Registers the entity at two adjacent positions on the grid at the same time.
             * This situation is temporary and should only occur when the entity is moving.
             * This is useful for the hit testing algorithm used when hovering entities with the mouse cursor.
             *
             * @param {Entity} entity The moving entity
             */
            registerEntityDualPosition(entity) {
                if(entity) {
                    this.entityGrid[entity.gridY][entity.gridX][entity.id] = entity;

                    this.addToRenderingGrid(entity, entity.gridX, entity.gridY);

                    if(entity.nextGridX >= 0 && entity.nextGridY >= 0) {
                        this.entityGrid[entity.nextGridY][entity.nextGridX][entity.id] = entity;
                        if(!(entity instanceof Player)) {
                            this.pathingGrid[entity.nextGridY][entity.nextGridX] = 1;
                        }
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
                //self.audioManager.updateMusic();

                self.addEntity(self.player);
                self.showNotification("Welcome to BrowserQuest!");

                self.player.onStartPathing(function(path) {
                    var i = path.length - 1,
                        x =  path[i][0],
                        y =  path[i][1];

                    if(self.player.isMovingToLoot()) {
                        self.player.isLootMoving = false;
                    }
                    else if(!self.player.isAttacking()) {
                        self.net.sendMove(x, y);
                    }

                    // Target cursor position
                    self.selectedX = x;
                    self.selectedY = y;

                    self.selectedCellVisible = true;

                    if(Render.mobile || Render.tablet) {
                        self.drawTarget = true;
                        self.clearTarget = true;
                        self.renderer.targetRect = self.renderer.getTargetBoundingRect();
                        self.checkOtherDirtyRects(self.renderer.targetRect, null, self.selectedX, self.selectedY);
                    }
                });

                self.player.onCheckAggro(function() {
                    self.forEachMob(function(mob) {
                        if(mob.isAggressive && !mob.isAttacking() && self.player.isNear(mob, mob.aggroRange)) {
                            self.player.aggro(mob);
                        }
                    });
                });

                self.player.onAggro(function(mob) {
                    if(!mob.isWaitingToAttack(self.player) && !self.player.isAttackedBy(mob)) {
                        self.player.log_info("Aggroed by " + mob.id + " at ("+self.player.gridX+", "+self.player.gridY+")");
                        self.net.sendAggro(mob);
                        mob.waitToAttack(self.player);
                    }
                });

                self.player.onBeforeStep(function() {
                    var blockingEntity = self.getEntityAt(self.player.nextGridX, self.player.nextGridY);
                    if(blockingEntity && blockingEntity.id !== self.playerId) {
                        Main.debugView.log("Blocked by " + blockingEntity.id);
                    }
                    self.unregisterEntityPosition(self.player);
                });

                self.player.onStep(function() {
                    if(self.player.hasNextStep()) {
                        self.registerEntityDualPosition(self.player);
                    }

                    if(self.isZoningTile(self.player.gridX, self.player.gridY)) {
                        self.enqueueZoningFrom(self.player.gridX, self.player.gridY);
                    }

                    self.player.forEachAttacker(self.makeAttackerFollow);

                    var item = self.getItemAt(self.player.gridX, self.player.gridY);
                    if(item instanceof Common.Item) {
                        self.tryLootingItem(item);
                    }

                    self.updatePlayerCheckpoint();

                    if(!self.player.isDead) {
                        self.audioManager.updateMusic();
                    }
                });

                self.player.onStopPathing(function(x, y) {
                    if(self.player.hasTarget()) {
                        self.player.lookAtTarget();
                    }

                    self.selectedCellVisible = false;

                    if(self.isItemAt(x, y)) {
                        var item = self.getItemAt(x, y);
                        self.tryLootingItem(item);
                    }

                    if(!self.player.hasTarget() && self.map.isDoor(x, y)) {
                        var dest = self.map.getDoorDestination(x, y);

                        self.player.setGridPosition(dest.x, dest.y);
                        self.player.nextGridX = dest.x;
                        self.player.nextGridY = dest.y;
                        self.player.turnTo(dest.orientation);
                        self.net.sendTeleport(dest.x, dest.y);

                        if(Render.mobile && dest.cameraX && dest.cameraY) {
                            self.camera.setGridPosition(dest.cameraX, dest.cameraY);
                            self.resetZone();
                        } else {
                            if(dest.portal) {
                                self.assignBubbleTo(self.player);
                            } else {
                                self.camera.focusEntity(self.player);
                                self.resetZone();
                            }
                        }

                        self.player.forEachAttacker(function(attacker) {
                            attacker.disengage();
                            attacker.idle();
                        });

                        self.updatePlateauMode();

                        if(Render.mobile || Render.tablet) {
                            // When rendering with dirty rects, clear the whole screen when entering a door.
                            self.renderer.clearScreen();
                        }

                        if(dest.portal) {
                            self.audioManager.playSound("teleport");
                        }

                        if(!self.player.isDead) {
                            self.audioManager.updateMusic();
                        }
                    }

                    if(self.player.target instanceof Role.Npc) {
                        self.makeNpcTalk(self.player.target);
                    } else if(self.player.target instanceof Common.Chest) {
                        self.net.sendOpen(self.player.target);
                        self.audioManager.playSound("chest");
                    }

                    self.player.forEachAttacker(function(attacker) {
                        if(!attacker.isAdjacentNonDiagonal(self.player)) {
                            attacker.follow(self.player);
                        }
                    });

                    self.unregisterEntityPosition(self.player);
                    self.registerEntityPosition(self.player);
                });

                self.player.onRequestPath(function(x, y) {
                    var ignored = [self.player]; // Always ignore self

                    if(self.player.hasTarget()) {
                        ignored.push(self.player.target);
                    }
                    return self.findPath(self.player, x, y, ignored);
                });

                 self.player.onDeath(function() {
                    Main.debugView.log(self.playerId + " is dead",Core.CoreSrcName);

                    self.player.stopBlinking();
                    self.player.setSprite(self.sprites["death"]);
                    self.player.animate("death", 120, 1, function() {
                        Main.debugView.log(self.playerId + " was removed",Core.CoreSrcName);

                        self.removeEntity(self.player);
                        self.removeFromRenderingGrid(self.player, self.player.gridX, self.player.gridY);

                        self.player = null;
                        self.net.disable();

                        setTimeout(function() {
                            self.playerdeath_callback();
                        }, 1000);
                    });

                    self.player.forEachAttacker(function(attacker) {
                        attacker.disengage();
                        attacker.idle();
                    });

                    //self.audioManager.fadeOutCurrentMusic();
                    //self.audioManager.playSound("death");
                });

                self.player.onHasMoved(function(player) {
                    self.assignBubbleTo(player);
                });
                // self.net.onPVPChange(function(pvpFlag){
                //     self.player.flagPVP(pvpFlag);
                //     if(pvpFlag){
                //         self.showNotification("PVP is on.");
                //     } else{
                //         self.showNotification("PVP is off.");
                //     }
                // });

                self.player.onArmorLoot(function(armorName) {
                    //self.player.switchArmor(self.sprites[armorName]);
                });

                self.player.onSwitchItem(function() {
                    // self.storage.savePlayer(self.renderer.getPlayerImage(),
                    //                         self.player.getArmorName(),
                    //                         self.player.getWeaponName(),
                    //                         self.player.getGuild());
                    if(self.equipment_callback) {
                        self.equipment_callback();
                    }
                });

                self.player.onInvincible(function() {
                    //self.invincible_callback();
                    //self.player.switchArmor(self.sprites["firefox"]);
                });

                self.net.onSpawnItem(function(item, x, y) {
                    Main.debugView.log("Spawned " + Types.getKindAsString(item.kind) + " (" + item.id + ") at "+x+", "+y);
                    self.addItem(item, x, y);
                });

                
                //self.start();
            });
        }
        clearTarget;
        drawTarget;;
        connecting;
        host="127.0.0.1";
        port="8000";
        obsoleteEntities=<any>{};
        playerId;
        playerdeath_callback;
        equipment_callback;
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
            }, Render.mobile ? 0 : 2);
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
        /**
         * Returns the entity located at the given position on the world grid.
         * @returns {Entity} the entity located at (x, y) or null if there is none.
         */
        getEntityAt(x, y) {
            if(this.map.isOutOfBounds(x, y) || !this.entityGrid) {
                return null;
            }

            var entities = this.entityGrid[y][x],
                entity = null;
            if(_.size(entities) > 0) {
                entity = entities[_.keys(entities)[0]];
            } else {
                entity = this.getItemAt(x, y);
            }
            return entity;
        }

        getMobAt(x, y) {
            var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Role.Mob)) {
                return entity;
            }
            return null;
        }

        getPlayerAt(x, y) {
          var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Player) && (entity !== this.player) && this.player.pvpFlag) {
                return entity;
            }
            return null;
        }

       getNpcAt(x, y) {
            var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Role.Npc)) {
                return entity;
            }
            return null;
        }

        getChestAt(x, y) {
            var entity = this.getEntityAt(x, y);
            if(entity && (entity instanceof Common.Chest)) {
                return entity;
            }
            return null;
        }

        getItemAt(x, y) {
            if(this.map.isOutOfBounds(x, y) || !this.itemGrid) {
                return null;
            }
            var items = this.itemGrid[y][x],
                item = null;

            if(_.size(items) > 0) {
                // If there are potions/burgers stacked with equipment items on the same tile, always get expendable items first.
                _.each(items, function(i:any) {
                    if(Types.isExpendableItem(i.kind)) {
                        item = i;
                    };
                });

                // Else, get the first item of the stack
                if(!item) {
                    item = items[_.keys(items)[0]];
                }
            }
            return item;
        }

        /**
         * Returns true if an entity is located at the given position on the world grid.
         * @returns {Boolean} Whether an entity is at (x, y).
         */
        isEntityAt(x, y) {
            return !_.isNull(this.getEntityAt(x, y));
        }

        isMobAt(x, y) {
            return !_.isNull(this.getMobAt(x, y));
        }
        isPlayerAt(x, y) {
            return !_.isNull(this.getPlayerAt(x, y));
        }

        isItemAt(x, y) {
            return !_.isNull(this.getItemAt(x, y));
        }

        isNpcAt(x, y) {
            return !_.isNull(this.getNpcAt(x, y));
        }

        isChestAt(x, y) {
            return !_.isNull(this.getChestAt(x, y));
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
                && !(Render.mobile || Render.tablet)) {
                    entity.fadeIn(this.currentTime);
                }

                if(Render.mobile || Render.tablet) {
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
        startZoningFrom(x:number, y:number) {
            this.zoningOrientation = this.getZoningOrientation(x, y);

            if(Render.mobile || Render.tablet) {
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

        makeAttackerFollow(attacker) {
              var target = attacker.target;

              if(attacker.isAdjacent(attacker.target)) {
                    attacker.lookAtTarget();
              } else {
                  attacker.follow(target);
              }
        }

        forEachEntityAround(x, y, r, callback) {
            for(var i = x-r, max_i = x+r; i <= max_i; i += 1) {
                for(var j = y-r, max_j = y+r; j <= max_j; j += 1) {
                    if(!this.map.isOutOfBounds(i, j)) {
                        _.each(this.renderingGrid[j][i], function(entity) {
                            callback(entity);
                        });
                    }
                }
            }
        }

        

        checkOtherDirtyRects(r1, source, x, y) {
            var r = this.renderer;

            this.forEachEntityAround(x, y, 2, function(e2) {
                if(source && source.id && e2.id === source.id) {
                    return;
                }
                if(!e2.isDirty) {
                    var r2 = r.getEntityBoundingRect(e2);
                    if(r.isIntersecting(r1, r2)) {
                        e2.setDirty();
                    }
                }
            });

            if(source && !(source.hasOwnProperty("index"))) {
                this.forEachAnimatedTile(function(tile) {
                    if(!tile.isDirty) {
                        var r2 = r.getTileBoundingRect(tile);
                        if(r.isIntersecting(r1, r2)) {
                            tile.isDirty = true;
                        }
                    }
                });
            }

            if(!this.drawTarget && this.selectedCellVisible) {
                var targetRect = r.getTargetBoundingRect();
                if(r.isIntersecting(r1, targetRect)) {
                    this.drawTarget = true;
                    this.renderer.targetRect = targetRect;
                }
            }
        }

        tryLootingItem(item) {
            try {
                this.player.loot(item);
                this.net.sendLoot(item); // Notify the server that this item has been looted
                this.removeItem(item);
                this.showNotification(item.getLootMessage());
                if(Types.isHealingItem(item.kind)) {
                    this.audioManager.playSound("heal");
                } else {
                    this.audioManager.playSound("loot");
                }
            } catch(e) {
                if(e instanceof Exceptions.LootException) {
                    this.showNotification(e.message);
                    this.audioManager.playSound("noloot");
                } else {
                    throw e;
                }
            }
        }
        notification_callback;
        showNotification(message) {
            if(this.notification_callback) {
                this.notification_callback(message);
            }
        }

        createBubble(id, message) {
            this.bubbleManager.create(id, message, this.currentTime);
        }

        destroyBubble(id) {
            this.bubbleManager.destroyBubble(id);
        }

        assignBubbleTo(character) {
            var bubble = this.bubbleManager.getBubbleById(character.id);

            if(bubble) {
                var s = this.renderer.scale,
                    t = 16 * s, // tile size
                    x = ((character.x - this.camera.x) * s),
                    w = parseInt(bubble.element.css('width')) + 24,
                    offset = (w / 2) - (t / 2),
                    offsetY,
                    y;

                if(character instanceof Role.Npc) {
                    offsetY = 0;
                } else {
                    if(s === 2) {
                        if(Render.mobile) {
                            offsetY = 0;
                        } else {
                            offsetY = 15;
                        }
                    } else {
                        offsetY = 12;
                    }
                }

                y = ((character.y - this.camera.y) * s) - (t * 2) - offsetY;

                bubble.element.css('left', x - offset + 'px');
                bubble.element.css('top', y + 'px');
            }
        }

        
        /**
         *
         */
        makeNpcTalk(npc) {
            var msg;

            if(npc) {
                msg = npc.talk(this);
                this.previousClickPosition = {};
                if(msg) {
                    this.createBubble(npc.id, msg);
                    this.assignBubbleTo(npc);
                    this.audioManager.playSound("npc");
                } else {
                    this.destroyBubble(npc.id);
                    this.audioManager.playSound("npc-end");
                }
            }
        }

        /**
         * Finds a path to a grid position for the specified character.
         * The path will pass through any entity present in the ignore list.
         */
        findPath(character, x, y, ignoreList) {
            var self = this,
                grid = this.pathingGrid,
                path = [],
                isPlayer = (character === this.player);

            if(this.map.isColliding(x, y)) {
                return path;
            }

            if(this.pathfinder && character) {
                if(ignoreList) {
                    _.each(ignoreList, function(entity) {
                        self.pathfinder.ignoreEntity(entity);
                    });
                }

                path = this.pathfinder.findPath(grid, character, x, y, false);

                if(ignoreList) {
                    this.pathfinder.clearIgnoreList();
                }
            } else {
                Main.debugView.log("Error while finding the path to "+x+", "+y+" for "+character.id,Core.CoreSrcName);
            }
            return path;
        }
    }
}
