var Content;
(function (Content) {
    /**
     *
     * @author mars
     *
     */
    var Core = (function (_super) {
        __extends(Core, _super);
        function Core(view) {
            _super.call(this);
            this.index = 0;
            this.frameControler = true;
            this.time = 0;
            this._view = view;
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
            //Main.debugView.addLog("moveStar: "+(1000 / pass).toFixed(5)+"_index"+this.index,"Core");
            this.time = now;
            //Every 30 frame.update.
            if (this.frameControler) {
                this._view.update();
            }
            this.frameControler = !this.frameControler;
            this.index++;
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