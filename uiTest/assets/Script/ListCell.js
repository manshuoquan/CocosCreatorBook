cc.Class({
    extends: cc.Component,

    properties: {
        nameLabel1: {
            default: null,
            type: cc.Label
        },
        nameLabel2: {
            default: null,
            type: cc.Label
        },
        blood: {
            default: null,
            type: cc.Sprite
        },
        spriteFrame:{
            default: null,
            type: cc.Sprite
        },
        button: {
            default: null,
            type: cc.Button
        },
    },

    upDateInfo (spriteFrame,info){
        this.nameLabel1.string = info.name        //名称
        this.nameLabel2.string = info.name2       //别名
        this.blood._fillRange = info.blood        //血量
        this.spriteFrame.spriteFrame = spriteFrame//图片
    },

    start () {

    },
});
