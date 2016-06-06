/**
 *
 * @author 
 *
 */
module EGEvent{
    export class UIEventHandler extends egret.EventDispatcher{
        protected static _instance: UIEventHandler;
        public constructor() {
            super();
        }
        public static get instance():UIEventHandler{
            if(!this._instance)
            {
                this._instance=new UIEventHandler();
            }
            return this._instance;
        }
    }
}
