/**
 * Created by User on 2015/5/19.
 */
module EGEvent{
    export class GameEvent extends egret.Event{
        public static UPDATE:string="UPDATE";
        public static PAUSE:string="PAUSE";
        public static RESET:string="RESET";
        public static OVER:string="OVER";
        public static CHANGE:string="CHANGE";
            
        
        private _data:string;
        public constructor(type:string,data:string=null, bubbles:boolean=false, cancelable:boolean=false){
            super(type,bubbles,cancelable);
            this._data=data;
        }
        public get data():string{
            return this._data;
        }
    }
}