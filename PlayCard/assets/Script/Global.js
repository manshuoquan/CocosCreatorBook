var MCardRule   = require('CardRule')
var cardRule = new MCardRule()
function getCardRule()
{
    return cardRule
}

function getRandomInt(min, max) 
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function cardSort(a, b){
    if(a.val === b.val){
        return a.type > b.type ? 1 : -1;
    } else if(a.val > b.val){
        return -1;
    } else {
        return 1;
    }
};

module.exports = {
    getRandomInt : getRandomInt,
    getCardRule  : getCardRule,
    cardSort     : cardSort
};