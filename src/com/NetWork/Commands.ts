/**
 *
 * @author 
 *
 */
module NetWork{
    export class Commands extends egret.EventDispatcher{
        CMDHashMap:Tools.Map;
        public constructor() {
            super();
            this.CMDHashMap = new Tools.Map();
            this.CMDHashMap.put(Types.Messages.WELCOME,this.receiveWelcome);
        }
        public get Coomands():Tools.Map{
            return this.CMDHashMap;
        }
        receiveWelcome(data) {
            Main.debugView.addLog("receiveWelcome");
        }
    }
}

