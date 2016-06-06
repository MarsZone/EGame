/**
 *
 * @author 
 *
 */
class NetWorkEventHandler extends egret.EventDispatcher{
    public static instance: NetWorkEventHandler;
    public constructor() {
        super();
        NetWorkEventHandler.instance = this;
	}
}
