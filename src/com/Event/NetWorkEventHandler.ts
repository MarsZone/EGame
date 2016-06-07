/**
 *
 * @author 
 *
 */
class NetWorkEventHandler extends egret.EventDispatcher{
    protected static _instance: NetWorkEventHandler;
    public constructor() {
        super();
    }
    public static get instance():NetWorkEventHandler{
        if(!this._instance)
        {
            this._instance=new NetWorkEventHandler();
        }
        return this._instance;
    }
}
