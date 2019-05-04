var CardManager  = require('CardManager')
var CardRule     = require('CardRule')
var GlobalHandle = require('Global')
var Player       = require('Player')
var AILogic      = require('AILogic')
cc.Class({
    extends: cc.Component,

    properties: {
        tip1: {
            default: null,
            type: cc.Label
        },
        tip2: {
            default: null,
            type: cc.Label
        },
        tip3: {
            default: null,
            type: cc.Label
        },
        playerIconSp1: {
            default: null,        
            type: cc.Sprite, 
        },
        playerIconSp2: {
            default: null,        
            type: cc.Sprite, 
        },
        playerIconSp3: {
            default: null,        
            type: cc.Sprite, 
        },
        prepareBtn: {
            default: null,
            type: cc.Button
        },
        canvas:{
            default: null,
            type: cc.Node
        },
        playerCardLayer:{
            default: null,
            type: cc.Node
        },
        player1CardLayer:{
            default: null,
            type: cc.Node
        },
        player3CardLayer:{
            default: null,
            type: cc.Node
        },
        promptCardLayer:{
            default: null,
            type: cc.Node
        },
        qiangNode:{
            default: null,
            type: cc.Node
        },
        playNode:{
            default: null,
            type: cc.Node
        },
        cardPrefabs:{
            default: null,
            type: cc.Prefab
        },
        cardBackPrefabs:{
            default: null,
            type: cc.Prefab
        },
    },

    restartGame () {
        //按钮消失
        this.prepareBtn.node.setPosition(cc.v2(-1000,-1000))
        //洗牌
        this.cardManager.randomCard()

        //初始化玩家
        this.player1 = new Player(1,this.cardManager.array_player[0])
        this.player2 = new Player(2,this.cardManager.array_player[1])
        this.player3 = new Player(3,this.cardManager.array_player[2])

        //下家
        this.player1.nextPlayer = this.player2
        this.player2.nextPlayer = this.player3
        this.player3.nextPlayer = this.player1
        //是否AI
        this.player1.isAI = true
        this.player2.isAI = false
        this.player3.isAI = true
        //创建AI逻辑
        this.AILogic1 = new AILogic(this.player1)
        this.AILogic2 = new AILogic(this.player2)
        this.AILogic3 = new AILogic(this.player3)

        this.AILogic1.nextAIPlayer = this.AILogic2
        this.AILogic2.nextAIPlayer = this.AILogic3
        this.AILogic3.nextAIPlayer = this.AILogic1

        //显示牌
        this.curPlayerAI = this.AILogic1
        this.playerCardLayer.removeAllChildren()
        this.player1CardLayer.removeAllChildren()
        this.player3CardLayer.removeAllChildren()
        for(var i = 0;i < 17;i ++){
            this.playerCard[i] = cc.instantiate(this.cardPrefabs)
            this.playerCard[i].setPosition(cc.v2(70 + i * 20,60))
            this.playerCard[i].setScale(0.6)
            this.playerCard[i].getComponent("PlayerCardShow").setCanvas(this.canvas)
            cc.log("this.cardManager.array_player->" + this.cardManager.array_player[1][i].name)
            this.playerCard[i].getComponent("PlayerCardShow").setCardShow(this.cardManager.array_player[1][i].name)
            this.playerCard[i].getComponent("PlayerCardShow").setIndex(i)
            this.playerCard[i].getComponent("PlayerCardShow").setIsCanChick()
            this.playerCardLayer.addChild(this.playerCard[i])

            this.player1Card[i] = cc.instantiate(this.cardBackPrefabs)
            this.player1Card[i].setPosition(cc.v2(20,-20 + 5 *i))
            this.player1Card[i].setScale(0.3)
            this.player1CardLayer.addChild(this.player1Card[i])

            this.player3Card[i] = cc.instantiate(this.cardBackPrefabs)
            this.player3Card[i].setPosition(cc.v2(-20,-20 + 5 *i))
            this.player3Card[i].setScale(0.3)
            this.player3CardLayer.addChild(this.player3Card[i])
        }
        this.showCardforower()
        //开始抢地主
        this.snatchIndex = -1
        this.snatchRound = 1
        this.snatchScore = 0
        this.snatchLandlord()
    },

    showCardforower() {
        this.promptCardLayer.removeAllChildren()

        var cardNode = cc.instantiate(this.cardPrefabs)
        cardNode.setPosition(cc.v2(-50,0))
        cardNode.setScale(0.5)
        cardNode.getComponent("PlayerCardShow").setCardShow(this.cardManager.array_cardforower[0].name)
        this.promptCardLayer.addChild(cardNode)

        cardNode = cc.instantiate(this.cardPrefabs)
        cardNode.setPosition(cc.v2(0,0))
        cardNode.setScale(0.5)
        cardNode.getComponent("PlayerCardShow").setCardShow(this.cardManager.array_cardforower[1].name)
        this.promptCardLayer.addChild(cardNode)

        cardNode = cc.instantiate(this.cardPrefabs)
        cardNode.setPosition(cc.v2(50,0))
        cardNode.setScale(0.5)
        cardNode.getComponent("PlayerCardShow").setCardShow(this.cardManager.array_cardforower[2].name)
        this.promptCardLayer.addChild(cardNode)
    },

    endGame(){

    },

    //结束一个出牌轮次
    sumRound(){
        this.curPlayerAI.player.cardNum = this.curPlayerAI.player.cardNum - this.lastNum
        if(this.curPlayerAI.player.cardNum == 0)
        {
            this.curPlayerAI.player.isEnd = true
            //地主胜利
            if(this.curPlayerAI.player.isLandlord)
            {
                this.endGame()
            }
            //农民胜利
            else
            {
                this.framerNum --
                if(this.framerNum == 0)
                    this.cardRound()
            }
        }
    },

    cardRound(){
        if(this.curPlayerAI.player.isEnd)
        {
            this.curPlayerAI = this.curPlayerAI.nextAIPlayer
            this.cardRound()
        }
        else if(this.curPlayerAI.player.isAI)
        {
            //具体出牌逻辑
            //这里暂时省略...
        }
        else
        {
            this.playNode.setPosition(cc.v2(0,-100))
        }
    },

    nocard(){
        this.playNode.setPosition(cc.v2(0,-300))
    },
    
    endSnatch(){
        for(var i = 1;i <= 3;i ++)
        {
            this["tip" + i].string = "开始"
        }
        var self = this
        cc.loader.loadRes("pic/dizhnu8", cc.SpriteFrame, function (err, spriteFrame) {
            self["playerIconSp" + self.snatchIndex].getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
        this.promptCardLayer.removeAllChildren()
        //地主
        this.landlordAi = this.AILogic1
        switch(this.snatchIndex)
        {
            case 1:
                this.player1.cardList[17] = this.cardManager.array_cardforower[0]
                this.player1.cardList[18] = this.cardManager.array_cardforower[1]
                this.player1.cardList[19] = this.cardManager.array_cardforower[2]
                for(var i = 17;i < 20;i ++){
                    this.player1Card[i] = cc.instantiate(this.cardBackPrefabs)
                    this.player1Card[i].setPosition(cc.v2(20,-20 + 5 *i))
                    this.player1Card[i].setScale(0.3)
                    this.player1CardLayer.addChild(this.player1Card[i])
                }
                break;
            case 2:
                this.landlordAi = this.AILogic2
                this.player2.cardList[17] = this.cardManager.array_cardforower[0]
                this.player2.cardList[18] = this.cardManager.array_cardforower[1]
                this.player2.cardList[19] = this.cardManager.array_cardforower[2]
                for(var i = 17;i < 20;i ++){
                    this.playerCard[i] = cc.instantiate(this.cardPrefabs)
                    this.playerCard[i].setPosition(cc.v2(70 + i * 20,60))
                    this.playerCard[i].setScale(0.6)
                    this.playerCard[i].getComponent("PlayerCardShow").setCanvas(this.canvas)
                    this.playerCard[i].getComponent("PlayerCardShow").setCardShow(this.player2.cardList[i].name)
                    this.playerCard[i].getComponent("PlayerCardShow").setIndex(i)
                    this.playerCard[i].getComponent("PlayerCardShow").setIsCanChick()
                    this.playerCardLayer.addChild(this.playerCard[i])
                }
                break;
            case 3:
                this.landlordAi = this.AILogic3
                this.player3.cardList[17] = this.cardManager.array_cardforower[0]
                this.player3.cardList[18] = this.cardManager.array_cardforower[1]
                this.player3.cardList[19] = this.cardManager.array_cardforower[2]
                for(var i = 17;i < 20;i ++){
                    this.player3Card[i] = cc.instantiate(this.cardBackPrefabs)
                    this.player3Card[i].setPosition(cc.v2(-20,-20 + 5 *i))
                    this.player3Card[i].setScale(0.3)
                    this.player3CardLayer.addChild(this.player3Card[i])
                }
                break;
        }
        //上一次出牌的牌型
        this.lastCardType = -1
        //上一次最小牌
        this.lastMin = -1
        //上一次牌的数量
        this.lastNum = 0
        //开始出牌起始
        this.curPlayerAI = this.landlordAi
        this.curPlayerAI.player.isLandlord = true
        this.curPlayerAI.player.cardNum = 20
        //农民数量
        this.framerNum = 2
        this.cardRound()
    },
    //每轮结算
    sumLandlord(){
        this.snatchRound++
        if(this.snatchRound > 3)
        {
            if(this.snatchIndex != -1)
            {
                this.endSnatch()
            }
            else
            {
                cc.log("重新洗牌")
                this.restartGame() 
            }
        }else{
            if(this.snatchScore == 3)
            {
                this.endSnatch()
            }
            else
            {
                this.curPlayerAI = this.curPlayerAI.nextAIPlayer
                this.snatchLandlord()
            }
        }
    },
    //决定抢地主状态
    setSnatchState(ret){
        var retstr
        if(ret < 4 && ret > this.snatchScore)
        {
            retstr = "抢地主 " + ret + "分"
            this.snatchIndex = this.curPlayerAI.player.pIndex
            this.snatchScore = ret
        }
        else
        {
            retstr = "不抢"
        }
        this["tip" + this.snatchRound].string = retstr
        this.sumLandlord()
    },
    snatchLandlord(){
        if(this.curPlayerAI.player.isAI)
        {
            var ret = this.curPlayerAI.judgeScore()
            this.setSnatchState(ret)
        }
        else
        {
            this.qiangNode.setPosition(cc.v2(0,-100))
        }
    },

    nolandord(){
        this.qiangNode.setPosition(cc.v2(0,-300))
        this.setSnatchState(4)
    },

    landord1(){
        this.qiangNode.setPosition(cc.v2(0,-300))
        this.setSnatchState(1)
    },

    landord2(){
        this.qiangNode.setPosition(cc.v2(0,-300))
        this.setSnatchState(2)
    },

    landord3(){
        this.qiangNode.setPosition(cc.v2(0,-300))
        this.setSnatchState(3)
    },

    onLoad () {
        this.cardManager = new CardManager()
        this.index = 0 
        this.playerCard = new Array(20)
        this.player1Card = new Array(20)
        this.player3Card = new Array(20)
    },

    start () {

    },

    update (dt) {

    },
});