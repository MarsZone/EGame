module Assets{
    export /**
     * Entity
     */
    class Entity extends egret.Sprite{
        constructor() {
            super();
        }
        id:number;
        kind:string;
        init(id:number, kind:string):void{
            this.id=id;
            this.kind=kind;
        }
    }
}