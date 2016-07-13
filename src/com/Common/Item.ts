module Common {
	export class Item extends Entity{
		public constructor(id, kind, type) {
			super(id, kind);
			this.itemKind = Types.getKindAsString(kind);
            this.type = type;
            this.wasDropped = false;
		}

		hasShadow() {
            return true;
        }
		type;
		itemKind;
		wasDropped;
		lootMessage;
        onLoot(player) {
            if(this.type === "weapon") {
                player.switchWeapon(this.itemKind);
            }
            else if(this.type === "armor") {
                player.armorloot_callback(this.itemKind);
            }
        }

        getSpriteName() {
            return "item-"+ this.itemKind;
        }

        getLootMessage() {
            return this.lootMessage;
        }
	}
}