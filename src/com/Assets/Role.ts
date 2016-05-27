module Assets {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Role extends Assets.Entity{
    	public constructor() {
    	    super();
		}
        animiations:Array<Assets.Animation>;
        
        init(id:number, kind:string):void{
            super.init(id,kind);
            this.id=id;
            this.kind=kind;
        }
	}
}
