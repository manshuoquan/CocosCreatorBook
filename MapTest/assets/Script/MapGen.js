var GlobalHandle = require('Global');
cc.Class({
    extends: cc.Component,

    properties: {
        _width:  96,
        _height: 64,
        mapLayer:{
            default: null,
            type: cc.Node
        },
    },

    calculateRoomSize(size, cell) 
    {
        var max = Math.floor((size/cell) * 0.8);
        var min = Math.floor((size/cell) * 0.25);
        if (min < 2) 
        {  
            min = 2; 
        }
        if (max < 2) 
        { 
            max = 2; 
        }
        return [min, max];
    },

    fillMap(value) {
        var map = [];
        for (var i = 0;i < this._width;i ++){
            map.push([]);
            for (var j = 0;j < this._height;j ++) 
            { 
                map[i].push(value); 
            }
        }
        return map;
    },

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    //绘制走廊，设置map值
    drawCorridor(startPosition, endPosition) {
        var xOffset = endPosition[0] - startPosition[0];
        var yOffset = endPosition[1] - startPosition[1];

        var xpos = startPosition[0];
        var ypos = startPosition[1];

        var tempDist;
        var xDir;
        var yDir;

        var move; 
        var moves = []; 

        var xAbs = Math.abs(xOffset);
        var yAbs = Math.abs(yOffset);

        var percent = Math.random(); 
        var firstHalf = percent;
        var secondHalf = 1 - percent;

        xDir = xOffset > 0 ? 2 : 6;
        yDir = yOffset > 0 ? 4 : 0;

        if (xAbs < yAbs) {
            tempDist = Math.ceil(yAbs * firstHalf);
            moves.push([yDir, tempDist]);
            moves.push([xDir, xAbs]);
            tempDist = Math.floor(yAbs * secondHalf);
            moves.push([yDir, tempDist]);
        } else {
            tempDist = Math.ceil(xAbs * firstHalf);
            moves.push([xDir, tempDist]);
            moves.push([yDir, yAbs]);
            tempDist = Math.floor(xAbs * secondHalf);
            moves.push([xDir, tempDist]);
        }

        this.map[xpos][ypos] = 2;

        while (moves.length > 0) {
            move = moves.pop();
            while (move[1] > 0) {
                xpos += GlobalHandle.DIRS[8][move[0]][0];
                ypos += GlobalHandle.DIRS[8][move[0]][1];
                this.map[xpos][ypos] = 2;
                move[1] = move[1] - 1;
            }
        }
    },
    //获得墙的位置
    getWallPosition(aRoom, aDirection) {
        var rx;
        var ry;
        var door;

        if (aDirection == 1 || aDirection == 3) {
            rx = GlobalHandle.getRandomInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
            if (aDirection == 1) {
                ry = aRoom["y"] - 2;
                door = ry + 1;
            } else {
                ry = aRoom["y"] + aRoom["height"] + 1;
                door = ry -1;
            }

            this.map[rx][door] = 3; 
        } else if (aDirection == 2 || aDirection == 4) {
            ry = GlobalHandle.getRandomInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
            if(aDirection == 2) {
                rx = aRoom["x"] + aRoom["width"] + 1;
                door = rx - 1;
            } else {
                rx = aRoom["x"] - 2;
                door = rx + 1;
            }

            this.map[door][ry] = 3; 
        }
        return [rx, ry];
    },

    createCorridors() {
    //创建走廊
        var cw = this._options.cellWidth;
        var ch = this._options.cellHeight;
        var room;
        var connection;
        var otherRoom;
        var wall;
        var otherWall;

        for (var i = 0; i < cw; i++) {
            for (var j = 0; j < ch; j++) {
                room = this.rooms[i][j];

                for (var k = 0; k < room["connections"].length; k++) {
                    connection = room["connections"][k];

                    otherRoom = this.rooms[connection[0]][connection[1]];
                    //获得墙体数量
                    if (otherRoom["cellx"] > room["cellx"]) {
                        wall = 2;
                        otherWall = 4;
                    } else if (otherRoom["cellx"] < room["cellx"]) {
                        wall = 4;
                        otherWall = 2;
                    } else if(otherRoom["celly"] > room["celly"]) {
                       wall = 3;
                       otherWall = 1;
                    } else if(otherRoom["celly"] < room["celly"]) {
                       wall = 1;
                       otherWall = 3;
                    }
                    this.drawCorridor(this.getWallPosition(room, wall), this.getWallPosition(otherRoom, otherWall));
                }
            }
        }
    },
    
    //创建房间
    createRooms() {
        var w = this._width;
        var h = this._height;

        var cw = this._options.cellWidth;
        var ch = this._options.cellHeight;

        var cwp = Math.floor(this._width / cw);
        var chp = Math.floor(this._height / ch);
        //房间属性
        var roomw;
        var roomh;
        var roomWidth = this._options["roomWidth"];
        var roomHeight = this._options["roomHeight"];
        var sx;
        var sy;
        var otherRoom;

        for (var i = 0; i < cw; i++) {
            for (var j = 0; j < ch; j++) {
                sx = cwp * i;
                sy = chp * j;

                if (sx == 0) 
                { 
                    sx = 1; 
                }
                if (sy == 0) 
                { 
                    sy = 1; 
                }
                
                //房间宽高，随机获得
                roomw = GlobalHandle.getRandomInt(roomWidth[0], roomWidth[1]);
                roomh = GlobalHandle.getRandomInt(roomHeight[0], roomHeight[1]);

                if (j > 0) {
                    otherRoom = this.rooms[i][j-1];
                    while (sy - (otherRoom["y"] + otherRoom["height"] ) < 3) {
                        sy++;
                    }
                }

                if (i > 0) {
                    otherRoom = this.rooms[i-1][j];
                    while(sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
                        sx++;
                    }
                }

                var sxOffset = Math.round(GlobalHandle.getRandomInt(0, cwp - roomw)/2);
                var syOffset = Math.round(GlobalHandle.getRandomInt(0, chp - roomh)/2);

                while (sx + sxOffset + roomw >= w) {
                    if(sxOffset) {
                        sxOffset--;
                    } else {
                        roomw--;
                    }
                }

                while (sy + syOffset + roomh >= h) {
                    if(syOffset) {
                        syOffset--;
                    } else {
                        roomh--;
                    }
                }

                sx = sx + sxOffset;
                sy = sy + syOffset;

                this.rooms[i][j]["x"] = sx;
                this.rooms[i][j]["y"] = sy;
                this.rooms[i][j]["width"] = roomw;
                this.rooms[i][j]["height"] = roomh;

                //设置地图
                for (var ii = sx; ii < sx + roomw; ii++) {
                    for (var jj = sy; jj < sy + roomh; jj++) {
                        this.map[ii][jj] = 1;
                    }
                }
            }
        }
    },


    connectUnconnectedRooms() {
        //连接未连接的房间

        var cw = this._options.cellWidth;
        var ch = this._options.cellHeight;

        this.connectedCells = GlobalHandle.randomize(this.connectedCells);
        var room;
        var otherRoom;
        var validRoom;

        for (var i = 0; i < this._options.cellWidth; i++) {
            for (var j = 0; j < this._options.cellHeight; j++)  {

                room = this.rooms[i][j];

                if (room["connections"].length == 0) {
                    var directions = [0, 2, 4, 6];
                    directions = GlobalHandle.randomize(directions);

                    validRoom = false;

                    do {

                        var dirIdx = directions.pop();
                        var newI = i + GlobalHandle.DIRS[8][dirIdx][0];
                        var newJ = j + GlobalHandle.DIRS[8][dirIdx][1];

                        if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) 
                        { 
                            continue; 
                        }

                        otherRoom = this.rooms[newI][newJ];

                        validRoom = true;

                        if (otherRoom["connections"].length == 0) 
                        { 
                            break; 
                        }

                        for (var k = 0; k < otherRoom["connections"].length; k++) {
                            if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                                validRoom = false;
                                break;
                            }
                        }

                        if (validRoom) 
                        { 
                            break; 
                        }

                    } while (directions.length);

                    if (validRoom) {
                        room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
                    }
                }
            }
        }
    },

    connectRooms() {
        //随机选择点
        var cgx = GlobalHandle.getRandomInt(0, this._options.cellWidth-1);
        var cgy = GlobalHandle.getRandomInt(0, this._options.cellHeight-1);

        var idx;
        var ncgx;
        var ncgy;

        var found = false;
        var room;
        var otherRoom;

        //找到未连接的相邻单元
        do {
            var dirToCheck = [0, 2, 4, 6];
            dirToCheck = GlobalHandle.randomize(dirToCheck);

            do {
                found = false;
                idx = dirToCheck.pop();

                ncgx = cgx + GlobalHandle.DIRS[8][idx][0];
                ncgy = cgy + GlobalHandle.DIRS[8][idx][1];

                if (ncgx < 0 || ncgx >= this._options.cellWidth)
                { 
                    continue; 
                }
                if (ncgy < 0 || ncgy >= this._options.cellHeight) 
                { 
                    continue; 
                }

                room = this.rooms[cgx][cgy];

                //房间连接
                if (room["connections"].length > 0) {
                    if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
                        break;
                    }
                }

                otherRoom = this.rooms[ncgx][ncgy];

                if (otherRoom["connections"].length == 0) {
                    otherRoom["connections"].push([cgx, cgy]);

                    this.connectedCells.push([ncgx, ncgy]);
                    cgx = ncgx;
                    cgy = ncgy;
                    found = true;
                }

            } while (dirToCheck.length > 0 && found == false);

        } while (dirToCheck.length > 0);

    },
    //设置map数值，初始化为一个值
    fillMap(value) {
        var map = [];
        for (var i = 0;i < this._width;i ++){
            map.push([]);
            for (var j = 0;j < this._height;j ++) 
            { 
                map[i].push(value); 
            }
        }
        return map;
    },
    //初始化房间的数量
    initRooms() {
        for (var i = 0; i < this._options.cellWidth; i++) {
            this.rooms.push([]);
            for(var j = 0; j < this._options.cellHeight; j++) {
                this.rooms[i].push({"x":0, "y":0, "width":0, "height":0, "connections":[], "cellx":i, "celly":j});
            }
        }
    },
    //地图生成过程
    mapGenerate()
    {
        //初始化地图数据
        this.map = this.fillMap(0);
        this.rooms = [];         //房间
        this.connectedCells = [];//联通的房间
        //初始化房间
        this.initRooms()
        //连接房间
        this.connectRooms()
        this.connectUnconnectedRooms()
        //创建房间
        this.createRooms()
        //创建走廊
        this.createCorridors()
    },
    //计算房间数量范围
    calculateRoomSize(size, cell) 
    {
        var max = Math.floor((size/cell) * 0.8);
        var min = Math.floor((size/cell) * 0.25);
        if (min < 2) 
        {  
            min = 2; 
        }
        if (max < 2) 
        { 
            max = 2; 
        }
        return [min, max];
    },
    //初始化地图
    initMap()
    {
        //地图宽高的格子
        this._width = 96
        this._height = 63
        this._options = {
            cellWidth: 10, //单元格宽
            cellHeight: 10,//单元格高
            roomWidth: [2,6],//房间个数范围
            roomHeight: [2,4],//房间个数范围
        };
        if (!this._options.hasOwnProperty("roomWidth")) {
            this._options["roomWidth"] = this.calculateRoomSize(this._width, this._options["cellWidth"]);
        }
        if (!this._options.hasOwnProperty("roomHeight")) {
            this._options["roomHeight"] = this.calculateRoomSize(this._height, this._options["cellHeight"]);
        }
        console.log(this._options["roomWidth"])
        console.log(this._options["roomHeight"])
    },

    startGameMap()
    {
        //初始化
        this.initMap()
        //地图生成
        this.mapGenerate()
        //绘制地图
        this.drawMap()
    },

    onLoad() 
    {
    },
    //绘制
    drawMap()
    {
        for (var i = 0;i < this._width;i ++){
            for (var j = 0;j < this._height;j ++) 
            {
                //房间地图格
                if(this.map[i][j] == 1)
                {
                    var ctx = this.mapLayer.getComponent(cc.Graphics)
                    ctx.fillColor.fromHEX('#FF0000');
                    ctx.rect((i) * this._options.cellWidth,(j) * this._options.cellHeight,this._options.cellWidth,this._options.cellHeight)
                    ctx.fill()
                    ctx.stroke()
                }
                //门口地图格
                else if(this.map[i][j] == 2)
                {
                    var ctx = this.mapLayer.getComponent(cc.Graphics)
                    ctx.fillColor.fromHEX('#7B68EE');
                    ctx.rect((i) * this._options.cellWidth,(j) * this._options.cellHeight,this._options.cellWidth,this._options.cellHeight)
                    ctx.fill()
                }
                //走廊地图格
                else if(this.map[i][j] == 3)
                {
                    var ctx = this.mapLayer.getComponent(cc.Graphics)
                    ctx.fillColor.fromHEX('#00FF00');
                    ctx.rect((i) * this._options.cellWidth,(j) * this._options.cellHeight,this._options.cellWidth,this._options.cellHeight)
                    ctx.fill()
                }
            }
        }
    },

    start () {

    },
});
