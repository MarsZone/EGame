//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;
    public static StageWidth: number;
    public static StageHeight: number;
    public static debugView: Tools.DebugView;
    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup("preload",3);
        RES.loadGroup("image",2);
        RES.loadGroup("json",1);
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        egret.log("Load Finish:"+event.groupName);
        if (event.groupName == "json") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;
    private gameLayer: egret.Sprite;
    private net:NetWork.Net;
    private map:Gmap.Map;
    game: Content.Game;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene():void {
    //    var sp: egret.Sprite = new egret.Sprite();
    //    this.addChild(sp);
    //    sp.graphics.beginFill(0xFFF111,1);
    //    sp.graphics.drawRect(0,0,100,100);
    //    sp.graphics.endFill();
        //修改为30帧
        //this.stage.frameRate = 30;//能被60整除的数
        this.stage.scaleMode = egret.StageScaleMode.FIXED_WIDTH;
        this.stage.orientation = egret.OrientationMode.LANDSCAPE;
        Main.StageWidth = egret.MainContext.instance.stage.stageWidth;
        Main.StageHeight = egret.MainContext.instance.stage.stageHeight;
        
        //调试面板先实例化
        Main.debugView = new Tools.DebugView();
        Main.debugView.init(Main.StageWidth,Main.StageHeight);
        Main.debugView.log("Start: StageWidth:"+Main.StageWidth+"_ StageHeight:"+Main.StageHeight,"Main");
        
        //网络初始化
        this.net = new NetWork.Net();
        //this.net.Init();

        //加载地图
        this.map =new Gmap.Map();
        
        var sp:Assets.ESprite = new Assets.ESprite("leatherarmor");
        //游戏层
        this.gameLayer = new egret.Sprite();
        this.gameLayer.touchEnabled = true;
        this.gameLayer.width = Main.StageWidth;
        this.gameLayer.height = Main.StageHeight;
        this.gameLayer.graphics.beginFill(0xFFFFFF,1);
        this.gameLayer.graphics.drawRect(0,0,Main.StageWidth,Main.StageHeight);
        this.gameLayer.graphics.endFill();
        
        this.addChild(this.gameLayer);
        this.game = new Content.Game(this.map,this.net);
        //游戏内容
        this.gameLayer.addChild(this.game);
        //this.addChild(Main.createBitmapByName("leatherarmor_png"));
        
        //开始结束菜单
        
        //调试面板放在顶层
        //this.addChild(Main.debugView);
        //Main.debugView.visible=false;
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    public static createBitmapByName(name:string):egret.Bitmap {
        var result:egret.Bitmap = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }
}


