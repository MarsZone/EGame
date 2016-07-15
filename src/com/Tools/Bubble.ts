module Tools {
	export class Bubble {
		public constructor(id, element, time) {
			this.id = id;
            this.element = element;
            this.timer = new ETimer(5000, time);
		}
		id;
		element;
		timer;
	}
}