
var game_file_list = [
    //以下为自动修改，请勿修改
    //----auto game_file_list start----
	"libs/modules/egret/egret.js",
	"libs/modules/egret/egret.native.js",
	"libs/modules/game/game.js",
	"libs/modules/game/game.native.js",
	"libs/modules/tween/tween.js",
	"libs/modules/res/res.js",
	"libs/modules/socket/socket.js",
	"libs/modules/greensock/greensock.js",
	"libs/modules/socket.io/socket.io.js",
	"libs/modules/underscore/underscore.js",
	"libs/modules/AStar/AStar.js",
	"bin-debug/com/Assets/Animation.js",
	"bin-debug/com/Assets/EAnimation.js",
	"bin-debug/com/Common/Entity.js",
	"bin-debug/com/Assets/ECharacter.js",
	"bin-debug/com/Assets/ESprite.js",
	"bin-debug/com/Assets/Sprite.js",
	"bin-debug/com/Common/Character.js",
	"bin-debug/com/Common/ETimer.js",
	"bin-debug/com/Common/Exceptions.js",
	"bin-debug/com/Common/Transition.js",
	"bin-debug/com/Common/UI.js",
	"bin-debug/com/Common/Updater.js",
	"bin-debug/com/Content/Camera.js",
	"bin-debug/com/Content/Core.js",
	"bin-debug/com/Content/Game.js",
	"bin-debug/com/Content/InfoManager.js",
	"bin-debug/com/Content/Player.js",
	"bin-debug/com/Content/Render.js",
	"bin-debug/com/Event/GameEvent.js",
	"bin-debug/com/Event/NetWorkEventHandler.js",
	"bin-debug/com/Event/UIEventHandler.js",
	"bin-debug/com/Event/ViewEvent.js",
	"bin-debug/com/Gmap/Area.js",
	"bin-debug/com/Gmap/Map.js",
	"bin-debug/com/Gmap/MapWoker.js",
	"bin-debug/com/Model/ModelBase.js",
	"bin-debug/com/Model/User.js",
	"bin-debug/com/NetWork/Commands.js",
	"bin-debug/com/NetWork/Net.js",
	"bin-debug/com/Role/Warrior.js",
	"bin-debug/com/Tools/DebugView.js",
	"bin-debug/com/Tools/HashMap.js",
	"bin-debug/com/Tools/Pathfinder.js",
	"bin-debug/com/Types/gameTypes.js",
	"bin-debug/LoadingUI.js",
	"bin-debug/Main.js",
	//----auto game_file_list end----
];

var window = this;

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    for (var key in game_file_list) {
        var src = game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    egret_native.requireFiles();
    egret.TextField.default_fontFamily = "/system/fonts/DroidSansFallback.ttf";
    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };
};

egret_native.egretStart = function () {
    var option = {
        //以下为自动修改，请勿修改
        //----auto option start----
		entryClassName: "Main",
		frameRate: 60,
		scaleMode: "fixedWidth",
		contentWidth: 1280,
		contentHeight: 768,
		showPaintRect: false,
		showFPS: false,
		fpsStyles: "x:0,y:0,size:30,textColor:0x00c200,bgAlpha:0.9",
		showLog: false,
		logFilter: "",
		maxTouches: 2,
		textureScaleFactor: 1
		//----auto option end----
    };

    egret.native.NativePlayer.option = option;
    egret.runEgret();
    egret_native.Label.createLabel(egret.TextField.default_fontFamily, 20, "", 0);
    egret_native.EGTView.preSetOffScreenBufferEnable(true);
};