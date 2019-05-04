//数据
var HeroListLeft = [
    {"spine":"zhongqibing", "x":-145,"y":-160,"speed": 6,"atk":50,"def":30,"long":false},
    {"spine":"huwei",       "x":-350,"y":-165,"speed": 8,"atk":55,"def":25,"long":false},
    {"spine":"qingqibing",  "x":-220,"y":-220,"speed":10,"atk":60,"def":20,"long":false},
    {"spine":"nuqiangbing", "x":-410,"y":-245,"speed": 7,"atk":50,"def":30,"long":true},
    {"spine":"skeleton",    "x":-265,"y":-285,"speed":12,"atk":40,"def":30,"long":false}
]
var HeroListRight = [
    {"spine":"nongming",    "x":-145,"y":-160,"speed":11,"atk":50,"def":30,"long":false},
    {"spine":"bingxuenv",   "x":-350,"y":-165,"speed": 9,"atk":55,"def":25,"long":true},
    {"spine":"tuyuansu",    "x":-220,"y":-220,"speed": 5,"atk":65,"def":30,"long":false},
    {"spine":"huoqiangshou","x":-410,"y":-245,"speed": 6,"atk":40,"def":20,"long":true},
    {"spine":"zhongbubing", "x":-265,"y":-285,"speed": 7,"atk":45,"def":30,"long":false}
]
//状态
var HERO_STATE_WAIT = 1
var HERO_STATE_MOVE = 2
var HERO_STATE_BACK = 3
var HERO_STATE_ATK  = 4
var HERO_STATE_DEF  = 5
var HERO_STATE_DIE  = 6
cc.Class({
    extends: cc.Component,

    properties: {
        board: {
            default: null,
            type: cc.Node
        },
        animPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    //设置状态
    setAnimState :function(obj,state){
        obj.state = state
        if(state == HERO_STATE_MOVE)
        {
            var targetCamp = 1
            if(obj.camp == 1)
            {
                targetCamp = 0
            }
            var target = null
            //确定攻击对象
            for(var i = 0;i < 10;i ++)
            {
                if(this.orderArray[i].camp == targetCamp && this.orderArray[i].state != HERO_STATE_DIE)
                {
                    this.targetIndex = i
                    target = this.orderArray[i]
                }
            }
            if(target == null)
            {
                //一方全部死亡，游戏结束
                return
            }
            //移动到目标位置
            var targetPos = cc.v2(0,0)
            //是否远程
            var isLong
            if(obj.camp == 1)
            {
                isLong = HeroListRight[obj.id].long
            }else{
                isLong = HeroListLeft[obj.id].long
            }
            if(isLong)
            {
                this.setAnimState(obj,HERO_STATE_ATK)
                return
            }
            if(targetCamp == 1)
            {
                targetPos.x = -(HeroListRight[target.id].x + 40)
                targetPos.y = HeroListRight[target.id].y
            }else{
                targetPos.x = (HeroListRight[target.id].x + 40)
                targetPos.y = HeroListRight[target.id].y
            }
            var callback = cc.callFunc(function()
            {
                //进入到攻击状态
                this.setAnimState(obj,HERO_STATE_ATK)
            }, this)
            var animHandle = this.leftHeroAnim[obj.id]
            if(obj.camp == 1)
                animHandle = this.rightHeroAnim[obj.id]
            animHandle.runAction(cc.sequence(cc.moveTo(0.5, targetPos.x, targetPos.y),callback))
        }else if(state == HERO_STATE_ATK)
        {
            var animHandle = this.leftHeroAnim[obj.id]
            if(obj.camp == 1)
                animHandle = this.rightHeroAnim[obj.id]
            animHandle.getComponent(sp.Skeleton).setAnimation(0,"Attack",false)
            animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                //计算减小的血量
                var tagetDef
                if(obj.camp == 0)
                {
                    tagetDef = HeroListLeft[this.orderArray[this.targetIndex].id].def
                }else{
                    tagetDef = HeroListRight[this.orderArray[this.targetIndex].id].def
                }
                var objAtk
                if(obj.camp == 1)
                {
                    objAtk = HeroListLeft[obj.id].atk
                }else{
                    objAtk = HeroListRight[obj.id].atk
                }
                this.orderArray[this.targetIndex].blood = this.orderArray[this.targetIndex].blood + tagetDef - objAtk
                var tagetHandle = this.rightHeroAnim[this.orderArray[this.targetIndex].id]
                if(obj.camp == 1)
                    tagetHandle = this.leftHeroAnim[this.orderArray[this.targetIndex].id]
                if(this.orderArray[this.targetIndex].blood > 0)
                {
                    cc.log("blood" + this.orderArray[this.targetIndex].id)
                    //掉血
                    tagetHandle.getComponent("HeroControl").setBlood(this.orderArray[this.targetIndex].blood/100)
                }else{
                    //角色死亡
                    cc.log("die")
                    this.setAnimState(this.orderArray[this.targetIndex],HERO_STATE_DIE)
                }
                //退回到原来位置
                animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                })
                animHandle.getComponent(sp.Skeleton).animation = "Run"
                var targetPos = cc.v2(0,0)
                if(obj.camp == 0)
                {
                    targetPos.x = HeroListLeft[obj.id].x
                    targetPos.y = HeroListLeft[obj.id].y
                }else{
                    targetPos.x = -HeroListRight[obj.id].x
                    targetPos.y = HeroListRight[obj.id].y
                }
                var callback = cc.callFunc(function()
                {
                    this.setAnimState(obj,HERO_STATE_WAIT)
                }, this)
                animHandle.runAction(cc.sequence(cc.moveTo(0.5, targetPos.x, targetPos.y),callback))
            })
        }else if(state == HERO_STATE_DIE)
        {
            var animHandle = this.leftHeroAnim[obj.id]
            if(obj.camp == 1)
                animHandle = this.rightHeroAnim[obj.id]
            animHandle.getComponent(sp.Skeleton).setAnimation(0,"Die",false)
            animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                animHandle.getComponent(sp.Skeleton).setCompleteListener(trackEntry => {
                })
                animHandle.active = false
            })
        }else if(state == HERO_STATE_WAIT)
        {
            //回到原始状态
            var animHandle = this.leftHeroAnim[obj.id]
            if(obj.camp == 1)
                animHandle = this.rightHeroAnim[obj.id]
            animHandle.getComponent(sp.Skeleton).animation = "Idle"
            this.orderIndex = this.orderIndex + 1
            this.nextAttack()
        }
    },
    nextAttack: function(){
        if(this.orderIndex > 9)
            this.orderIndex = 0
        var attacker = this.orderArray[this.orderIndex]
        if(attacker.state == HERO_STATE_WAIT)
        {
            this.setAnimState(attacker,HERO_STATE_MOVE)
        }else{
            this.orderIndex = this.orderIndex + 1
            this.nextAttack()
        }
    },

    startGame: function() {
        this.orderIndex = 0
        this.nextAttack()
    },
    //初始化战斗数据
    initGameData: function() {
        this.loadIndex = 0
        this.spineArray = []
        this.leftHeroState = []
        this.rightHeroState = []
        this.orderArray = []
        for(var i = 0;i < 5;i ++)
        {

            this.orderArray[i]     = {"speed":HeroListLeft[i].speed,"atk":HeroListLeft[i].atk,"def":HeroListLeft[i].def,"id":i,"camp":0,"state":HERO_STATE_WAIT,"blood":100}
            this.orderArray[i + 5] = {"speed":HeroListRight[i].speed,"atk":HeroListRight[i].atk,"def":HeroListRight[i].def,"id":i,"camp":1,"state":HERO_STATE_WAIT,"blood":100}
        }
        //根据出手速度排序
        function numberorder(a, b) { return b.speed - a.speed }
        this.orderArray.sort(numberorder)

        this.orderIndex = 0
    },
    //初始化动画
    initGameShow: function() {
        this.leftHeroAnim = []
        this.rightHeroAnim = []
        for(var i = 0;i < 5;i ++)
        {
            //初始化左边阵容动画
            var data = HeroListLeft[i]
            this.leftHeroAnim[i] = cc.instantiate(this.animPrefab)
            this.leftHeroAnim[i].setPosition(cc.v2(data.x,data.y))
            this.board.addChild(this.leftHeroAnim[i])
            //初始化右边阵容动画
            data = HeroListRight[i]
            this.rightHeroAnim[i] = cc.instantiate(this.animPrefab)
            this.rightHeroAnim[i].setPosition(cc.v2(-data.x,data.y))
            this.board.addChild(this.rightHeroAnim[i])
            this.rightHeroAnim[i].scaleX = -1
        }
        this.loadAnim()
    },
    loadAnim: function() {
        var data 
        if(this.loadIndex >= 5 && this.loadIndex <= 9)
            data = HeroListRight[this.loadIndex - 5]
        else if(this.loadIndex < 5)
            data = HeroListLeft[this.loadIndex]
        else
            return
        //载入动画
        var loadAnimCallback = function(err, res) {
            this.spineArray[this.loadIndex] = res
            //初始默认动作
            if(this.loadIndex < 5)
            {
                this.leftHeroAnim[this.loadIndex].getComponent(sp.Skeleton).skeletonData = res
                this.leftHeroAnim[this.loadIndex].getComponent(sp.Skeleton).animation = "Idle"
            }else{
                this.rightHeroAnim[this.loadIndex - 5].getComponent(sp.Skeleton).skeletonData = res
                this.rightHeroAnim[this.loadIndex - 5].getComponent(sp.Skeleton).animation = "Idle"
            }
            //载入动画
            this.loadIndex = this.loadIndex + 1
            this.loadAnim()
        }.bind(this)
        cc.loader.loadRes("spine/" + data.spine, sp.SkeletonData, loadAnimCallback)
    },
    onLoad: function () {
        //初始化数据
        this.initGameData()
        //初始化展示
        this.initGameShow()
        //开始游戏
        this.startGame()
    },
});
