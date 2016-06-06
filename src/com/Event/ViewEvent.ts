/**
 * Created by User on 2015/5/19.
 */
module EGEvent{
    export class ViewEvent extends egret.Event{
        public static DISGAMEVIEW:string="DISGAMEVIEW";
        public static ADD_SCORE:string="ADD_SCORE";

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