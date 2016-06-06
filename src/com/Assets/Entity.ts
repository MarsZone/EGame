module Assets{
    export /**
     * Entity
     */
    class Entity extends egret.Sprite{
        constructor() {
            super();
        }
        id:string;
        kind:string;
        init(id:string, kind:string):void{
            this.id=id;
            this.kind=kind;
        }
    }
}