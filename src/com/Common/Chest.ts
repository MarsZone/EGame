module Common {
	export class Chest extends Entity{
		public constructor(id, kind) {
			super(id, Types.Entities.CHEST);
		}

		getSpriteName() {
            return "chest";
        }

        isMoving() {
            return false;
        }
		open_callback;
        open() {
            if(this.open_callback) {
                this.open_callback();
            }
        }

        onOpen(callback) {
            this.open_callback = callback;
        }
	}
}