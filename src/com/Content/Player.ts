module Content {
	export class Player extends Assets.ECharacter{
		public constructor(id,kind) {
			super(id,kind);
			this.init();
		}
		MAX_LEVEL=10;
		nameOffsetY;
		spriteName;
		armorName;
		weaponName;
		isLootMoving;
		isSwitchingWeapon;
		pvpFlag;
		init(){
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
	}
}