var Content;
(function (Content) {
    /**
     *
     * @author
     *
     */
    var Core = (function (_super) {
        __extends(Core, _super);
        function Core() {
            _super.call(this);
            this.time = 0;
        }
        var d = __define,c=Core,p=c.prototype;
        p.start = function () {
            egret.startTick(this.update, this);
        };
        p.update = function (timeStamp) {
            var now = timeStamp;
            var time = this.time;
            var pass = now - time;
            //console.log("moveStar: ",(1000 / pass).toFixed(5));
            this.time = now;
            return true;
        };
        p.pause = function () {
        };
        p.stop = function () {
            egret.stopTick(this.update, this);
        };
        p.reset = function () {
        };
        return Core;
    }(egret.DisplayObjectContainer));
    Content.Core = Core;
    egret.registerClass(Core,'Content.Core');
})(Content || (Content = {}));
//# sourceMappingURL=Core.js.map