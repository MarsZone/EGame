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
			
			this.role = new Assets.Role("leatherarmor", "character");
			this.role.x += 100;
			this.role.y += 100;
			this.addChild(this.role);
			var self = this;
			//test key controler.
			document.addEventListener("keydown",function(event:KeyboardEvent){
				switch (event.keyCode) {
					case Types.KeyMap.Up:
						self.role.setCurAnimation("walk_up");
						break;
					case Types.KeyMap.Down:
						self.role.setCurAnimation("walk_down");
						break;
					case Types.KeyMap.Left:
						self.role.setCurAnimation("walk_right",true);
						break;
					case Types.KeyMap.Right:
						self.role.setCurAnimation("walk_right");
						break;
				}
			})
			EGEvent.UIEventHandler.instance.addEventListener(EGEvent.GameEvent.CHANGE,this.onChange,this);
		}
		update(): void {
			this.role.update();
		}
		onChange(e:EGEvent.GameEvent):void{
			this.role.setCurAnimation("walk_right");
		}
	}
}
