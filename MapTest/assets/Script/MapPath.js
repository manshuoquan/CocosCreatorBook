var Grid = require('Grid')
var GlobalHandle = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        mapLayer:{
            default: null,
            type: cc.Node
        },
    },

    //估值函数
    heuristic(node){
        node.h = Math.abs(this.endGrid.x - node.x) + Math.abs(this.endGrid.y - node.y)
        return node.h
    },

    //放入open列表
    addOpenList(node){
        node.opened = true
        this.openList.push(node)
    },

    //删除open列表
    popOpenList(){
        var node = this.openList.pop()
        //node.opened = false
        return node
    },

    //放入close
    addClosed(node){
        node.closed = true
        this.closeList.push(node)
    },

    //删除close
    removeClosed(node){
        node.closed = false
    },

    jumpSearch(x, y, px, py){
        var grid = this.grid,
        dx = x - px, dy = y - py;
        
        //相邻点是否可行
        if (!this.grid.isWalkableAt(x, y)) {
            return null;
        }

        //已经被检测过了
        this.grid.getNodeAt(x, y).tested = true;

        //到达终点
        if (x == this.endGrid.x && y == this.endGrid.y){
            return [x, y];
        }
        //递归“前进”
        if (dx !== 0 && dy !== 0) {
            if (this.jumpSearch(x + dx, y, x, y) || this.jumpSearch(x, y + dy, x, y)) {
                return [x, y];
            }
        }else {
            //左右方向扫描
            if (dx !== 0) {
                if ((this.grid.isWalkableAt(x, y - 1) && !this.grid.isWalkableAt(x - dx, y - 1)) ||
                    (this.grid.isWalkableAt(x, y + 1) && !this.grid.isWalkableAt(x - dx, y + 1))) {
                    return [x, y];
                }
            }
            //上下方向扫描
            else if (dy !== 0) {
                if ((this.grid.isWalkableAt(x - 1, y) && !this.grid.isWalkableAt(x - 1, y - dy)) ||
                    (this.grid.isWalkableAt(x + 1, y) && !this.grid.isWalkableAt(x + 1, y - dy))) {
                    return [x, y];
                }
            }
        }
        //斜向继续递归前进
        if (this.grid.isWalkableAt(x + dx, y) && this.grid.isWalkableAt(x, y + dy)) {
            return this.jumpSearch(x + dx, y + dy, x, y);
        } else {
            return null;
        }
    },

    astarJumpSearch(){
        var endX = this.endGrid.x
        var endY = this.endGrid.y
        while (this.openList.length != 0){
            var node = this.popOpenList()
            this.addClosed(this.grid.getNodeAt(node.x,node.y))
            
            if (node.x == this.endGrid.x && node.y == this.endGrid.y){
                this.getPath(node)
                return    
            }
            var neighbors = this.grid.getNeighbors(node,4)
            //遍历邻居节点
            for (var i = 0, l = neighbors.length; i < l; ++i) {
                var neighbor = neighbors[i];

                if(neighbor.closed){
                    continue;
                }
                //跳点搜索
                var jumpPoint = this.jumpSearch(neighbor.x, neighbor.y, node.x, node.y);
                if (jumpPoint) {

                    var jx = jumpPoint[0];
                    var jy = jumpPoint[1];
                    var jumpNode = this.grid.getNodeAt(jx, jy);

                    if (jumpNode.closed) {
                        continue;
                    }

                    var  d = GlobalHandle.octile(Math.abs(jx - node.x), Math.abs(jy - node.y));
                    var ng = node.g + d;

                    if (!jumpNode.opened || ng < jumpNode.g) {
                        jumpNode.g = ng;
                        jumpNode.h = jumpNode.h || this.heuristic(jumpNode);
                        jumpNode.f = jumpNode.g + jumpNode.h;
                        jumpNode.parent = node;

                        if (!jumpNode.opened) {
                            this.addOpenList(jumpNode)
                        } else {
                            for(var j = 0; j < this.openList.length;j ++)
                            {
                                if(neighbor.x == this.openList[j].x && neighbor.y == this.openList[j].y)
                                {
                                    this.openList[j].g = neighbor.g
                                    this.openList[j].h = neighbor.h
                                    this.openList[j].f = neighbor.f
                                }
                            }
                        }
                        //排序
                        var compare = function (node1, node2){
                            if (node1.f < node1.f){
                                return 1;
                            }else if(node1.f > node1.f){
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                        this.openList.sort(compare)
                    }
                }
            }
        }
    },

    //获得路径
    getPath(node){
        this.path = []
        while(node.parent != null)
        {
            this.path.push(node.parent)
            node = node.parent
        }
    },

    astarSerch(){
        var endX = this.endGrid.x
        var endY = this.endGrid.y
        while (this.openList.length != 0){
            var node = this.popOpenList()
            this.addClosed(this.grid.getNodeAt(node.x,node.y))
            
            if (node.x == this.endGrid.x && node.y == this.endGrid.y){
                this.getPath(node)
                return    
            }
            var neighbors = this.grid.getNeighbors(node,4)
            //遍历邻居节点
            for (i = 0, l = neighbors.length; i < l; ++i) {
                var neighbor = neighbors[i];

                if(neighbor.closed){
                    continue;
                }

                var x = neighbor.x
                var y = neighbor.y

                var ng = node.g + ((x - node.x == 0 || y - node.y == 0) ? 1 : 1.414);
                if(!neighbor.opened || ng < neighbor.g) {
                    neighbor.g = ng
                    neighbor.h = neighbor.h || Math.abs(x - endX) + Math.abs(y - endY)
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.parent = node

                    if (!neighbor.opened) {
                        this.addOpenList(neighbor)
                    } else {
                        for(j = 0; j < this.openList.length;j ++)
                        {
                            if(neighbor.x == this.openList[j].x && neighbor.y == this.openList[j].y)
                            {
                                this.openList[j].g = neighbor.g
                                this.openList[j].h = neighbor.h
                                this.openList[j].f = neighbor.f
                            }
                        }
                    }
                    //排序
                    var compare = function (node1, node2){
                        if (node1.f < node1.f){
                            return 1;
                        }else if(node1.f > node1.f){
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                    this.openList.sort(compare)
                }
            }
        }
    },

    //初始化
    initAstarSearch(){
        this.grid = new Grid(this.mapObj._width,this.mapObj._height,this.mapObj.map)
        
        //起点终点
        this.startGrid = this.mapObj.rooms[0][0]
        var endX = this.mapObj._options.cellWidth - 2
        var endY = this.mapObj._options.cellHeight - 2
        this.endGrid = this.mapObj.rooms[endX][endY]

        this.openList = []
        this.closeList = []
        this.path = []
        this.startNode = this.grid.getNodeAt(this.startGrid.x,this.startGrid.y)
        this.endNode   = this.grid.getNodeAt(this.endGrid.x,this.endGrid.y)
        
        //加上起点
        this.heuristic(this.startNode)
        this.addOpenList(this.startNode)

        //console.log('this.startNode x->' + this.startNode.x + 'this.startNode y->' + this.startNode.y)
        //console.log('this.endNode x->' + this.endNode.x + 'this.endNode y->' + this.endNode.y)
    },

    drawPath(){
        var ctx = this.getComponent(cc.Graphics)

        for(var i = 0;i < this.path.length;i ++)
        {   
            var node = this.path[i]
            ctx.circle((node.x + 0.5) * this.mapObj._options.cellWidth,(node.y + 0.5) * this.mapObj._options.cellHeight,5)
            ctx.fill()
        }
        
        ctx.fillColor.fromHEX('#000000');
        ctx.circle((this.startGrid.x + 0.5) * this.mapObj._options.cellWidth,(this.startGrid.y + 0.5) * this.mapObj._options.cellHeight,5)
        ctx.fill()

        ctx.fillColor.fromHEX('#FFFFFF');
        ctx.circle((this.endGrid.x + 0.5) * this.mapObj._options.cellWidth,(this.endGrid.y + 0.5) * this.mapObj._options.cellHeight,5)
        ctx.fill()
    },

    onLoad(){
        this.mapObj = this.mapLayer.getComponent("MapGen")
        //生成地图
        this.mapObj.startGameMap()
        //初始化a星
        this.initAstarSearch()
        //A星搜索
        this.astarJumpSearch()
        //绘制路径
        this.drawPath()
    },

    start () {

    },
});
