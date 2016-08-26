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
                this.bubbleContainer = this.renderer.bubbleContainer;
                this.bubbleManager = new Tools.BubbleManager(this.bubbleContainer);
                // Player
                this.player = new Role.Warrior("player", "");
                this.player.moveUp = false;
                this.player.moveDown = false;
                this.player.moveLeft = false;
                this.player.moveRight = false;
                this.player.disableKeyboardNpcTalk = false;
                this.renderer.setCore(this);
                this.init();    
            }
            bubbleContainer:egret.Sprite;
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
            previousClickPosition = <any>{};

            cursorVisible = true;
            selectedX = 0;
            selectedY = 0;
            selectedCellVisible = false;
            targetColor = 0xFFFFFF;
            targetAlpha = 0.5;
            targetCellVisible = true;
            hoveringTarget = false;
            hoveringPlayer = false;
            hoveringMob = false;
            hoveringItem = false;
            hoveringNpc = false;
            hoveringChest = false;
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
        isStopped;
        spriteNames = ["hand", "sword", "loot", "target", "talk", "sparks", "shadow16", "rat", "skeleton", "skeleton2", "spectre", "boss", "deathknight",
                                    "ogre", "crab", "snake", "eye", "bat", "goblin", "wizard", "guard", "king", "villagegirl", "villager", "coder", "agent", "rick", "scientist", "nyan", "priest",
                                    "sorcerer", "octocat", "beachnpc", "forestnpc", "desertnpc", "lavanpc", "clotharmor", "leatherarmor", "mailarmor",
                                    "platearmor", "redarmor", "goldenarmor", "firefox", "death", "sword1", "axe", "chest",
                                    "sword2", "redsword", "bluesword", "goldensword", "item-sword2", "item-axe", "item-redsword", "item-bluesword", "item-goldensword", "item-leatherarmor", "item-mailarmor",
                                    "item-platearmor", "item-redarmor", "item-goldenarmor", "item-flask", "item-cake", "item-burger", "morningstar", "item-morningstar", "item-firepotion"];
         
        public static CoreSrcName: string = "Core";

        
        setSpriteScale(scale) {
                var self = this;

                if(Render.upscaledRendering) {
                    this.sprites = this.spritesets[0];
                } else {
                    this.sprites = this.spritesets[scale - 1];

                    _.each(this.entities, function(entity:Common.Entity) {
                        entity.sprite = null;
                        entity.setSprite(self.sprites[entity.getSpriteName()]);
                    });
                    this.initShadows();
                    this.initCursors();
                }
            }
            setUpdater(updater:Common.Updater) {
                this.updater = updater;
            }

            setPathfinder(pathfinder) {
                this.pathfinder = pathfinder;
            }
            dotest;
            init(){
                var self = this;
                //egret.startTick(this.update,this);
                //
                this.loadSprites();
                this.setUpdater(new Common.Updater(this));
                this.camera = this.renderer.camera;
                this.setSpriteScale(this.renderer.scale);
                //this.dotest=setInterval(this.intervalTest(this),100);
                //Main.debugView.log("Begin "+this.dotest);

                var wait = setInterval(function() {
                    if(self.map.isLoaded) {
                        self.ready = true;
                        Main.debugView.log('All sprites loaded.',Core.CoreSrcName);
                        
                        self.initCursors();
                        self.initAnimations();
                        self.initShadows();

                        self.initEntityGrid();
                        self.initItemGrid();
                        self.initPathingGrid();
                        self.initRenderingGrid();

                        self.setPathfinder(new Tools.Pathfinder(self.map.width, self.map.height));

                        //self.initPlayer();
                        self.setCursor("hand");

                        //self.connect(action, started_callback);

                        clearInterval(wait);
                    }
                }, 100);

            }
            login():void{
                //this.connect("create", started_callback);
            }
            create():void{
                //this.connect("login", started_callback);
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
                    Main.debugView.log("Cannot remove item. Unknown ID : " + item.id,Core.CoreSrcName);
                }
            }
            targetAnimation;
            sparksAnimation;
            initAnimations() {
                //this.targetAnimation = new Assets.Animation("idle_down", 4, 0, 16, 16);
                //this.targetAnimation.setSpeed(50);

                //this.sparksAnimation = new Assets.Animation("idle_down", 6, 0, 16, 16);
                //this.sparksAnimation.setSpeed(120);
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
            initCursors() {
                this.cursors["hand"] = this.sprites["hand"];
                this.cursors["sword"] = this.sprites["sword"];
                this.cursors["loot"] = this.sprites["loot"];
                this.cursors["target"] = this.sprites["target"];
                this.cursors["arrow"] = this.sprites["arrow"];
                this.cursors["talk"] = this.sprites["talk"];
                this.cursors["join"] = this.sprites["talk"];
            }

            initPlayer(){
                this.player.setSprite(this.sprites[this.player.getSpriteName()]);
                this.player.idle();
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
                        //this.spritesets[2][name] = new Assets.Sprite(name, 3);
                    }
                }
            }
            currentCursorOrientation;
            setCursor(name, orientation?) {
                if(name in this.cursors) {
                    this.currentCursor = this.cursors[name];
                    this.currentCursorOrientation = orientation;
                } else {
                    Main.debugView.log("Unknown cursor name :"+name,Core.CoreSrcName);
                }
            }

            updateCursorLogic() {
                if(this.hoveringCollidingTile && this.started) {
                    this.targetColor = 0xFF3232;
                }
                else {
                    this.targetColor = 0xFFFFFF;
                }
                
                if(this.hoveringPlayer && this.started) {
                    if(this.pvpFlag)
                        this.setCursor("sword");
                    else
                        this.setCursor("hand");
                    this.hoveringTarget = false;
                    this.hoveringMob = false;
                    this.targetCellVisible = false;
                } else if(this.hoveringMob && this.started) {
                    this.setCursor("sword");
                    this.hoveringTarget = false;
                    this.hoveringPlayer = false;
                    this.targetCellVisible = false;
    
                }
                else if(this.hoveringNpc && this.started) {
                    this.setCursor("talk");
                    this.hoveringTarget = false;
                    this.targetCellVisible = false;
                }
                else if((this.hoveringItem || this.hoveringChest) && this.started) {
                    this.setCursor("loot");
                    this.hoveringTarget = false;
                    this.targetCellVisible = true;
                }
                else {
                    this.setCursor("hand");
                    this.hoveringTarget = false;
                    this.hoveringPlayer = false;
                    this.targetCellVisible = true;
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
                this.updateCursorLogic();
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
            Main.debugView.log("Game loop started.",Core.CoreSrcName);
        }

        stop() {
            egret.stopTick(this.tick,this);
            Main.debugView.log("Game stopped.",Core.CoreSrcName);
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
                Main.debugView.log("Unknown entity id : " + id,Core.CoreSrcName);
            }
        }

        connect(action, started_callback:Common.LoginView){
            var self = this;            
            this.connecting = false; // always in dispatcher mode in the build version
            this.net.connect(this.host, this.port);
            this.net.fail_callback = function(reason){
                started_callback.started_callback({
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
                    self.net.sendCreate();
                } else {
                    //self.client.sendLogin(self.player);
                    self.net.sendLogin();
                }
                //self.net.sendLogin();
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

                    //if(Render.mobile || Render.tablet) {
                        self.drawTarget = true;
                        self.clearTarget = true;
                        self.renderer.targetRect = self.renderer.getTargetBoundingRect();
                        self.checkOtherDirtyRects(self.renderer.targetRect, null, self.selectedX, self.selectedY);
                    //}
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
                        Main.debugView.log("Blocked by " + blockingEntity.id,Core.CoreSrcName);
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
                        //self.audioManager.updateMusic();
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
                            self.renderer.clearContextScreen();
                        }

                        if(dest.portal) {
                            //self.audioManager.playSound("teleport");
                        }

                        if(!self.player.isDead) {
                            //self.audioManager.updateMusic();
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
                    Main.debugView.log("Spawned " + Types.getKindAsString(item.kind) + " (" + item.id + ") at "+x+", "+y,Core.CoreSrcName);
                    self.addItem(item, x, y);
                });

                // self.net.onSpawnChest(function(chest, x, y) {
                //     Main.debugView.log("Spawned chest (" + chest.id + ") at "+x+", "+y);
                //     chest.setSprite(self.sprites[chest.getSpriteName()]);
                //     chest.setGridPosition(x, y);
                //     chest.setAnimation("idle_down", 150);
                //     self.addEntity(chest);

                //     chest.onOpen(function() {
                //         chest.stopBlinking();
                //         chest.setSprite(self.sprites["death"]);
                //         chest.setAnimation("death", 120, 1, function() {
                //             Main.debugView.log(chest.id + " was removed");
                //             self.removeEntity(chest);
                //             self.removeFromRenderingGrid(chest, chest.gridX, chest.gridY);
                //             self.previousClickPosition = {};
                //         });
                //     });
                // });

                 self.net.onSpawnCharacter(function(entity, x, y, orientation, targetId) {
                    if(!self.entityIdExists(entity.id)) {
                        try {
                            if(entity.id !== self.playerId) {
                                entity.setSprite(self.sprites[entity.getSpriteName()]);
                                entity.setGridPosition(x, y);
                                entity.setOrientation(orientation);
                                entity.idle();

                                self.addEntity(entity);

                                Main.debugView.log("Spawned " + Types.getKindAsString(entity.kind) + " (" + entity.id + ") at "+entity.gridX+", "+entity.gridY,Core.CoreSrcName);

                                if(entity instanceof Common.Character) {
                                    entity.onBeforeStep(function() {
                                        self.unregisterEntityPosition(entity);
                                    });

                                    entity.onStep(function() {
                                        if(!entity.isDying) {
                                            self.registerEntityDualPosition(entity);

                                            if(self.player && self.player.target === entity) {
                                                self.makeAttackerFollow(self.player)
                                            }


                                            entity.forEachAttacker(function(attacker) {
                                                if(attacker.isAdjacent(attacker.target)) {
                                                    attacker.lookAtTarget();
                                                } else {
                                                    attacker.follow(entity);
                                                }
                                            });
                                        }
                                    });

                                    entity.onStopPathing(function(x, y) {
                                        if(!entity.isDying) {
                                            if(entity.hasTarget() && entity.isAdjacent(entity.target)) {
                                                entity.lookAtTarget();
                                            }

                                            if(entity instanceof Player) {
                                                var gridX = entity.destination.gridX,
                                                    gridY = entity.destination.gridY;

                                                if(self.map.isDoor(gridX, gridY)) {
                                                    var dest = self.map.getDoorDestination(gridX, gridY);
                                                    entity.setGridPosition(dest.x, dest.y);
                                                }
                                            }

                                            entity.forEachAttacker(function(attacker) {
                                                if(!attacker.isAdjacentNonDiagonal(entity) && attacker.id !== self.playerId) {
                                                    attacker.follow(entity);
                                                }
                                            });

                                            self.unregisterEntityPosition(entity);
                                            self.registerEntityPosition(entity);
                                        }
                                    });

                                    entity.onRequestPath(function(x, y) {
                                        var ignored = [entity], // Always ignore self
                                            ignoreTarget = function(target) {
                                                ignored.push(target);

                                                // also ignore other attackers of the target entity
                                                target.forEachAttacker(function(attacker) {
                                                    ignored.push(attacker);
                                                });
                                            };

                                        if(entity.hasTarget()) {
                                            ignoreTarget(entity.target);
                                        } else if(entity.previousTarget) {
                                            // If repositioning before attacking again, ignore previous target
                                            // See: tryMovingToADifferentTile()
                                            ignoreTarget(entity.previousTarget);
                                        }

                                        return self.findPath(entity, x, y, ignored);
                                    });

                                    entity.onDeath(function() {
                                        Main.debugView.log(entity.id + " is dead",Core.CoreSrcName);

                                        if(entity instanceof Role.Mob) {
                                            // Keep track of where mobs die in order to spawn their dropped items
                                            // at the right position later.
                                            self.deathpositions[entity.id] = {x: entity.gridX, y: entity.gridY};
                                        }

                                        entity.isDying = true;
                                        entity.setSprite(self.sprites[entity instanceof Mobs.Rat ? "rat" : "death"]);
                                        entity.animate("death", 120, 1, function() {
                                            Main.debugView.log(entity.id + " was removed",Core.CoreSrcName);

                                            self.removeEntity(entity);
                                            self.removeFromRenderingGrid(entity, entity.gridX, entity.gridY);
                                        });

                                        entity.forEachAttacker(function(attacker) {
                                            attacker.disengage();
                                        });

                                        if(self.player.target && self.player.target.id === entity.id) {
                                            self.player.disengage();
                                        }

                                        // Upon death, this entity is removed from both grids, allowing the player
                                        // to click very fast in order to loot the dropped item and not be blocked.
                                        // The entity is completely removed only after the death animation has ended.
                                        self.removeFromEntityGrid(entity, entity.gridX, entity.gridY);
                                        self.removeFromPathingGrid(entity.gridX, entity.gridY);

                                        if(self.camera.isVisible(entity)) {
                                            //self.audioManager.playSound("kill"+Math.floor(Math.random()*2+1));
                                        }

                                        self.updateCursor();
                                    });

                                    entity.onHasMoved(function(entity) {
                                        self.assignBubbleTo(entity); // Make chat bubbles follow moving entities
                                    });

                                    if(entity instanceof Role.Mob) {
                                        if(targetId) {
                                            var player = self.getEntityById(targetId);
                                            if(player) {
                                                self.createAttackLink(entity, player);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        catch(e) {
                            Main.debugView.log(e,"Error");
                        }
                    } else {
                        Main.debugView.log("Character "+entity.id+" already exists. Don't respawn.",Core.CoreSrcName);
                    }
                });

                self.net.onDespawnEntity(function(entityId) {
                    var entity = self.getEntityById(entityId);

                    if(entity) {
                        Main.debugView.log("Despawning " + Types.getKindAsString(entity.kind) + " (" + entity.id+ ")",Core.CoreSrcName);

                        if(entity.gridX === self.previousClickPosition.x
                        && entity.gridY === self.previousClickPosition.y) {
                            self.previousClickPosition = {};
                        }

                        if(entity instanceof Common.Item) {
                            self.removeItem(entity);
                        } else if(entity instanceof Common.Character) {
                            entity.forEachAttacker(function(attacker) {
                                if(attacker.canReachTarget()) {
                                    attacker.hit();
                                }
                            });
                            entity.die();
                        } else if(entity instanceof Common.Chest) {
                            entity.open();
                        }

                        entity.clean();
                    }
                });

                self.net.onItemBlink(function(id) {
                    var item = self.getEntityById(id);

                    if(item) {
                        item.blink(150);
                    }
                });

                self.net.onMemberConnect(function(name) {
					self.showNotification(name + " connected to your world.");//#updateguild
				});
				
				self.net.onMemberDisconnect(function(name) {
					self.showNotification(name + " lost connection with your world.");
				});

                self.net.onEntityMove(function(id, x, y) {
                    var entity = null;

                    if(id !== self.playerId) {
                        entity = self.getEntityById(id);

                        if(entity) {
                            if(self.player.isAttackedBy(entity)) {
                                //self.tryUnlockingAchievement("COWARD");
                            }
                            entity.disengage();
                            entity.idle();
                            self.makeCharacterGoTo(entity, x, y);
                        }
                    }
                });

                self.net.onEntityDestroy(function(id) {
                    var entity = self.getEntityById(id);
                    if(entity) {
                        if(entity instanceof Common.Item) {
                            self.removeItem(entity);
                        } else {
                            self.removeEntity(entity);
                        }
                        Main.debugView.log("Entity was destroyed: "+entity.id,Core.CoreSrcName);
                    }
                });

                self.net.onPlayerMoveToItem(function(playerId, itemId) {
                    var player, item;

                    if(playerId !== self.playerId) {
                        player = self.getEntityById(playerId);
                        item = self.getEntityById(itemId);

                        if(player && item) {
                            self.makeCharacterGoTo(player, item.gridX, item.gridY);
                        }
                    }
                });

                self.net.onEntityAttack(function(attackerId, targetId) {
                    var attacker = self.getEntityById(attackerId),
                        target = self.getEntityById(targetId);

                    if(attacker && target && attacker.id !== self.playerId) {
                        Main.debugView.log(attacker.id + " attacks " + target.id,Core.CoreSrcName);

                        if(attacker && target instanceof Player && target.id !== self.playerId && target.target && target.target.id === attacker.id && attacker.getDistanceToEntity(target) < 3) {
                            setTimeout(function() {
                                self.createAttackLink(attacker, target);
                            }, 200); // delay to prevent other players attacking mobs from ending up on the same tile as they walk towards each other.
                        } else {
                            self.createAttackLink(attacker, target);
                        }
                    }
                });

                self.net.onPlayerDamageMob(function(mobId, points, healthPoints, maxHp) {
                    var mob = self.getEntityById(mobId);
                    if(mob && points) {
                        self.infoManager.addDamageInfo(points, mob.x, mob.y - 15, "inflicted");
                    }
                    if(self.player.hasTarget()){
                        self.updateTarget(mobId, points, healthPoints, maxHp);
                    }
                });

                self.net.onPlayerKillMob(function(kind, level, exp) {
                    var mobExp = Types.getMobExp(kind);
                    self.player.level = level;
                    self.player.experience = exp;
                    self.updateExpBar();
                    
                    self.infoManager.addDamageInfo("+"+mobExp+" exp", self.player.x, self.player.y - 15, "exp", 3000);

                    var expInThisLevel = self.player.experience - Types.expForLevel[self.player.level-1];
                    var expForLevelUp = Types.expForLevel[self.player.level] - Types.expForLevel[self.player.level-1];
                    var expPercentThisLevel = (100*expInThisLevel/expForLevelUp);

                    self.showNotification( "Total xp: " + self.player.experience + ". " + expPercentThisLevel.toFixed(0) + "% of this level done." );

                    var mobName = Types.getKindAsString(kind);

                    if(mobName === 'skeleton2') {
                        mobName = 'greater skeleton';
                    }

                    if(mobName === 'eye') {
                        mobName = 'evil eye';
                    }

                    if(mobName === 'deathknight') {
                        mobName = 'death knight';
                    }

                    if(mobName === 'boss') {
                        self.showNotification("You killed the skeleton king");
                    }
                });

                self.net.onPlayerChangeHealth(function(points, isRegen) {
                    var player = self.player,
                        diff,
                        isHurt;

                    if(player && !player.isDead && !player.invincible) {
                        isHurt = points <= player.hitPoints;
                        diff = points - player.hitPoints;
                        player.hitPoints = points;

                        if(player.hitPoints <= 0) {
                            player.die();
                        }
                        if(isHurt) {
                            player.hurt();
                            self.infoManager.addDamageInfo(diff, player.x, player.y - 15, "received");
                            //self.audioManager.playSound("hurt");
                            //self.storage.addDamage(-diff);
                            //self.tryUnlockingAchievement("MEATSHIELD");
                            if(self.playerhurt_callback) {
                                self.playerhurt_callback();
                            }
                        } else if(!isRegen){
                            self.infoManager.addDamageInfo("+"+diff, player.x, player.y - 15, "healed");
                        }
                        self.updateBars();
                    }
                });

                self.net.onPlayerChangeMaxHitPoints(function(hp) {
                    self.player.maxHitPoints = hp;
                    self.player.hitPoints = hp;
                    self.updateBars();
                });


                self.net.onPlayerEquipItem(function(playerId, itemKind) {
                    var player = self.getEntityById(playerId),
                        itemName = Types.getKindAsString(itemKind);

                    if(player) {
                        if(Types.isArmor(itemKind)) {
                            player.setSprite(self.sprites[itemName]);
                        } else if(Types.isWeapon(itemKind)) {
                            player.setWeaponName(itemName);
                        }
                    }
                });

                self.net.onPlayerTeleport(function(id, x, y) {
                    var entity = null,
                        currentOrientation;

                    if(id !== self.playerId) {
                        entity = self.getEntityById(id);

                        if(entity) {
                            currentOrientation = entity.orientation;

                            self.makeCharacterTeleportTo(entity, x, y);
                            entity.setOrientation(currentOrientation);

                            entity.forEachAttacker(function(attacker) {
                                attacker.disengage();
                                attacker.idle();
                                attacker.stop();
                            });
                        }
                    }
                });

                self.net.onDropItem(function(item, mobId) {
                    var pos = self.getDeadMobPosition(mobId);

                    if(pos) {
                        self.addItem(item, pos.x, pos.y);
                        self.updateCursor();
                    }
                });

                self.net.onChatMessage(function(entityId, message) {
                    var entity = self.getEntityById(entityId);
                    self.createBubble(entityId, message);
                    self.assignBubbleTo(entity);
                    self.audioManager.playSound("chat");
                });

                self.net.onPopulationChange(function(worldPlayers, totalPlayers) {
                    if(self.nbplayers_callback) {
                        self.nbplayers_callback(worldPlayers, totalPlayers);
                    }
                });

                self.net.onDisconnected(function(message) {
                    if(self.player) {
                        self.player.die();
                    }
                    if(self.disconnect_callback) {
                        self.disconnect_callback(message);
                    }
                });

                //self.gamestart_callback();
                if(self.hasNeverStarted) {
                    self.start();
                    started_callback.started_callback({success: true});
                }
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
         * Links two entities in an attacker<-->target relationship.
         * This is just a utility method to wrap a set of instructions.
         *
         * @param {Entity} attacker The attacker entity
         * @param {Entity} target The target entity
         */
        createAttackLink(attacker, target) {
            if(attacker.hasTarget()) {
                attacker.removeTarget();
            }
            attacker.engage(target);

            if(attacker.id !== this.playerId) {
                target.addAttacker(attacker);
            }
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
                self.renderer.addEntityToLayer(entity,entity.displayBitmap);
                self.renderer.addEntityToLayer(entity,entity.weaponBitmap);
                self.renderer.addEntityToLayer(entity,entity.nameTextField);
            }
            else {
                Main.debugView.log("This entity already exists : " + entity.id + " ("+entity.kind+")",Core.CoreSrcName);
            }
        }


        removeEntity(entity) {
            if(entity.id in this.entities) {
                this.renderer.removeEntityFromLayer(entity,entity.displayBitmap);
                this.renderer.removeEntityFromLayer(entity,entity.weaponBitmap);
                this.renderer.removeEntityFromLayer(entity,entity.nameTextField);
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

        isMobOnSameTile(mob, x?, y?) {
            var X = x || mob.gridX,
                Y = y || mob.gridY,
                list = this.entityGrid[Y][X],
                result = false;

            _.each(list, function(entity) {
                if(entity instanceof Role.Mob && entity.id !== mob.id) {
                    result = true;
                }
            });
            return result;
        }

        getFreeAdjacentNonDiagonalPosition(entity) {
            var self = this,
                result = null;

            entity.forEachAdjacentNonDiagonalPosition(function(x, y, orientation) {
                if(!result && !self.map.isColliding(x, y) && !self.isMobAt(x, y)) {
                    result = {x: x, y: y, o: orientation};
                }
            });
            return result;
        }

        tryMovingToADifferentTile(character) {
            var attacker = character,
                target = character.target;

            if(attacker && target && target instanceof Player) {
                if(!target.isMoving() && attacker.getDistanceToEntity(target) === 0) {
                    var pos;

                    switch(target.orientation) {
                        case Types.Orientations.UP:
                            pos = {x: target.gridX, y: target.gridY - 1, o: target.orientation}; break;
                        case Types.Orientations.DOWN:
                            pos = {x: target.gridX, y: target.gridY + 1, o: target.orientation}; break;
                        case Types.Orientations.LEFT:
                            pos = {x: target.gridX - 1, y: target.gridY, o: target.orientation}; break;
                        case Types.Orientations.RIGHT:
                            pos = {x: target.gridX + 1, y: target.gridY, o: target.orientation}; break;
                    }

                    if(pos) {
                        attacker.previousTarget = target;
                        attacker.disengage();
                        attacker.idle();
                        this.makeCharacterGoTo(attacker, pos.x, pos.y);
                        target.adjacentTiles[pos.o] = true;

                        return true;
                    }
                }

                if(!target.isMoving() && attacker.isAdjacentNonDiagonal(target) && this.isMobOnSameTile(attacker)) {
                    var pos = this.getFreeAdjacentNonDiagonalPosition(target);

                    // avoid stacking mobs on the same tile next to a player
                    // by making them go to adjacent tiles if they are available
                    if(pos && !target.adjacentTiles[pos.o]) {
                        if(this.player.target && attacker.id === this.player.target.id) {
                            return false; // never unstack the player's target
                        }

                        attacker.previousTarget = target;
                        attacker.disengage();
                        attacker.idle();
                        this.makeCharacterGoTo(attacker, pos.x, pos.y);
                        target.adjacentTiles[pos.o] = true;

                        return true;
                    }
                }
            }
            return false;
        }

         /**
         *
         */
        onCharacterUpdate(character) {
            var time = this.currentTime;
            var self = this;
            
            // If mob has finished moving to a different tile in order to avoid stacking, attack again from the new position.
            if(character.previousTarget && !character.isMoving() && character instanceof Role.Mob) {
                var t = character.previousTarget;

                if(this.getEntityById(t.id)) { // does it still exist?
                    character.previousTarget = null;
                    this.createAttackLink(character, t);
                    return;
                }
            }

            if(character.isAttacking() && (!character.previousTarget || character.id === this.playerId)) {
                var isMoving = this.tryMovingToADifferentTile(character); // Don't let multiple mobs stack on the same tile when attacking a player.

                if(character.canAttack(time)) {
                    if(!isMoving) { // don't hit target if moving to a different tile.
                        if(character.hasTarget() && character.getOrientationTo(character.target) !== character.orientation) {
                            character.lookAtTarget();
                        }
                        Main.debugView.log("Character Hit","Core");
                        character.hit();

                        if(character.id === this.playerId) {
                            this.net.sendHit(character.target);
                        }

                        if(character instanceof Player && this.camera.isVisible(character)) {
                            //this.audioManager.playSound("hit"+Math.floor(Math.random()*2+1));
                        }

                        if(character.hasTarget() && character.target.id === this.playerId && this.player && !this.player.invincible) {
                            this.net.sendHurt(character);
                        }
                    }
                } else {
                    if(character.hasTarget()
                    && character.isDiagonallyAdjacent(character.target)
                    && character.target instanceof Player
                    && !character.target.isMoving()) {
                        character.follow(character.target);
                    }
                }
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

            //if(Render.mobile || Render.tablet) {
                var z = this.zoningOrientation,
                    c = this.camera,
                    ts = this.renderer.tilesize,
                    x = c.x,
                    y = c.y,
                    xoffset = (c.gridW - 2) * ts,
                    yoffset = (c.gridH - 2) * ts;
                z = parseInt(z);
                if(z === Types.Orientations.LEFT || z === Types.Orientations.RIGHT) {
                    x = (z === Types.Orientations.LEFT) ? c.x - xoffset : c.x + xoffset;
                } else if(z === Types.Orientations.UP || z === Types.Orientations.DOWN) {
                    y = (z === Types.Orientations.UP) ? c.y - yoffset : c.y + yoffset;
                }
                c.setPosition(x, y);
                this.renderer.clearContextScreen();
                this.endZoning();
                this.renderer.renderStaticCanvases();

                // Force immediate drawing of all visible entities in the new zone
                this.forEachVisibleEntityByDepth(function(entity) {
                    entity.setDirty();
                });
            //}
            // else {
            //     this.currentZoning = new Common.Transition();
            // }
            this.bubbleManager.clean();
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
            this.bubbleManager.clean();
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
                    //this.audioManager.playSound("heal");
                } else {
                    //this.audioManager.playSound("loot");
                }
            } catch(e) {
                if(e instanceof Exceptions.LootException) {
                    this.showNotification(e.message);
                    //this.audioManager.playSound("noloot");
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
                    //w = parseInt(bubble.element.css('width')) + 24,
                    w = bubble.width + 24,
                    offset = (w / 2) - (t / 2) -16,
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

                //bubble.element.css('left', x - offset + 'px');
                //bubble.element.css('top', y + 'px');
                Main.debugView.log("Bubble:"+x+"|y:"+y+"|offset"+offset,"Bubble");
                bubble.x = x -offset;
                bubble.y = y;
            }
        }
        username="";
        respawn() {
            Main.debugView.log("Beginning respawn",Core.CoreSrcName);

            this.entities = {};
            this.initEntityGrid();
            this.initPathingGrid();
            this.initRenderingGrid();

            this.player = new Role.Warrior("player", this.username);
            //this.player.pw = this.userpw;
            //this.player.email = this.email;
            this.initPlayer();
            //this.app.initTargetHud();

            this.started = true;
            this.net.enable();
            this.net.sendLogin();

            if(Render.mobile || Render.tablet) {
                this.renderer.clearContextScreen();
            }

            Main.debugView.log("Finished respawn",Core.CoreSrcName);
        }
        gamestart_callback;
         onGameStart(callback) {
            this.gamestart_callback = callback;
        };

        disconnect_callback;
        onDisconnect(callback) {
            this.disconnect_callback = callback;
        }

        onPlayerDeath(callback) {
            this.playerdeath_callback = callback;
        }
        updatetarget_callback;
        onUpdateTarget(callback){
          this.updatetarget_callback = callback;
        }
        onPlayerExpChange(callback){
            this.playerexp_callback = callback;
        }

        onPlayerHealthChange(callback) {
            this.playerhp_callback = callback;
        }
        playerhurt_callback;
        onPlayerHurt(callback) {
            this.playerhurt_callback = callback;
        }

        onPlayerEquipmentChange(callback) {
            this.equipment_callback = callback;
        }
        nbplayers_callback;
        onNbPlayersChange(callback) {
            this.nbplayers_callback = callback;
        }

        onNotification(callback) {
            this.notification_callback = callback;
        }

        invincible_callback;
        onPlayerInvincible(callback) {
            this.invincible_callback = callback
        }

        resize() {
            var x = this.camera.x,
                y = this.camera.y,
                currentScale = this.renderer.scale,
                newScale = this.renderer.getScaleFactor();

                //this.renderer.rescale(newScale);
                this.camera = this.renderer.camera;
                this.camera.setPosition(x, y);

                this.renderer.renderStaticCanvases();
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
        updateTarget(targetId, points, healthPoints, maxHp){
            if(this.player.hasTarget() && this.updatetarget_callback){
                var target = this.getEntityById(targetId);
                target.name = Types.getKindAsString(target.kind);
                target.points = points;
                target.healthPoints = healthPoints;
                target.maxHp = maxHp;
                this.updatetarget_callback(target);
            }
        }
    
        getDeadMobPosition(mobId) {
            var position;

            if(mobId in this.deathpositions) {
                position = this.deathpositions[mobId];
                delete this.deathpositions[mobId];
            }

            return position;
        }

        /**
         * Converts the current mouse position on the screen to world grid coordinates.
         * @returns {Object} An object containing x and y properties.
         */
        getMouseGridPosition() {
            var mx = this.mouse.x,
                my = this.mouse.y,
                c = this.renderer.camera,
                s = this.renderer.scale,
                ts = this.renderer.tilesize,
                offsetX = mx % (ts * s),
                offsetY = my % (ts * s),
                x = ((mx - offsetX) / (ts * s)) + c.gridX,
                y = ((my - offsetY) / (ts * s)) + c.gridY;

                //Main.debugView.log("GetMouseGridPosition:"+x+"|y:"+y,"Core");
                return { x: x, y: y };
        }

         /**
         * Moves a character to a given location on the world grid.
         *
         * @param {Number} x The x coordinate of the target location.
         * @param {Number} y The y coordinate of the target location.
         */
        makeCharacterGoTo(character, x, y) {
            if(!this.map.isOutOfBounds(x, y)) {
                character.go(x, y);
            }
        }

        /**
         *
         */
        makeCharacterTeleportTo(character, x, y) {
            if(!this.map.isOutOfBounds(x, y)) {
                this.unregisterEntityPosition(character);

                character.setGridPosition(x, y);

                this.registerEntityPosition(character);
                this.assignBubbleTo(character);
            } else {
                Main.debugView.log("Teleport out of bounds: "+x+", "+y,Core.CoreSrcName);
            }
        }

        /**
         *
         */
        makePlayerAttackNext()
        {

            var pos = {
                x: this.player.gridX,
                y: this.player.gridY
            };
            switch(this.player.orientation)
            {
                case Types.Orientations.DOWN:
                    pos.y += 1;
                    this.makePlayerAttackTo(pos);
                    break;
                case Types.Orientations.UP:
                    pos.y -= 1;
                    this.makePlayerAttackTo(pos);
                    break;
                case Types.Orientations.LEFT:
                    pos.x -= 1;
                    this.makePlayerAttackTo(pos);
                    break;
                case Types.Orientations.RIGHT:
                    pos.x += 1;
                    this.makePlayerAttackTo(pos);
                    break;

                default:
                    break;
            }
        }

        /**
         *
         */
        makePlayerAttackTo(pos)
        {
            var entity = this.getEntityAt(pos.x, pos.y);
            if(entity instanceof Role.Mob) {
                this.makePlayerAttack(entity);
            }
        }

        /**
         * Moves the current player to a given target location.
         * @see makeCharacterGoTo
         */
        makePlayerGoTo(x, y) {
            this.makeCharacterGoTo(this.player, x, y);
        }

        /**
         * Moves the current player towards a specific item.
         * @see makeCharacterGoTo
         */
        makePlayerGoToItem(item) {
            if(item) {
                this.player.isLootMoving = true;
                this.makePlayerGoTo(item.gridX, item.gridY);
                this.net.sendLootMove(item, item.gridX, item.gridY);
            }
        }

        /**
         *
         */
        makePlayerTalkTo(npc) {
            if(npc) {
                this.player.setTarget(npc);
                this.player.follow(npc);
            }
        }

        makePlayerOpenChest(chest) {
            if(chest) {
                this.player.setTarget(chest);
                this.player.follow(chest);
            }
        }
         /**
         *
         */
        makePlayerAttack(mob) {
            this.createAttackLink(this.player, mob);
            this.net.sendAttack(mob);
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
                    //this.audioManager.playSound("npc");
                } else {
                    this.destroyBubble(npc.id);
                    //this.audioManager.playSound("npc-end");
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

        updateCursor() {
            if(!this.cursorVisible)
                var keepCursorHidden = true;

            this.movecursor();
            this.updateCursorLogic();

            if(keepCursorHidden)
                this.cursorVisible = false;
        }

        /**
         *
         */
        hoveringPlateauTile = false;
        hoveringOtherPlayer = false;
        lastHovered;
        timeout;
        movecursor() {
            var mouse = this.getMouseGridPosition(),
                x = mouse.x,
                y = mouse.y;

            this.cursorVisible = true;

            if(this.player && !Render.mobile && !Render.tablet) {
                this.hoveringCollidingTile = this.map.isColliding(x, y);
                this.hoveringPlateauTile = this.player.isOnPlateau ? !this.map.isPlateau(x, y) : this.map.isPlateau(x, y);
                this.hoveringMob = this.isMobAt(x, y);
                this.hoveringPlayer = this.isPlayerAt(x, y);
                this.hoveringItem = this.isItemAt(x, y);
                this.hoveringNpc = this.isNpcAt(x, y);
                this.hoveringOtherPlayer = this.isPlayerAt(x, y);
                this.hoveringChest = this.isChestAt(x, y);

                if(this.hoveringMob || this.hoveringPlayer || this.hoveringNpc || this.hoveringChest || this.hoveringOtherPlayer) {
                    var entity = this.getEntityAt(x, y);

                    this.player.showTarget(entity);
                    if(!entity.isHighlighted && this.renderer.supportsSilhouettes) {
                        if(this.lastHovered) {
                            this.lastHovered.setHighlight(false);
                        }
                        entity.setHighlight(true);
                    }
                    this.lastHovered = entity;
                }
                else if(this.lastHovered) {
                    this.lastHovered.setHighlight(null);
                    if(this.timeout === undefined && !this.player.hasTarget()) {
                        var self = this;
                        this.timeout = setTimeout(function(){
                            //$('#inspector').fadeOut('fast');
                            //$('#inspector .health').text('');
                            self.player.inspecting = null;
                        }, 2000);
                        this.timeout = undefined;
                    }
                    this.lastHovered = null;
                }
            }
        }

         /**
         * Moves the player one space, if possible
         */
        // keys(pos, orientation) {
        //     this.hoveringCollidingTile = false;
        //     this.hoveringPlateauTile = false;

        //     if((pos.x === this.previousClickPosition.x
        //     && pos.y === this.previousClickPosition.y) || this.isZoning()) {
        //         return;
        //     } else {
        //         if(!this.player.disableKeyboardNpcTalk)
        //             this.previousClickPosition = pos;
        //     }

        //     if(!this.player.isMoving()) {
        //         this.cursorVisible = false;
        //         this.processInput(pos);
        //     }
        // }

        click()
        {
            var pos = this.getMouseGridPosition();

            if(pos.x === this.previousClickPosition.x
            && pos.y === this.previousClickPosition.y) {
                return;
            } else {
                this.previousClickPosition = pos;
            }

            this.processInput(pos);
        }

        /**
         * Processes game logic when the user triggers a click/touch event during the game.
         */
        processInput(pos) {
            var entity;
            Main.debugView.log("1:"+this.started+"|2:"+this.player+"|3:"+!this.isZoning()
            +"|4:"+!this.isZoningTile(this.player.nextGridX, this.player.nextGridY)+
            "|5:"+!this.player.isDead+"|6:"+!this.hoveringCollidingTile+"|7:"+!this.hoveringPlateauTile,"ProcessInput");
            if(this.started
            && this.player
            && !this.isZoning()
            && !this.isZoningTile(this.player.nextGridX, this.player.nextGridY)
            && !this.player.isDead
            && !this.hoveringCollidingTile
            && !this.hoveringPlateauTile) {
                entity = this.getEntityAt(pos.x, pos.y);

        	    if(entity instanceof Role.Mob || (entity instanceof Player && entity !== this.player && this.player.pvpFlag && this.pvpFlag)) {
                    this.makePlayerAttack(entity);
                }
                else if(entity instanceof Common.Item) {
                    this.makePlayerGoToItem(entity);
                }
                else if(entity instanceof Role.Npc) {
                    if(this.player.isAdjacentNonDiagonal(entity) === false) {
                        this.makePlayerTalkTo(entity);
                    } else {
                        if(!this.player.disableKeyboardNpcTalk) {
                            this.makeNpcTalk(entity);

                            if(this.player.moveUp || this.player.moveDown || this.player.moveLeft || this.player.moveRight)
                                this.player.disableKeyboardNpcTalk = true;
                        }
                    }
                }
                else if(entity instanceof Common.Chest) {
                    this.makePlayerOpenChest(entity);
                }
                else {
                    this.makePlayerGoTo(pos.x, pos.y);
                }
            }
        }
    }
}
