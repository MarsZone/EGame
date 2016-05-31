module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class View extends egret.Sprite {
		public constructor() {
			super();
			this.init();
		}
		role: Assets.Role;
		init(): void {
			this.role = new Assets.Role();
			this.role.x += 100;
			this.role.y += 100;
			this.addChild(this.role);
		}

		update(): void {
			this.role.update();
		}
	}
}
