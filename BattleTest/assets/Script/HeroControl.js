cc.Class({
    extends: cc.Component,

    properties: {
        bloodSp : {
            default: null,
            type: cc.Sprite
        },
    },

    setBlood(value){
        cc.log("setBlood->"+value)
        this.bloodSp.fillRange = value
    },
    start () {

    },
});
