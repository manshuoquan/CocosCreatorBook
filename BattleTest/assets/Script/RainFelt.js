const RainMaterial = require('RainMaterial');

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.dynamicAtlasManager.enabled = false;
        this._material = new RainMaterial();
    },

    start () {
        this._start = Date.now();

        /*if (this.target) {
            let texture = this.target.spriteFrame.getTexture();
            this._material.setTexture(texture);
            this._material.updateHash();
            this.target._material = this._material;
            this.target._renderData._material = this._material;
        }*/
    },

    update (dt) {
    },
});
