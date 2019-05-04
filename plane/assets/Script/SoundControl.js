cc.Class({
    extends: cc.Component,

    properties: {
        buttonSound: {
            type: cc.AudioSource,
            default: null
        },
        explosionSound: {
            type: cc.AudioSource,
            default: null
        },
        dropSound: {
            type: cc.AudioSource,
            default: null
        },
        bgMusic: {
            type: cc.AudioSource,
            default: null
        }
    },

    start () {
        this.musicOn = true
        this.soundOn = true
    },
    //所有声音关闭
    setMusicOnOff(){
        this.musicOn = ! this.musicOn
        if(this.musicOn)
        {
            this.allMusicStart()
        }else{
            this.allMusicPause()
        }
    },
    //播放下落音效
    playDrop(){
        if(this.soundOn)
            this.dropSound.play()
    },
    //播放爆炸
    playExp(){
        if(this.soundOn)
            this.explosionSound.play()
    },
    //按钮音效
    playButton(){
        if(this.soundOn)
            this.buttonSound.play()
    },
    setSoundOnOff(){
        this.soundOn = ! this.soundOn
    },
    //所有声音暂停
    allSoundPause(){
        this.buttonSound.pause()
        this.explosionSound.pause()
        this.dropSound.pause()
    },
    //背景音乐暂停
    allMusicPause(){
        this.bgMusic.pause()
    },
    //背景音乐开始
    allMusicStart(){
        this.bgMusic.play()
    }
});
