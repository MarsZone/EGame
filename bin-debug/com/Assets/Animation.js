var Assets;
(function (Assets) {
    var RoleAnimation = (function () {
        function RoleAnimation() {
        }
        var d = __define,c=RoleAnimation,p=c.prototype;
        p.init = function (name, length, row, width, height) {
            this.name = name;
            this.length = length;
            this.row = row;
            this.width = width;
            this.height = height;
            this.reset();
        };
        p.reset = function () {
            this.lastCallCounter = 0;
            this.currentFrame = 0;
        };
        return RoleAnimation;
    }());
    Assets.RoleAnimation = RoleAnimation;
    egret.registerClass(RoleAnimation,'Assets.RoleAnimation',["Assets.Animation"]);
})(Assets || (Assets = {}));
//# sourceMappingURL=Animation.js.map