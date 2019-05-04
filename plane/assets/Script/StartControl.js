cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: {
            default: null,
            type: cc.Button
        }
    },

    start () {

    },

    onLoadSceneFinish(){

    },

    onPlay() {
       cc.director.loadScene('db://assets/Scene/planeReady.fire');
    },
});

