function Player(index,array) {
    //是否是地主
    this.isLandlord = false
    //玩家编号
    this.pIndex = index
    //是否是AI玩家
    this.isAI = true
    //牌组
    this.cardList = array
    //下一家
    this.nextPlayer = null
    //分数
    this.score = 0
    //牌数
    this.cardNum = 17
    //是否结束
    this.isEnd = false
}

Player.prototype.follow = function(score){
	this.score = score
}

module.exports = Player;