const math = cc.vmath;
const renderEngine = cc.renderer.renderEngine;
const renderer = renderEngine.renderer;
const gfx = renderEngine.gfx;
const Material = renderEngine.Material;

require('GrayShader');

function GrayMaterial () {
    Material.call(this, false);

    var pass = new renderer.Pass('grayColor');
    pass.setDepth(false, false);
    pass.setCullMode(gfx.CULL_NONE);
    pass.setBlend(
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
        gfx.BLEND_FUNC_ADD,
        gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
    );

    let mainTech = new renderer.Technique(
        ['transparent'],
        [
            { name: 'iTexture', type: renderer.PARAM_TEXTURE_2D },
        ],
        [
            pass
        ]
    );

    this._texture = null;

    this._effect = this.effect = new renderer.Effect(
        [mainTech],{},[]
    );
    
    this._mainTech = mainTech;
}
cc.js.extend(GrayMaterial, Material);
cc.js.mixin(GrayMaterial.prototype, {
    getTexture () {
        return this._texture;
    },

    setTexture (val) {
        if (this._texture !== val) {
            this._texture = val;
            this._texture.update({
                flipY: false,
                mipmap: true
            });
            this.effect.setProperty('iTexture', val.getImpl());
            this._texIds['iTexture'] = val.getId();
        }
    },
});

module.exports = GrayMaterial;