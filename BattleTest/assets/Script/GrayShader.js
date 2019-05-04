let shader = {
    name: 'grayColor',

    defines: [
    ],
    //顶点着色器
    vert: 
    `
    uniform mat4 viewProj;
    uniform mat4 model;
    attribute vec3 a_position;
    attribute vec2 a_uv0;
    varying vec2 uv0;
    void main () {
        mat4 mvp;
        mvp = viewProj * model;

        vec4 pos = mvp * vec4(a_position, 1);
        gl_Position = pos;
        uv0 = a_uv0;
    }`,
    //像素着色器
    frag:
    `
    #ifdef GL_ES
    precision lowp float;
    #endif
    uniform sampler2D iTexture;
    varying vec2 uv0;
    void main()
    {
        vec4 c = texture2D(iTexture, uv0);
        gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
        gl_FragColor.w = c.w;
    }`,
    
};

cc.game.once(cc.game.EVENT_ENGINE_INITED, function () {
    // cc.renderer._forward._programLib.define(shader.name, shader.vert, shader.frag, shader.defines);
});

module.exports = shader;