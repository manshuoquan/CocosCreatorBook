cc.Class({
    extends: cc.Component,

    properties: {
        soundNode: {
            default: null,
            type: cc.Node
        },
        pauseBtn: {
            default: null,
            type: cc.Button
        },
        pauseBoard: {
            default: null,
            type: cc.Layout
        },
        continueBtn: {
            default: null,
            type: cc.Button
        },
        musicBtn: {
            default: null,
            type: cc.Button
        },
        soundBtn: {
            default: null,
            type: cc.Button
        },
        musicSpriteFrame1: {
            default: null,
            type: cc.SpriteFrame
        },
        musicSpriteFrame2: {
            default: null,
            type: cc.SpriteFrame
        },
        soundSpriteFrame1: {
            default: null,
            type: cc.SpriteFrame
        },
        soundSpriteFrame2: {
            default: null,
            type: cc.SpriteFrame
        },
    },
    onContinue ()
    {
        this.soundNode.getComponent("SoundControl").playButton()
        this.pauseBoard.node.active = false
    },
    onPause (){
        this.soundNode.getComponent("SoundControl").playButton()
        this.pauseBoard.node.active = true
    },
    onMusic (){
        this.soundNode.getComponent("SoundControl").playButton()
        if(this.soundNode.getComponent("SoundControl").musicOn)
        {
            this.soundNode.getComponent("SoundControl").setMusicOnOff()
            this.musicBtn.getComponent(cc.Button).normalSprite = this.musicSpriteFrame2
            this.musicBtn.getComponent(cc.Button).pressedSprite = this.musicSpriteFrame2
            this.musicBtn.getComponent(cc.Button).hoverSprite = this.musicSpriteFrame2
            this.musicBtn.getComponent(cc.Button).disabledSprite = this.musicSpriteFrame2
        }else{
            this.soundNode.getComponent("SoundControl").setMusicOnOff()
            this.musicBtn.getComponent(cc.Button).normalSprite = this.musicSpriteFrame1
            this.musicBtn.getComponent(cc.Button).pressedSprite = this.musicSpriteFrame1
            this.musicBtn.getComponent(cc.Button).hoverSprite = this.musicSpriteFrame1
            this.musicBtn.getComponent(cc.Button).disabledSprite = this.musicSpriteFrame1
        }
    },
    onSound (){
        this.soundNode.getComponent("SoundControl").playButton()
        if(this.soundNode.getComponent("SoundControl").soundOn)
        {
            this.soundNode.getComponent("SoundControl").setSoundOnOff()
            this.soundBtn.getComponent(cc.Button).normalSprite = this.soundSpriteFrame2
            this.soundBtn.getComponent(cc.Button).pressedSprite = this.soundSpriteFrame2
            this.soundBtn.getComponent(cc.Button).hoverSprite = this.soundSpriteFrame2
            this.soundBtn.getComponent(cc.Button).disabledSprite = this.soundSpriteFrame2
        }else{
            this.soundNode.getComponent("SoundControl").setSoundOnOff()
            this.soundBtn.getComponent(cc.Button).normalSprite = this.soundSpriteFrame1
            this.soundBtn.getComponent(cc.Button).pressedSprite = this.soundSpriteFrame1
            this.soundBtn.getComponent(cc.Button).hoverSprite = this.soundSpriteFrame1
            this.soundBtn.getComponent(cc.Button).disabledSprite = this.soundSpriteFrame1
        }
    },
    start () {
        this.soundNode.getComponent("SoundControl").allMusicStart()
    },
});
