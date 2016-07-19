module NPCs {
	export class npcs {
		public constructor() {
		}
	}

	export class Guard extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.GUARD);
		}
	}

	export class King extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.KING);
		}
	}

	export class Agent extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.AGENT);
		}
	}

	export class Rick extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.RICK);
		}
	}

	export class VillageGirl extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.VILLAGEGIRL);
		}
	}

	export class Villager extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.VILLAGER);
		}
	}

	export class Coder extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.CODER);
		}
	}

	export class Scientist extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.SCIENTIST);
		}
	}

	export class Nyan extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.NYAN);
			 this.idleSpeed = 50;
		}
	}

	export class Sorcerer extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.SORCERER);
			 this.idleSpeed = 150;
		}
	}

	export class Priest extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.PRIEST);
		}
	}

	export class BeachNpc extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.BEACHNPC);
		}
	}

	export class ForestNpc extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.FORESTNPC);
		}
	}

	export class DesertNpc extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.DESERTNPC);
		}
	}

	export class LavaNpc extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.LAVANPC);
		}
	}

	export class Octocat extends Role.Npc{
		public constructor(id,name?) {
			super(id, Types.Entities.OCTOCAT);
		}
	}
}