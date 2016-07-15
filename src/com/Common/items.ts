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

	export class BlueSword extends Common.Item{
		public constructor(id,name?) {
			super(id, Types.Entities.BLUESWORD,"weapon");
			this.lootMessage = "You pick up a magic sword";
		}
	}
}