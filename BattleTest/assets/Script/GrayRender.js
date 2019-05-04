const GrayMaterial = require('GrayMaterial');

cc.Class({
    extends: cc.Component,

    properties: {
        target: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.dynamicAtlasManager.enabled = false;
        this._material = null
    },

    start () {
        this._start = Date.now();
        /* if(this._material == null){
            //创建材质
            this._material = new GrayMaterial();
        }
        if (this.target) {
            //为材质设置贴图
            let texture = this.target.spriteFrame.getTexture();
            this._material.setTexture(texture);
            this._material.updateHash();
            this.target._material = this._material;
            this.target._renderData._material = this._material;
        }*/
    },
});
