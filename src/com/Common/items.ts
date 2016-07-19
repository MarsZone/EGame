module Items {
	export class items {
		public constructor() {
		}
	}

	export class Sword2 extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.SWORD2,"weapon");
			this.lootMessage = "You pick up a steel sword";
		}
	}

	export class Axe extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.AXE, "weapon");
			this.lootMessage = "You pick up an axe";
		}
	}

	export class RedSword extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.REDSWORD,"weapon");
			this.lootMessage = "You pick up a blazing sword";
		}
	}

	export class GoldenSword extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.GOLDENSWORD,"weapon");
			this.lootMessage = "You pick up the ultimate sword";
		}
	}

	export class MorningStar extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.MORNINGSTAR,"weapon");
			this.lootMessage = "You pick up a morning star";
		}
	}

	export class LeatherArmor extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.LEATHERARMOR, "armor");
			this.lootMessage = "You equip a leather armor.";
		}
	}

	export class MailArmor extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.MAILARMOR, "armor");
			this.lootMessage = "You equip a mail armor";
		}
	}

	export class PlateArmor extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.PLATEARMOR, "armor");
			this.lootMessage = "You equip a plate armor";
		}
	}

	export class RedArmor extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.REDARMOR, "armor");
			this.lootMessage = "You equip a ruby armor";
		}
	}

	export class BlueSword extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.BLUESWORD, "weapon");
			this.lootMessage = "You pick up a magic sword";
		}
	}

	export class GoldenArmor extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.GOLDENARMOR, "armor");
			this.lootMessage = "You equip a golden armor";
		}
	}

	export class Flask extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.FLASK, "object");
			this.lootMessage = "You drink a health potion";
		}
	}
	export class Cake extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.CAKE, "object");
			this.lootMessage = "You eat a cake";
		}
	}
	export class Burger extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.BURGER, "object");
			this.lootMessage = "You can haz rat burger";
		}
	}
	export class FirePotion extends Common.Item{
		public constructor(id,name?) {
			super(id,Types.Entities.FIREPOTION, "object");
			this.lootMessage = "You feel the power of Firefox!";
		}
		onLoot(player:Content.Player) {
                player.startInvincibility();
        }
	}
}