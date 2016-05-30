var Assets;
(function (Assets) {
    var Entity = (function (_super) {
        __extends(Entity, _super);
        function Entity() {
            _super.call(this);
        }
        var d = __define,c=Entity,p=c.prototype;
        p.init = function (id, kind) {
            this.id = id;
            this.kind = kind;
        };
        return Entity;
    }(egret.Sprite));
    Assets.Entity = Entity;
    egret.registerClass(Entity,'Assets.Entity');
})(Assets || (Assets = {}));
//# sourceMappingURL=Entity.js.map