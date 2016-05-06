var Tools;
(function (Tools) {
    /**
     *
     * @author Mars
     *
     */
    var DebugView = (function (_super) {
        __extends(DebugView, _super);
        function DebugView() {
            _super.call(this);
            this.touchEnabled = true;
        }
        var d = __define,c=DebugView,p=c.prototype;
        p.init = function (w, h) {
            this.drawBG(w, h);
            this.createCloseBtn();
            this.initTF();
        };
        p.createCloseBtn = function () {
            //this.CloseBtn = Main.createBitmapByName("closeBtn_png");
            this.CloseBtn = new egret.Sprite();
            this.CloseBtn.graphics.lineStyle(5, 0x000000, 1);
            this.CloseBtn.graphics.moveTo(0, 0);
            this.CloseBtn.graphics.lineTo(50, 50);
            this.CloseBtn.graphics.moveTo(50, 0);
            this.CloseBtn.graphics.lineTo(0, 50);
            this.addChild(this.CloseBtn);
            this.CloseBtn.touchEnabled = true;
            this.CloseBtn.x = this.width - this.CloseBtn.width;
            this.CloseBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onCloseBtnClick, this);
        };
        p.onCloseBtnClick = function (e) {
            this.visible = false;
        };
        p.drawBG = function (w, h) {
            this.graphics.beginFill(0x666666, 0.8);
            this.graphics.drawRect(0, 0, w, h);
            this.graphics.endFill();
        };
        p.initTF = function () {
            this.tf = new egret.TextField();
            this.tf.touchEnabled = true;
            this.tf.size = 15;
            this.tf.height = Main.StageHeight;
            this.tf.width = Main.StageWidth - this.CloseBtn.width;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchStartTF, this);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMoveTF, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEndTF, this);
            this.addChild(this.tf);
        };
        p.onTouchStartTF = function (event) {
            this.org_Ypos = event.stageY;
            //console.log("Start");
        };
        p.onTouchMoveTF = function (event) {
            var offsetY = event.stageY - this.org_Ypos;
            //console.log("Move");
            if (offsetY < 0) {
                var gap = Math.abs(offsetY);
                var count = parseInt((gap / this.LineHeightGap).toString()) + this.tf.scrollV;
                if (count > this.MaxScrollV) {
                    this.tf.scrollV = this.MaxScrollV;
                }
                else {
                    this.tf.scrollV = count;
                }
            }
            else {
                var gap = Math.abs(offsetY);
                var count = this.tf.scrollV - parseInt((gap / this.LineHeightGap).toString());
                if (count < 1) {
                    this.tf.scrollV = 1;
                }
                else {
                    this.tf.scrollV = count;
                }
            }
        };
        p.onTouchEndTF = function (event) {
        };
        p.addLog = function (word, from) {
            if (from === void 0) { from = "Src"; }
            //var dateTime: string = (new Date()).toDateString()+(new Date()).toTimeString();
            var dateTime = "" + (new Date()).getHours() + ":" + (new Date()).getMinutes() + ":" + (new Date()).getSeconds();
            this.tf.appendText("[" + from + "]: " + "[" + dateTime + "]");
            this.tf.appendText(" " + word + "\n");
            console.log("[" + from + "]: " + "[" + dateTime + "]" + " " + word);
            this.LineHeightGap = this.tf.textHeight / this.tf.maxScrollV;
            this.tf.scrollV = parseInt(((this.tf.textHeight - Main.StageHeight) / this.LineHeightGap).toString());
            this.MaxScrollV = this.tf.scrollV;
            //console.log(" Main.StageHeight"+ Main.StageHeight);
            //console.log("maxScrollV"+this.tf.maxScrollV);
            //console.log("scrollV"+this.tf.scrollV);
            //console.log("textHeight"+this.tf.textHeight);
            //this.tf.scrollV = this.tf.maxScrollV;
            if (this.tf.numLines > 500) {
                var firstLineEnd = this.tf.text.indexOf("\n") + 1;
                this.tf.text = this.tf.text.substring(firstLineEnd, this.tf.text.length);
            }
        };
        p.toStringLog = function () {
            console.log(this.tf.text.toString());
        };
        return DebugView;
    }(egret.Sprite));
    Tools.DebugView = DebugView;
    egret.registerClass(DebugView,'Tools.DebugView');
})(Tools || (Tools = {}));
//# sourceMappingURL=DebugView.js.map