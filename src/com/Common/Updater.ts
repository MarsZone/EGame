module Common {
	export class Updater {
		public constructor(game:Content.Core) {
			this.game = game;
            this.playerAggroTimer = new Tools.ETimer(1000);
		}
		game:Content.Core;
        playerAggroTimer;
		update() {
            this.updateZoning();
            this.updateCharacters();
            this.updatePlayerAggro();
            this.updateTransitions();
            this.updateAnimations();
            this.updateAnimatedTiles();
            this.updateChatBubbles();
            this.updateInfos();
            this.updateKeyboardMovement();
        }
        endValue;
        offset;
        updateZoning() {
            var g = this.game,
                c = g.camera,
                z = g.currentZoning,
                s = 3,
                ts = 16,
                speed = 500;

            if(z && z.inProgress === false) {
                var orientation = this.game.zoningOrientation,
                    startValue = this.endValue = this.offset = 0,
                    updateFunc = null,
                    endFunc = null;

                if(orientation === Types.Orientations.LEFT || orientation === Types.Orientations.RIGHT) {
                    this.offset = (c.gridW - 2) * ts;
                    startValue = (orientation === Types.Orientations.LEFT) ? c.x - ts : c.x + ts;
                    this.endValue = (orientation === Types.Orientations.LEFT) ? c.x - this.offset : c.x + this.offset;
                    updateFunc = function(x) {
                        c.setPosition(x, c.y);
                        g.initAnimatedTiles();
                        g.renderer.renderStaticCanvases();
                    }
                    endFunc = function() {
                        c.setPosition(z.endValue, c.y);
                        g.endZoning();
                    }
                } else if(orientation === Types.Orientations.UP || orientation === Types.Orientations.DOWN) {
                    this.offset = (c.gridH - 2) * ts;
                    startValue = (orientation === Types.Orientations.UP) ? c.y - ts : c.y + ts;
                    this.endValue = (orientation === Types.Orientations.UP) ? c.y - this.offset : c.y + this.offset;
                    updateFunc = function(y) {
                        c.setPosition(c.x, y);
                        g.initAnimatedTiles();
                        g.renderer.renderStaticCanvases();
                    }
                    endFunc = function() {
                        c.setPosition(c.x, z.endValue);
                        g.endZoning();
                    }
                }

                z.start(this.game.currentTime, updateFunc, endFunc, startValue, this.endValue, speed);
            }
        }

		updateCharacters() {
            var self = this;

            this.game.forEachEntity(function(entity) {
                var isCharacter = entity instanceof Character;

                if(entity.isLoaded) {
                    if(isCharacter) {
                        self.updateCharacter(entity);
                        self.game.onCharacterUpdate(entity);
                    }
                    self.updateEntityFading(entity);
                }
            });
        }
        
        updatePlayerAggro() {
            var t = this.game.currentTime,
                player = this.game.player;

            // Check player aggro every 1s when not moving nor attacking
            if(player && !player.isMoving() && !player.isAttacking()  && this.playerAggroTimer.isOver(t)) {
                player.checkAggro();
            }
        }
        isFading;
        updateEntityFading(entity:Common.Entity) {
            if(entity && entity.isFading) {
                var duration = 1000,
                    t = this.game.currentTime,
                    dt = t - entity.startFadingTime;

                if(dt > duration) {
                    this.isFading = false;
                    entity.fadingAlpha = 1;
                } else {
                    entity.fadingAlpha = dt / duration;
                }
            }
        }

        updateTransitions() {
            var self = this,
                m = null,
                z = this.game.currentZoning;

            this.game.forEachEntity(function(entity) {
                m = entity.movement;
                if(m) {
                    if(m.inProgress) {
                        m.step(self.game.currentTime);
                    }
                }
            });

            if(z) {
                if(z.inProgress) {
                    z.step(this.game.currentTime);
                }
            }
        }
        updateCharacter(c) {
            var self = this;

            // Estimate of the movement distance for one update
            var tick = Math.round(16 / Math.round((c.moveSpeed / (1000 / this.game.renderer.FPS))));

            if(c.isMoving() && c.movement.inProgress === false) {
                if(c.orientation === Types.Orientations.LEFT) {
                    c.movement.start(this.game.currentTime,
                                     function(x) {
                                        c.x = x;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.x = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.x - tick,
                                     c.x - 16,
                                     c.moveSpeed);
                }
                else if(c.orientation === Types.Orientations.RIGHT) {
                    c.movement.start(this.game.currentTime,
                                     function(x) {
                                        c.x = x;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.x = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.x + tick,
                                     c.x + 16,
                                     c.moveSpeed);
                }
                else if(c.orientation === Types.Orientations.UP) {
                    c.movement.start(this.game.currentTime,
                                     function(y) {
                                        c.y = y;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.y = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.y - tick,
                                     c.y - 16,
                                     c.moveSpeed);
                }
                else if(c.orientation === Types.Orientations.DOWN) {
                    c.movement.start(this.game.currentTime,
                                     function(y) {
                                        c.y = y;
                                        c.hasMoved();
                                     },
                                     function() {
                                        c.y = c.movement.endValue;
                                        c.hasMoved();
                                        c.nextStep();
                                     },
                                     c.y + tick,
                                     c.y + 16,
                                     c.moveSpeed);
                }
            }
        }

        updateKeyboardMovement()
        {           
            if(!this.game.player || this.game.player.isMoving())
                return;

            var game = this.game;
            var player = this.game.player;
                
            var pos = {
                x: player.gridX,
                y: player.gridY
            };

            if(player.moveUp)
            {
                pos.y -= 1;
                //game.keys(pos, Types.Orientations.UP);
            }
            else if(player.moveDown)
            {
                pos.y += 1;
                //game.keys(pos, Types.Orientations.DOWN);
            }
            else if(player.moveRight)
            {
                pos.x += 1;
                //game.keys(pos, Types.Orientations.RIGHT);
            }
            else if(player.moveLeft)
            {
                pos.x -= 1;
                //game.keys(pos, Types.Orientations.LEFT);
            }
        }

        updateAnimations() {
            var t = this.game.currentTime;

            this.game.forEachEntity(function(entity) {
                var anim = entity.currentAnimation;

                if(anim) {
                    if(anim.update(t)) {
                        entity.setDirty();
                    }
                }
            });

            var sparks = this.game.sparksAnimation;
            if(sparks) {
                sparks.update(t);
            }

            var target = this.game.targetAnimation;
            if(target) {
                target.update(t);
            }
        }

        updateAnimatedTiles() {
            var self = this,
                t = this.game.currentTime;

            this.game.forEachAnimatedTile(function (tile) {
                if(tile.animate(t)) {
                    tile.isDirty = true;
                    tile.dirtyRect = self.game.renderer.getTileBoundingRect(tile);

                    if(Content.Render.mobile || Content.Render.tablet) {
                        self.game.checkOtherDirtyRects(tile.dirtyRect, tile, tile.x, tile.y);
                    }
                }
            });
        }

        updateChatBubbles() {
            var t = this.game.currentTime;

            this.game.bubbleManager.update(t);
        }

        updateInfos() {
            var t = this.game.currentTime;

            this.game.infoManager.update(t);
        }
	}
}