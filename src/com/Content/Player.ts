module Content {
	export class Player extends Common.Character{
		public constructor(id,kind) {
			super(id,kind);
			// Renderer
            this.nameOffsetY = -10;

            // sprites
            this.spriteName = "clotharmor";
            this.armorName = "clotharmor";
            this.weaponName = "sword1";

            // modes
            this.isLootMoving = false;
            this.isSwitchingWeapon = true;

            // PVP Flag
            this.pvpFlag = true;
		}
		MAX_LEVEL=10;
		nameOffsetY;
		spriteName;
		armorName;
		weaponName;
		isLootMoving;
		isSwitchingWeapon;
		pvpFlag;
        experience;
        level;
        isOnPlateau;
        lastCheckpoint;
		currentArmorSprite;
		invincible;
		loot(item) {
            if(item) {
                var rank, currentRank, msg, currentArmorName;

                if(this.currentArmorSprite) {
                    currentArmorName = this.currentArmorSprite.name;
                } else {
                    currentArmorName = this.spriteName;
                }

                if(item.type === "armor") {
                    rank = Types.getArmorRank(item.kind);
                    currentRank = Types.getArmorRank(Types.getKindFromString(currentArmorName));
                    msg = "You are wearing a better armor";
                } else if(item.type === "weapon") {
                    rank = Types.getWeaponRank(item.kind);
                    currentRank = Types.getWeaponRank(Types.getKindFromString(this.weaponName));
                    msg = "You are wielding a better weapon";
                }

                if(rank && currentRank) {
                    if(rank === currentRank) {
                        throw new Exceptions.LootException("You already have this "+item.type);
                    } else if(rank <= currentRank) {
                        throw new Exceptions.LootException(msg);
                    }
                }

                Main.debugView.log('Player '+this.id+' has looted '+item.id);
                if(Types.isArmor(item.kind) && this.invincible) {
                    this.stopInvincibility();
                }
                item.onLoot(this);
            }
        }

		/**
         * Returns true if the character is currently walking towards an item in order to loot it.
         */
        isMovingToLoot() {
            return this.isLootMoving;
        }

        getSpriteName() {
            return this.spriteName;
        }

        setSpriteName(name) {
            this.spriteName = name;
        }

        getArmorName() {
            var sprite = this.getArmorSprite();
            return sprite.id;
        }

        getArmorSprite() {
            if(this.invincible) {
                return this.currentArmorSprite;
            } else {
                return this.sprite;
            }
        }
        setArmorName(name){
            this.armorName = name;
        }

        getWeaponName() {
            return this.weaponName;
        }
        
        setWeaponName(name) {
            this.weaponName = name;
        }

        hasWeapon() {
            return this.weaponName !== null;
        }
		inventory={};
        equipFromInventory(type, inventoryNumber, sprites){
            var itemString = Types.getKindAsString(this.inventory[inventoryNumber]);

            if(itemString){
                var itemSprite = sprites[itemString];
                if(itemSprite){
                    if(type === "armor"){
                        this.inventory[inventoryNumber] = Types.getKindFromString(this.getArmorName());
                        this.setSpriteName(itemString);
                        this.setSprite(itemSprite);
                        this.setArmorName(itemString);
                    } else if(type === "avatar"){
                        this.inventory[inventoryNumber] = null;
                        this.setSpriteName(itemString);
                        this.setSprite(itemSprite);
                    }
                }
            }
        }
		switch_callback;
        switchArmor(armorName, sprite){
            this.setSpriteName(armorName);
            this.setSprite(sprite);
            this.setArmorName(armorName);
            if(this.switch_callback) {
              this.switch_callback();
            }
        }
		switchingWeapon;
        switchWeapon(newWeaponName) {
            var count = 14,
                value = false,
                self = this;

            var toggle = function() {
                value = !value;
                return value;
            };

            if(newWeaponName !== this.getWeaponName()) {
                if(this.isSwitchingWeapon) {
                    clearInterval(blanking);
                }

                this.switchingWeapon = true;
                var blanking = setInterval(function() {
                    if(toggle()) {
                        self.setWeaponName(newWeaponName);
                    } else {
                        self.setWeaponName(null);
                    }

                    count -= 1;
                    if(count === 1) {
                        clearInterval(blanking);
                        self.switchingWeapon = false;

                        if(self.switch_callback) {
                            self.switch_callback();
                        }
                    }
                }, 90);
            }
        }
		isSwitchingArmor;
        switchNewArmor(newArmorSprite) {
            var count = 14,
                value = false,
                self = this;

            var toggle = function() {
                value = !value;
                return value;
            };

            if(newArmorSprite && newArmorSprite.id !== this.getSpriteName()) {
                if(this.isSwitchingArmor) {
                    clearInterval(blanking);
                }

                this.isSwitchingArmor = true;
                self.setSprite(newArmorSprite);
                self.setSpriteName(newArmorSprite.id);
                var blanking = setInterval(function() {
                    self.setVisible(toggle());

                    count -= 1;
                    if(count === 1) {
                        clearInterval(blanking);
                        self.isSwitchingArmor = false;

                        if(self.switch_callback) {
                            self.switch_callback();
                        }
                    }
                }, 90);
            }
        }
		armorloot_callback;
        onArmorLoot(callback) {
            this.armorloot_callback = callback;
        }

        onSwitchItem(callback) {
            this.switch_callback = callback;
        }
		invincible_callback;
        onInvincible(callback) {
            this.invincible_callback = callback;
        }
        invincibleTimeout;
        startInvincibility() {
            var self = this;

            if(!this.invincible) {
                this.currentArmorSprite = this.getSprite();
                this.invincible = true;
                this.invincible_callback();
            } else {
                // If the player already has invincibility, just reset its duration.
                if(this.invincibleTimeout) {
                    clearTimeout(this.invincibleTimeout);
                }
            }

            this.invincibleTimeout = setTimeout(function() {
                self.stopInvincibility();
                self.idle();
            }, 15000);
        }

        stopInvincibility() {
            this.invincible_callback();
            this.invincible = false;

            if(this.currentArmorSprite) {
                this.setSprite(this.currentArmorSprite);
                this.setSpriteName(this.currentArmorSprite.id);
                this.currentArmorSprite = null;
            }
            if(this.invincibleTimeout) {
                clearTimeout(this.invincibleTimeout);
            }
         }
        flagPVP(pvpFlag){
            this.pvpFlag = pvpFlag;
       }
	}
}