var Global = require('Global');
var ICON_STATE_NORMAL = 1
var ICON_STATE_MOVE   = 2
var ICON_STATE_PRECANCEL = 3
var ICON_STATE_PRECANCEL2 = 4
var ICON_STATE_CANCEL = 5
var ICON_STATE_CANCELED = 6
cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        soundNode: {
            default: null,
            type: cc.Node
        },
        board: {
            default: null,
            type: cc.Node
        },
        scoreLabel: {
            default: null,
            type: cc.Label
        },
        iconPrefab: {
            default: null,
            type: cc.Prefab
        },
    },
    setIconAnimObj:function(obj,name){
        obj.play(name)
    },
    setIconNormalAnim:function(i,j){
        this.setIconAnimObj(this.iconsAnimTable[i][j],"normal0" + this.iconsDataTable[i][j].iconType)
    },
    setIconCancelAnimObj:function(data){
        this.setIconAnimObj(data.obj,"cancel0" + data.iconType)
    },
    setIconNormalAnimObj:function(data){
        this.setIconAnimObj(data.obj,"normal0" + data.iconType)
    },
    setIconState:function(i,j,state){
        if(this.iconsDataTable[i][j].state != state)
        {
            if((this.iconsDataTable[i][j].state == ICON_STATE_PRECANCEL2) && (state == ICON_STATE_NORMAL || state == ICON_STATE_PRECANCEL))
            {
                return
            }
            this.iconsDataTable[i][j].state = state
            var callBack = function()
            {
                this.iconsDataTable[i][j].obj.targetOff(this)
                //this.iconsDataTable[i][j].obj.active = false
                this.setIconState(i,j,ICON_STATE_CANCELED)

                this.cancelNum = this.cancelNum - 1
                //cc.log("this.cancelNum->" + this.cancelNum)
                if(this.cancelNum == 0)
                {
                    this.handelMessage("produce")
                }
            }
            if(state == ICON_STATE_CANCEL)
            {
                this.iconsDataTable[i][j].obj.on('finished',callBack,this)
                this.setIconCancelAnimObj(this.iconsDataTable[i][j])
            }
        }
    },
    initGameData:function(){
        this.row = 9 //小方块行数
        this.col = 11//小方块列数
        this.typeNum = 6//方块数量
        this.isControl = false  //是否控制着小方块
        this.chooseIconPos = cc.p(-1,-1) //控制小方块的位置
        this.deltaPos = cc.p(0,0) //相差坐标
        this.score = 0
        this.iconsDataTable = []
        for(var i = 1;i < this.row;i ++)
        {
            this.iconsDataTable[i] = []
            for(var j = 1;j < this.col;j ++)
            {
                this.iconsDataTable[i][j] = {"state":ICON_STATE_NORMAL,"iconType":1,"obj":null}
                this.iconsDataTable[i][j].iconType = this.getNewIconType(i,j)
            }
        }
    },
    getNewIconType:function(i,j){
        var exTypeTable = [-1,-1]
        if(i > 1)
        {
            exTypeTable[1] = this.iconsDataTable[i - 1][j].iconType
        }
        if(j > 1)
        {
            exTypeTable[2] = this.iconsDataTable[i][j - 1].iconType
        }
        var typeTable = []
        var max = 0
        for(var i = 1;i < this.typeNum;i ++)
        {
            if(i != exTypeTable[1] && i != exTypeTable[2])
            {
                max = max + 1
                typeTable[max] = i
            }
        }
        return typeTable[Global.getRandomInt(1,max)]
    },
    initGameBoard:function(){
        this.iconsTable = []
        this.iconsAnimTable = []
        this.iconsPosTable = []
        var row = this.row
        var col = this.col
        var i,j
        //初始化棋盘
        for(i = 1;i < row;i ++)
        {
            this.iconsTable[i] = []
            this.iconsPosTable[i] = []
            this.iconsAnimTable[i] = []
            for(j = 1;j < col;j ++)
            {
                var item = cc.instantiate(this.iconPrefab)
                this.iconsTable[i][j] = item
                this.iconsAnimTable[i][j] = item.getComponent(cc.Animation)
                this.board.addChild(item)
                var x = -320 + 71 * i
                var y = -360 + 71 * j
                //设置坐标
                this.iconsPosTable[i][j] = cc.p(x,y)
                item.setPosition(x,y)
            }
        }
        //初始化状态
        for(i = 1;i < row;i ++)
        {
            for(j = 1;j < col;j ++)
            {
                this.iconsDataTable[i][j].obj = this.iconsAnimTable[i][j]
                this.setIconNormalAnim(i,j)
            }
        }
    },
    checkCancelH:function(col){
        var cancelNum = 1
        var iconType = this.iconsDataTable[1][col].iconType
        var isCancel = false
        this.setIconState(1,col,ICON_STATE_PRECANCEL)
        for(var i = 2;i < this.row;i ++)
        {
            if(iconType == this.iconsDataTable[i][col].iconType)
            {
                cancelNum = cancelNum + 1
                this.setIconState(i,col,ICON_STATE_PRECANCEL)
                if(cancelNum >= 3)
                {
                    isCancel = true
                    if(cancelNum == 3)
                    {
                        this.score = this.score + 30
                    }
                    else if(cancelNum == 4)
                    {
                        this.score = this.score + 60
                    }
                    else if(cancelNum >= 5)
                    {
                        this.score = this.score + 100
                    }
                }
            }else
            {
                if(cancelNum < 3)
                {
                    for(var k = (i - 1);k > 0;k --)
                    {
                        if(iconType == this.iconsDataTable[k][col].iconType)
                        {
                            this.setIconState(k,col,ICON_STATE_NORMAL)
                        }else{
                            break
                        }
                    }
                }
                if(i < (this.row - 2))
                {
                    cancelNum = 1
                    iconType = this.iconsDataTable[i][col].iconType
                    this.setIconState(i,col,ICON_STATE_PRECANCEL)
                }else{
                    break
                }
            }
        }
        return isCancel
    },
    checkCancelV:function(row){
        var cancelNum = 1
        var iconType = this.iconsDataTable[row][1].iconType
        var isCancel = false
        this.setIconState(row,1,ICON_STATE_PRECANCEL)
        for(var i = 2;i < this.col;i ++)
        {
            if(iconType == this.iconsDataTable[row][i].iconType)
            {
                cancelNum = cancelNum + 1
                this.setIconState(row,i,ICON_STATE_PRECANCEL)
                if(cancelNum >= 3)
                {
                    isCancel = true
                }
                if(cancelNum == 3)
                {
                    this.score = this.score + 30
                }
                else if(cancelNum == 4)
                {
                    this.score = this.score + 60
                }
                else if(cancelNum >= 5)
                {
                    this.score = this.score + 100
                }
            }else
            {
                if(cancelNum < 3)
                {
                    for(var k = (i - 1);k > 0;k --)
                    {
                        if(iconType == this.iconsDataTable[row][k].iconType)
                        {
                            this.setIconState(row,k,ICON_STATE_NORMAL)
                        }else{
                            break
                        }
                    }
                }
                if(i < (this.col - 2))
                {
                    cancelNum = 1
                    iconType = this.iconsDataTable[row][i].iconType
                    this.setIconState(row,i,ICON_STATE_PRECANCEL)
                }else{
                    break
                }
            }
        }
        return isCancel
    },
    exchangeIcon:function(anchor){
        var oneIcon = this.iconsDataTable[this.chooseIconPos.x][this.chooseIconPos.y]
        var anotherIcon
        if(anchor == 1)
        {
            anotherIcon = this.iconsDataTable[this.chooseIconPos.x - 1][this.chooseIconPos.y]
        }else if(anchor == 2){
            anotherIcon = this.iconsDataTable[this.chooseIconPos.x][this.chooseIconPos.y + 1]
        }else if(anchor == 3){
            anotherIcon = this.iconsDataTable[this.chooseIconPos.x + 1][this.chooseIconPos.y]
        }else if(anchor == 4){
            anotherIcon = this.iconsDataTable[this.chooseIconPos.x][this.chooseIconPos.y - 1]
        }
        var typeVal = oneIcon.iconType
        oneIcon.iconType = anotherIcon.iconType
        anotherIcon.iconType = typeVal
        this.setIconNormalAnimObj(oneIcon)
        this.setIconNormalAnimObj(anotherIcon)
        var isCancel = [false,false,false]
        //根据不同的方向交换物块
        if(anchor == 1)
        {
            isCancel[1] = this.checkCancelH(this.chooseIconPos.y)
            this.setCancelEnsure()
            isCancel[2] = this.checkCancelV(this.chooseIconPos.x)
            this.setCancelEnsure()
            isCancel[3] = this.checkCancelV(this.chooseIconPos.x - 1)
        }else if(anchor == 2){
            isCancel[1] = this.checkCancelH(this.chooseIconPos.y)
            this.setCancelEnsure()
            isCancel[2] = this.checkCancelH(this.chooseIconPos.y + 1)
            this.setCancelEnsure()
            isCancel[3] = this.checkCancelV(this.chooseIconPos.x)
        }else if(anchor == 3){
            isCancel[1] = this.checkCancelH(this.chooseIconPos.y)
            this.setCancelEnsure()
            isCancel[2] = this.checkCancelV(this.chooseIconPos.x)
            this.setCancelEnsure()
            isCancel[3] = this.checkCancelV(this.chooseIconPos.x + 1)
        }else if(anchor == 4){
            isCancel[1] = this.checkCancelH(this.chooseIconPos.y)
            this.setCancelEnsure()
            isCancel[2] = this.checkCancelH(this.chooseIconPos.y - 1)
            this.setCancelEnsure()
            isCancel[3] = this.checkCancelV(this.chooseIconPos.x)
        }
        this.setCancelEnsure()
        return (isCancel[1] || isCancel[2] || isCancel[3])
    },
    exchangeBack:function(anchor){
        var oneIconData = this.iconsDataTable[this.chooseIconPos.x][this.chooseIconPos.y]
        var oneIconItem = this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y]
        var anotherIconData
        var anotherIconItem
        if(anchor == 1)
        {
            anotherIconData = this.iconsDataTable[this.chooseIconPos.x - 1][this.chooseIconPos.y]
            anotherIconItem = this.iconsTable[this.chooseIconPos.x - 1][this.chooseIconPos.y]
        }else if(anchor == 2){
            anotherIconData = this.iconsDataTable[this.chooseIconPos.x][this.chooseIconPos.y + 1]
            anotherIconItem = this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y + 1]
        }else if(anchor == 3){
            anotherIconData = this.iconsDataTable[this.chooseIconPos.x + 1][this.chooseIconPos.y]
            anotherIconItem = this.iconsTable[this.chooseIconPos.x + 1][this.chooseIconPos.y]
        }else if(anchor == 4){
            anotherIconData = this.iconsDataTable[this.chooseIconPos.x][this.chooseIconPos.y - 1]
            anotherIconItem = this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y - 1]
        }
        var pos1 = oneIconItem.getPosition()
        var pos2 = anotherIconItem.getPosition()
        var finished = cc.callFunc(function(target) {
            var typeVal = oneIconData.iconType
            oneIconData.iconType = anotherIconData.iconType
            anotherIconData.iconType = typeVal
            this.setIconNormalAnimObj(oneIconData)
            this.setIconNormalAnimObj(anotherIconData)
            oneIconItem.setPosition(pos1)
            anotherIconItem.setPosition(pos2)
        }, this)
        oneIconItem.runAction(cc.sequence(cc.moveTo(0.5, pos2.x, pos2.y),finished))
        anotherIconItem.runAction(cc.moveTo(0.5, pos1.x, pos1.y))
    },
    setCancelEnsure:function(){
        for(var i = 1;i < this.row;i ++)
        {
            for(var j = 1;j < this.col;j ++)
            {
                if(this.iconsDataTable[i][j].state == ICON_STATE_PRECANCEL)
                {
                    this.setIconState(i,j,ICON_STATE_PRECANCEL2)
                }
            }
        }
    },
    refreshScoreLabel: function(){
        this.scoreLabel.string = "" + this.score
    },
    handelMessage: function(message,data){
        //交换
        if(message == "exchange")
        {
            if(this.exchangeIcon(data.anchor))
            {
                this.handelMessage("cancel")
            }
            else
            {
                this.exchangeBack(data.anchor)
            }
        }
        //检测
        else if(message == "check")
        {
            var isCancelV = false
            var isCancelH = false
            for(var i = 1;i < this.row;i ++)
            {
                var isCancel = this.checkCancelV(i)
                if(isCancel)
                    isCancelV = true
            }
            if(isCancelV)
                this.setCancelEnsure()
            for(var j = 1;j < this.col;j ++)
            {
                var isCancel = this.checkCancelH(j)
                if(isCancel)
                    isCancelH = true
            }
            if(isCancelH)
                this.setCancelEnsure()
            if(isCancelV || isCancelH)
                this.handelMessage("cancel")
        }
        //消除
        else if(message == "cancel")
        {
            this.cancelNum = 0
            for(var i = 1;i < this.row;i ++)
            {
                for(var j = 1;j < this.col;j ++)
                {
                    if(this.iconsDataTable[i][j].state == ICON_STATE_PRECANCEL2)
                    {
                        this.soundNode.getComponent("SoundControl").playExp()
                        this.score = this.score + 10
                        this.cancelNum = this.cancelNum + 1
                        this.setIconState(i,j,ICON_STATE_CANCEL)
                    }
                }
            }
        }
        //重新生成
        else if(message == "produce")
        {
            this.refreshScoreLabel()
            this.moveNum = 0
            for(var i = 1;i < this.row;i ++)
            {
                for(var j = 1;j < this.col;j ++)
                {
                    if(this.iconsDataTable[i][j].state == ICON_STATE_CANCELED)
                    {
                        this.moveNum = this.moveNum + 1
                        this.setIconState(i,j,ICON_STATE_MOVE)
                        this.iconsDataTable[i][j].moveNum = 0
                        var isFind = false
                        if(j != this.col)
                        {
                            for(var k = (j + 1);k < this.col;k ++)
                            {
                                this.iconsDataTable[i][j].moveNum = this.iconsDataTable[i][j].moveNum + 1
                                if(this.iconsDataTable[i][k].state != ICON_STATE_CANCELED)
                                {
                                    this.iconsDataTable[i][k].state = ICON_STATE_CANCELED
                                    isFind = true
                                    this.iconsDataTable[i][j].iconType = this.iconsDataTable[i][k].iconType
                                    break
                                }
                            }
                        }
                        if(! isFind)
                        {
                            this.iconsDataTable[i][j].iconType = this.getNewIconType(i,j)
                        }
                    }
                }
            }
            this.handelMessage("move")
        }
        else if(message == "move")
        {
            var finished = cc.callFunc(function(target) {
                this.moveNum = this.moveNum - 1
                if(this.moveNum == 0)
                {
                     this.handelMessage("check")
                }
            }, this)
            for(var i = 1;i < this.row;i ++)
            {
                for(var j = 1;j < this.col;j ++)
                {
                    if(this.iconsDataTable[i][j].state == ICON_STATE_MOVE)
                    {   
                        this.soundNode.getComponent("SoundControl").playDrop()
                        this.setIconNormalAnimObj(this.iconsDataTable[i][j])
                        var pos = this.iconsTable[i][j].getPosition()
                        var num = this.iconsDataTable[i][j].moveNum
                        this.iconsTable[i][j].setPosition(this.iconsTable[i][j + num].getPosition())
                        this.iconsTable[i][j].runAction(cc.sequence(cc.moveTo(0.1 * num, pos.x, pos.y),finished))
                    }
                }
            }
        }
    },
    onmTouchBagan:function (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();   
        for(var i = 1;i < this.row;i ++)
        {
            for(var j = 1;j < this.col;j ++)
            {
                if(this.iconsTable[i][j].getBoundingBoxToWorld().contains(touchLoc))
                {
                    this.isControl = true
                    this.chooseIconPos.x = i
                    this.chooseIconPos.y = j
                    this.deltaPos.x = this.iconsTable[i][j].getPosition().x - touchLoc.x
                    this.deltaPos.y = this.iconsTable[i][j].getPosition().y - touchLoc.y
                    this.iconsTable[i][j].zIndex = 1
                    break
                }
            }
        }
    },
    onmTouchMove:function (event) {
        if(this.isControl){
            var touches = event.getTouches()
            var touchLoc = touches[0].getLocation()
            var startTouchLoc = touches[0].getStartLocation()
            var deltaX = touchLoc.x - startTouchLoc.x
            var deltaY = touchLoc.y - startTouchLoc.y
            var deltaX2 = deltaX * deltaX
            var deltaY2 = deltaY * deltaY
            var deltaDistance = deltaX2 + deltaY2
            var anchor = 1
            //获得点击方向
            if(deltaX2 > deltaY2)
            {
                if(deltaX < 0)
                {
                    anchor = 1
                }else{
                    anchor = 3
                }
            }else{
                if(deltaY > 0)
                {
                    anchor = 2
                }else{
                    anchor = 4
                }
            }
            //判断拖动区域是否出界
            if(this.chooseIconPos.x == 1 && anchor == 1)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return 
            }else if(this.chooseIconPos.x == this.row && anchor == 3)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return
            }else if(this.chooseIconPos.y == this.col && anchor == 2)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return
            }else if(this.chooseIconPos.y == 1 && anchor == 4)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                return
            }
            //点击到物块自动判断是否可以消除
            if(deltaDistance > 4900)
            {
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
                this.isControl = false
                this.handelMessage("exchange",{"pos":touchLoc,"anchor":anchor})
            //移动物块
            }else{
                this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(cc.p(touchLoc.x + this.deltaPos.x,touchLoc.y + this.deltaPos.y))
            }
        }
    },
    onmTouchEnd:function (event) {
        if(this.isControl){
            var touches = event.getTouches()
            var touchLoc = touches[0].getLocation()
            var startTouchLoc = touches[0].getStartLocation()
            var deltaX = touchLoc.x - startTouchLoc.x
            var deltaY = touchLoc.y - startTouchLoc.y
            var deltaX2 = deltaX * deltaX
            var deltaY2 = deltaY * deltaY
            var deltaDistance = deltaX2 + deltaY2
            var anchor = 1
            if(deltaX2 > deltaY2)
            {
                if(deltaX < 0)
                {
                    anchor = 1
                }else{
                    anchor = 3
                }
            }else{
                if(deltaY > 0)
                {
                    anchor = 2
                }else{
                    anchor = 4
                }
            }
            this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].setPosition(this.iconsPosTable[this.chooseIconPos.x][this.chooseIconPos.y])
            this.iconsTable[this.chooseIconPos.x][this.chooseIconPos.y].zIndex = 0
            this.isControl = false
            this.handelMessage("exchange",{"pos":touchLoc,"anchor":anchor})
        }
    },
    onLoad: function () {
        var self = this
        //初始数据
        this.initGameData()
        //初始物块
        this.initGameBoard()
        //点击事件
        this.canvas.on(cc.Node.EventType.TOUCH_START,this.onmTouchBagan,this);
        this.canvas.on(cc.Node.EventType.TOUCH_MOVE,this.onmTouchMove,this);
        this.canvas.on(cc.Node.EventType.TOUCH_END,this.onmTouchEnd,this);
    },
    start:function() {
    },
});