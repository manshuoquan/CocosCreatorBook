cc.Class({
    extends: cc.Component,

    properties: {

    },

    //游戏加载函数
    onLoad: function () {
    },

    onPlay() {
        //进入游戏场景
        cc.director.loadScene('db://assets/Scene/mainGame.fire');
    },
});
