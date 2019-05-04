var Card = require('Card');
//定义构造
function CardManager() {
    console.log("CardManager")
}

CardManager.prototype.isInSet = function(num){
    for (var i = 0; i < 54; i ++)
    {
        if (this.randnumber[i] == num)
        {
            return false;
        }
    }
    return true;
}

CardManager.prototype.getCard = function(proNum){
    var num  = proNum % 4
    var num2 = Math.floor(proNum / 4)
    var fram,framtype
    cc.log("getCard->"+proNum)
    //方片
    if(num == 0)
    {
        if(num2 == 13)
        {
            framtype = "xiaowang"
            num2 = 16
        }
        else
        {
            if(num2 == 11)
                num2 = -2
            if(num2 == 12)
                num2 = -1
            framtype = "fang" + (num2 + 3)
        }
    }
    //黑桃
    else if(num == 1)
    {
        if(num2 == 13)
        {
            framtype = "dawang"
            num2 = 17
        }
        else
        {
            if(num2 == 11)
                num2 = -2
            if(num2 == 12)
                num2 = -1
            framtype = "hei" + (num2 + 3)
        }
    }
    //红桃
    else if(num == 2)
    {
        if(num2 == 11)
            num2 = -2
        if(num2 == 12)
            num2 = -1
        framtype = "hong" + (num2 + 3)
    }
    //草花
    else if(num == 3)
    {
        if(num2 == 11)
            num2 = -2
        if(num2 == 12)
            num2 = -1
        framtype = "hua" + (num2 + 3)
    }
    if(num2 == -2)
        num2 = 11
    if(num2 == -1)
        num2 = 12
    if(num2 <= 16)
        num2 = num2 + 3
    cc.log("framtype->"+framtype)
    return new Card(framtype,num,num2)
}

//洗牌发牌
CardManager.prototype.randomCard = function(){
    this.array_player = new Array(3)
    this.array_player[0] = new Array()
    this.array_player[1] = new Array()
    this.array_player[2] = new Array()
    this.array_cardforower = new Array()

    this.randnumber = new Array(54)
    var number = new Array(54)
    //洗牌
    for (var n = 0; n < 54; n++)
    {
        this.randnumber[n] = -1
    }
    for (var k = 0; k < 54; k++)
    {
        number[k] = k
    }
    
    //发牌
    var index = 0;
    while (index < 54)
    {
        var num = Math.floor(Math.random() * 54)
        if(this.isInSet(number[num]))
        {
            this.randnumber[index] = number[num]
            index ++;
        }
    }
    //保留的底牌
    for (var n = 51; n < 54; n++)
    {
        this.array_cardforower.push(this.getCard(this.randnumber[n]))
    }
    //三个玩家的牌
    var index = 0
    for (var i = 0; i < 3; i ++)
    {
        for (var j = 0; j < 17; j ++)
        {
            this.array_player[i].push(this.getCard(this.randnumber[index]))
            index = index + 1
        }
    }
    
    //排序
    var compare = function (card1, card2){
        if (card1.val < card2.val){
            return 1;
        }else if(card1.val > card2.val){
            return -1;
        } else {
            return 0;
        }
    }
    this.array_player[0].sort(compare)
    this.array_player[1].sort(compare)
    this.array_player[2].sort(compare)

    //打印信息
    for (var i = 0; i < 3; i ++)
    {
        for (var j = 0; j < 17; j ++)
        {
            this.array_player[i][j].print()
        }
    }
}

module.exports = CardManager;