var Unit;
(function (Unit) {
    /**
     *
     * @author
     *
     */
    var SqTextures = (function () {
        function SqTextures() {
        }
        var d = __define,c=SqTextures,p=c.prototype;
        SqTextures.GetSQTexture = function () {
            var data = RES.getRes("SqTextures_json");
            var texture = RES.getRes("SqTextures_png");
            var mcDataFactory = new egret.MovieClipDataFactory(data, texture);
            var sqUnit = new egret.MovieClip(mcDataFactory.generateMovieClipData("sqUnit"));
            //egret.MainContext.instance.stage.addChild(sqUnit);
            //sqUnit.gotoAndPlay(1,-1);
            return sqUnit;
        };
        return SqTextures;
    }());
    Unit.SqTextures = SqTextures;
    egret.registerClass(SqTextures,'Unit.SqTextures');
})(Unit || (Unit = {}));
//# sourceMappingURL=SqTextures.js.map