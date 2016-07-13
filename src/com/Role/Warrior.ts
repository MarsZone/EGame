module Role {
	export class Warrior extends Content.Player{
		public constructor(id,name) {
			super(id,name);
		}
		moveUp;
		moveDown;
		moveLeft;
		moveRight;
		disableKeyboardNpcTalk;
	}
}