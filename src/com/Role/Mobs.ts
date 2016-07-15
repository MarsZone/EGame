module Mobs {

	export class Rat extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.RAT);
			this.moveSpeed = 350;
			this.idleSpeed = 700;
			this.shadowOffsetY = -2;
			this.isAggressive = false;
		}
	}

	export class Skeleton extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.SKELETON);
			this.moveSpeed = 350;
			this.atkSpeed = 100;
			this.idleSpeed = 800;
			this.shadowOffsetY = -1;
			this.setAttackRate(1300);
		}
	}

	export class Skeleton2 extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.SKELETON2);
			this.moveSpeed = 200;
			this.atkSpeed = 100;
			this.idleSpeed = 800;
			this.walkSpeed = 200;
			this.shadowOffsetY = -1;
			this.setAttackRate(1300);
		}
	}

	export class Spectre extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.SPECTRE);
			this.moveSpeed = 150;
			this.atkSpeed = 50;
			this.idleSpeed = 200;
			this.walkSpeed = 200;
			this.shadowOffsetY = 1;
			this.setAttackRate(900);
		}
	}

	export class Deathknight extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.DEATHKNIGHT);
			this.atkSpeed = 50;
			this.moveSpeed = 220;
			this.walkSpeed = 100;
			this.idleSpeed = 450;
			this.setAttackRate(800);
			this.aggroRange = 3;
		}
		idle(orientation) {
                if(!this.hasTarget()) {
					this.setOrientation(Types.Orientations.DOWN);
            		this.animate("idle", this.idleSpeed);
                } else {
					this.setOrientation(orientation);
            		this.animate("idle", this.idleSpeed);
                }
        }
	}

	export class Goblin extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.GOBLIN);
			this.moveSpeed = 150;
			this.atkSpeed = 60;
			this.idleSpeed = 600;
			this.setAttackRate(700);
		}
	}

	export class Ogre extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.OGRE);
			this.moveSpeed = 300;
			this.atkSpeed = 100;
			this.idleSpeed = 600;
		}
	}
	export class Crab extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.CRAB);
			this.moveSpeed = 200;
			this.atkSpeed = 40;
			this.idleSpeed = 500;
		}
	}
	export class Snake extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.SNAKE);
			this.moveSpeed = 200;
			this.atkSpeed = 40;
			this.idleSpeed = 250;
			this.walkSpeed = 100;
			this.shadowOffsetY = -4;
		}
	}

	export class Eye extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.EYE);
                this.moveSpeed = 200;
                this.atkSpeed = 40;
                this.idleSpeed = 50;
		}
	}

	export class Bat extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.BAT);
                this.moveSpeed = 120;
                this.atkSpeed = 90;
                this.idleSpeed = 90;
                this.walkSpeed = 85;
                this.isAggressive = false;
		}
	}

	export class Wizard extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.WIZARD);
                this.moveSpeed = 200;
                this.atkSpeed = 100;
                this.idleSpeed = 150;
		}
	}

	export class Boss extends Role.Mob{
		public constructor(id,name?) {
			super(id, Types.Entities.BOSS);
				this.moveSpeed = 300;
                this.atkSpeed = 50;
                this.idleSpeed = 400;
                this.atkRate = 2000;
                this.attackCooldown = new Tools.ETimer(this.atkRate);
                this.aggroRange = 3;
		}

		idle(orientation) {
                if(!this.hasTarget()) {
					this.setOrientation(Types.Orientations.DOWN);
            		this.animate("idle", this.idleSpeed);
                } else {
					this.setOrientation(orientation);
            		this.animate("idle", this.idleSpeed);
                }
        }
	}
	
}