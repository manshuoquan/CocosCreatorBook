var ShaderUtils = {
    shaderPrograms: {},

    setShader: function(sprite, shaderName) {
        //查看缓存
        var glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
            //调用C++借口
            glProgram = new cc.GLProgram();
            //获得shader
            var vert = require(cc.js.formatStr("%s.vert", shaderName));
            var frag = require(cc.js.formatStr("%s.frag", shaderName));
            //初始化
            glProgram.initWithString(vert, frag);
            if (!cc.sys.isNative) {  
                //传入信息
                glProgram.initWithVertexShaderByteArray(vert, frag);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);  
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);  
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);  
            }
            glProgram.link();  
            glProgram.updateUniforms();
            this.shaderPrograms[shaderName] = glProgram;
        }
        //使用
        sprite._sgNode.setShaderProgram(glProgram);
        return glProgram;
    },
};

module.exports = ShaderUtils;


          