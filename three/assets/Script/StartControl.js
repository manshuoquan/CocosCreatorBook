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

    onPlay() {
       cc.director.loadScene('db://assets/Scene/gameMenu.fire');
    },
});
