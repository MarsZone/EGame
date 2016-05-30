var Content;
(function (Content) {
    /**
     *
     * @author mars
     *
     */
    var View = (function (_super) {
        __extends(View, _super);
        function View() {
            _super.call(this);
            this.init();
        }
        var d = __define,c=View,p=c.prototype;
        p.init = function () {
            this.role = new Assets.Role();
            this.role.x += 100;
            this.role.y += 100;
            this.addChild(this.role);
            this.role1 = new Assets.Role();
            this.addChild(this.role1);
        };
        p.update = function () {
            this.role.update();
            this.role1.update();
        };
        return View;
    }(egret.Sprite));
    Content.View = View;
    egret.registerClass(View,'Content.View');
})(Content || (Content = {}));
//# sourceMappingURL=View.js.map