module Content {
	/**
	 *
	 * @author mars
	 *
	 */
	export class Render extends egret.Sprite {
		public constructor(map:Gmap.Map) {
			super();
			this.map = map;
			this.init();
		}
		chara: Assets.ECharacter;
		context:egret.Sprite;
        backGound:egret.Sprite;
		foreground:egret.Sprite;
		map:Gmap.Map;
		camera:Content.Camera;
		mobile:boolean=false;
		tilesize=32;
		animatedTileCount=0;
		highTileCount=0;
		init(): void {
			
			//add BG
			this.backGound=new egret.Sprite();
			this.foreground = new egret.Sprite();
			this.context = new egret.Sprite();
			this.addSP(this.backGound,Main.StageWidth,Main.StageHeight);
			this.addSP(this.foreground,Main.StageWidth,Main.StageHeight);
			this.addSP(this.context,Main.StageWidth,Main.StageHeight)
			this.addRole();
			//this.renderStaticCanvases();
			
			this.camera =new Content.Camera(this);
		}
		addSP(sp:egret.Sprite,width,height){
			sp.width = width;
			sp.height = height;
			this.addChild(sp);
		}

		drawText(text, x, y, centered, color, strokeColor){
			//Main.debugView.log("drawText");

		}
		drawCellRect(x, y, color,alpha=1) {
			Main.debugView.log("drawCellRect");
			this.context.graphics.lineStyle(2,color,alpha);
			this.context.graphics.drawRect(x,y,this.tilesize-4,this.tilesize-4);
            //this.context.strokeRect(0, 0, (this.tilesize * this.scale) - 4, (this.tilesize * this.scale) - 4);
		}
		drawRectStroke(x, y, width, height, color,alpha=1) {
			Main.debugView.log("drawRectStroke");
			this.context.graphics.beginFill(color,alpha);
			this.context.graphics.drawRect(x,y,this.tilesize *width,this.tilesize *height);
			this.context.graphics.endFill();
			
			this.context.graphics.lineStyle(5,0x000000);
			this.context.graphics.drawRect(x,y,this.tilesize *width,this.tilesize *height);
		}
		drawRect(x, y, width, height, color,alpha=1) {
			Main.debugView.log("drawRect");
			this.context.graphics.beginFill(color,alpha);
			this.context.graphics.lineStyle(5);
			this.context.graphics.drawRect(x,y,this.tilesize *width,this.tilesize *height);
			this.context.graphics.endFill();
		}

		drawCellHighlight(x, y, color ,alpha=1) {
			var ts = this.tilesize;
			var tx = x * ts;
			var ty = y * ts;
            this.drawCellRect(tx, ty, color,alpha);
        }
		drawTargetCell(){
			Main.debugView.log("drawTargetCell");
			
		}
		drawAttackTargetCell(){
			Main.debugView.log("drawAttackTargetCell");
		}
		drawOccupiedCells(){

		}
		drawPathingCells(){

		}
		drawSelectedCell(){

		}
		clearScaledRect(){
			this.context.graphics.clear();
		}
		drawCursor(){

		}
		clearTile(){

		}

		renderStaticCanvases():void{
			this.drawTerrain();
			//this.drawHighTiles(this.foreground);
		}
		GridS:Array<egret.Sprite>;

		drawTerrain():void{
			var tilesetwidth:number = this.map.tileSetWidth / this.map.tilesize;
			var horizontal_tiles = Main.StageWidth / tilesetwidth;
			var vertical_tiles = Math.floor(Main.StageHeight / tilesetwidth);
			Main.debugView.log("H:"+horizontal_tiles+"|V:"+vertical_tiles);
			
			this.GridS = new Array();
			var CenterX = 0;
			var CenterY = 0;
			var offsetX = Math.floor(horizontal_tiles/2);
			var offsetY = Math.floor(vertical_tiles/2);
			
			for (var row = 0; row < vertical_tiles; row++) {
				for(var col=0; col<horizontal_tiles;col++)
				{
					var GridBits:egret.Sprite = new egret.Sprite();
					this.GridS.push(GridBits);
					this.backGound.addChild(GridBits);
					GridBits.x = col * tilesetwidth;
					GridBits.y = row * tilesetwidth;
					GridBits.width = tilesetwidth;
					GridBits.height = tilesetwidth;
					var index:string ="";
					var ix = CenterX + col -offsetX;
					var iy = (CenterY + row -offsetY) * this.map.width;
					if(CenterX<offsetX)
					{
						ix =CenterX + col;
					}
					if(CenterY<offsetY)
					{
						iy = (CenterY + row)* this.map.width;
					}
					
					index = ""+(ix+iy);
					//Main.debugView.log("ix:"+ix+"|iy:"+iy+"|index:"+index);
					var txData = this.map.data[index];
					if(txData instanceof Array)
					{
						for(var tx of txData)
						{
							var bitmap:egret.Bitmap = new egret.Bitmap();
							bitmap.texture = this.map.SpritesSheet.getTexture(tx);
							bitmap.width = GridBits.width;
							bitmap.height = GridBits.height;
							GridBits.addChild(bitmap);
						}
					}else{
						if(txData!=0)
						{
							var bitmap:egret.Bitmap = new egret.Bitmap();
							bitmap.width = GridBits.width;
							bitmap.height = GridBits.height;
							//Main.debugView.log("TxData:"+txData);
							bitmap.texture = this.map.SpritesSheet.getTexture(txData);
							GridBits.addChild(bitmap);
						}else{

						}
					}
				}
			}
		}

		drawTile(index):void{

		}
		forEachVisibleTile():void{
			if(this.map.mapLoaded)
			{
				for(var tile of this.map.data)
				{
					if(tile instanceof Array)
					{
						//Main.debugView.addLog("Array.");
					}else{
						//Main.debugView.addLog("Signer");						
					}
				}
			}
		}

		//AddRole_test
		addRole():void{
			//ForTest AddRole
			this.chara = new Assets.ECharacter("leatherarmor", "character");
			this.chara.x += 100;
			this.chara.y += 100;
			this.addChild(this.chara);
			var self = this;
			//test key controler.
			document.addEventListener("keydown",function(event:KeyboardEvent){
				switch (event.keyCode) {
					case Types.KeyMap.Up:
						self.chara.setCurAnimation("walk_up");
						break;
					case Types.KeyMap.Down:
						self.chara.setCurAnimation("walk_down");
						break;
					case Types.KeyMap.Left:
						self.chara.setCurAnimation("walk_right",true);
						break;
					case Types.KeyMap.Right:
						self.chara.setCurAnimation("walk_right");
						break;
				}
			})
			EGEvent.UIEventHandler.instance.addEventListener(EGEvent.GameEvent.CHANGE,this.onChange,this);
		}
		update(): void {
			this.chara.update();
		}
		onChange(e:EGEvent.GameEvent):void{
			this.chara.setCurAnimation("walk_right");
		}
	}
}
