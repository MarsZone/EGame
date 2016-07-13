module Model{
    export class User extends egret.EventDispatcher{
         
        public constructor(){
            super();
        }
        public setData(name="",pw="",email="",started=false):void{
            this.name=name;
            this.pw = pw;
            this.email=email;
            this.started=started;
        }
        name ="";
        pw="";
        email="";
        started:boolean=false;
    }
}