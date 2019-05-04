window.Global = {
    selectIndex:1,
};
cc.Class({
    extends: cc.Component,

    properties: {
        playBtn: {
            default: null,
            type: cc.Button
        },
        plane1: {
            default: null,
            type: cc.Button
        },
        plane2: {
            default: null,
            type: cc.Button
        },
        plane3: {
            default: null,
            type: cc.Button
        }
    },

    onLoadSceneFinish(){

    },
    //初始化
    onLoad() {
        //选择哪个飞机
        this.selectIndex = 1
        this.planeArr = []
        this.planeArr[1] = this.plane1
        this.planeArr[2] = this.plane2
        this.planeArr[3] = this.plane3
    },

    choosePlane(index) {
        //选择主角飞机形象
        if(this.selectIndex != index){
            this.planeArr[this.selectIndex].node.setPosition(cc.p(this.planeArr[this.selectIndex].node.getPosition().x,-60))
            this.selectIndex = index
            this.planeArr[this.selectIndex].node.setPosition(cc.p(this.planeArr[this.selectIndex].node.getPosition().x,60))
        }
    },
    //飞机点击逻辑
    onSelectIndex1() {
        this.choosePlane(1)
    },

    onSelectIndex2() {
        this.choosePlane(2) 
    },

    onSelectIndex3() {
        this.choosePlane(3)
    },
    //进入游戏逻辑
    onPreparePlay() {
       Global.selectIndex = this.selectIndex
       cc.director.loadScene('db://assets/Scene/mainGame.fire', this.onLoadSceneFinish.bind(this));
    },
});
