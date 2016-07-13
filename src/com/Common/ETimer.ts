module Common {
	export class ETimer extends egret.EventDispatcher{
		public constructor(duration, startTime=0) {
			super();
			this.lastTime = startTime || 0;
            this.duration = duration;
		}
		lastTime;
		duration;
		isOver(time) {
            var over = false;

            if((time - this.lastTime) > this.duration) {
                over = true;
                this.lastTime = time;
            }
            return over;
        }
	}
}