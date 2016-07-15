module Role {
	export class Mob extends Common.Character{
		public constructor(id, kind?) {
			super(id, kind);

			this.aggroRange = 1;
            this.isAggressive = true;
		}
		aggroRange;
		isAggressive;
	}
}