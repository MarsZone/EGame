var Content;
(function (Content) {
    /**
     *
     * @author
     *
     */
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            _super.call(this);
            this.Init();
        }
        var d = __define,c=View,p=c.prototype;
        p.Init = function () {
            //交互区
            //this.Test();
            //顶层Bar
            this.core = new Content.Core();
            //this.core.start();
            //底层Bar
        };
        p.Test = function () {
            //            this.circle = new egret.Sprite;
            //            this.circle.graphics.beginFill(0x111111,1);
            var sqt = Unit.SqTextures.GetSQTexture();
            //            this.circle.graphics.drawCircle(sqt.width*2.5,sqt.height*2.5,sqt.width*2.5);
            //            this.circle.graphics.endFill();
            //            this.addChild(this.circle);
            this.sqGroup = new egret.Sprite;
            this.sqArray = new Array();
            this.GroupLayer = new egret.Sprite;
            this.addChild(this.GroupLayer);
            this.GroupLayer.addChild(this.sqGroup);
            var row = 10;
            var col = 7;
            for (var i = 0; i < row; i++) {
                for (var j = 0; j < col; j++) {
                    var sq = Unit.SqTextures.GetSQTexture();
                    var k = parseInt(Math.random() * 7 + 1 + "");
                    Main.debugView.addLog("Random Number:" + k);
                    sq.gotoAndStop(k);
                    sq.x = j * sq.width;
                    sq.y = i * sq.height;
                    this.sqGroup.addChild(sq);
                    this.sqArray.push(sq);
                }
            }
            //this.sqGroup.$setWidth(Main.StageWidth);
            //this.sqGroup.$setHeight(Main.StageHeight);
            //this.sqGroup.scaleX = this.sqGroup.scaleY = Main.StageHeight/Main.StageWidth;
        };
        return View;
    }(egret.Sprite));
    Content.View = View;
    egret.registerClass(View,'Content.View');
})(Content || (Content = {}));
//# sourceMappingURL=View.js.map