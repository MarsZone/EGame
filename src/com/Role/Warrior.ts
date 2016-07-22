module Role {
	export class Warrior extends Content.Player{
		public constructor(id,kind) {
			super(id,Types.Entities.WARRIOR);
		}
		moveUp;
		moveDown;
		moveLeft;
		moveRight;
		disableKeyboardNpcTalk;
	}
}