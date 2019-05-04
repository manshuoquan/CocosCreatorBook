function Card(name,ctype,num) {
    //图片名
    this.name  = name
    //花色
    this.type = ctype
    //点数
    this.val   = num
}
//打印信息
Card.prototype.print = function(){
    console.log("card name->" + this.name + " type->" + this.ctype + " val->" + this.val)
}

module.exports = Card;