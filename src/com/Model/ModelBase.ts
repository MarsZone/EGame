module Model{
    export /**
     * ModelBase
     */
    class ModelBase extends egret.EventDispatcher{
        protected static _instance: ModelBase;
        public constructor() {
            super();
        }
        public static get instance():ModelBase{
            if(!this._instance)
            {
                this._instance=new ModelBase();
            }
            return this._instance;
        }
        protected _user:Model.User;
        public get user(): Model.User {
            return this._user;
        }
        public set user(value: Model.User) {
            this._user = value;
        }
    }
}