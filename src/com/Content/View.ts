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
		role1: Assets.Role;
		init(): void {
			this.role = new Assets.Role();
			this.role.x += 100;
			this.role.y += 100;
			this.addChild(this.role);
			this.role1 = new Assets.Role();
			this.addChild(this.role1);
			
		}

		update(): void {
			this.role.update();
			this.role1.update();
		}
	}
}
