var Content;
(function (Content) {
    /**
     *
     * @author mars
     *
     */
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
            this.Init();
        }
        var d = __define,c=Game,p=c.prototype;
        p.Init = function () {
            //init view
            this.view = new Content.View();
            this.addChild(this.view);
            //init core
            this.core = new Content.Core(this.view);
            this.core.start();
        };
        return Game;
    }(egret.Sprite));
    Content.Game = Game;
    egret.registerClass(Game,'Content.Game');
})(Content || (Content = {}));
//# sourceMappingURL=Game.js.map