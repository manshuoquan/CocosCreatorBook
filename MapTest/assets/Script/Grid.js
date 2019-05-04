var Node = require('Node');
//通过的方式：Always：都可以通过；Never：
//IfAtMostOneObstacle：从不斜向；
//OnlyWhenNoObstacles：最多有一个障碍；没有障碍
var DiagonalMovement = {
    Always: 1,
    Never: 2,
    IfAtMostOneObstacle: 3,
    OnlyWhenNoObstacles: 4
};
//定义构造
function Grid(width, height, matrix) {
	this.width = width;
	this.height = height;
	this.nodes = this.buildNodes(width, height, matrix);
}
//创建数组
Grid.prototype.buildNodes = function(width, height, matrix) {
    var i, j,
        nodes = new Array(width);

    for (i = 0; i < width; ++i) {
        nodes[i] = new Array(height);
        for (j = 0; j < height; ++j) {
            nodes[i][j] = new Node(i, j, matrix[i][j]);
        }
    }
    return nodes;
}
//返回对应的节点
Grid.prototype.getNodeAt = function(x, y) {
    return this.nodes[x][y];
};
//是否可以行走
Grid.prototype.isWalkableAt = function(x, y) {
    return this.isInside(x, y) && this.nodes[x][y].walkable;
};
Grid.prototype.setWalkableAt = function(x, y, walkable) {
    this.nodes[x][y].walkable = walkable;
};
//是否在地图内
Grid.prototype.isInside = function(x, y) {
    return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
};
//获得相邻节点
Grid.prototype.getNeighbors = function(node, diagonalMovement) {
    var x = node.x,
        y = node.y,
        neighbors = [],
        //上下左右
        s0 = false, s1 = false,
        s2 = false, s3 = false,
        //斜方向
        d0 = false, d1 = false,
        d2 = false, d3 = false,
        nodes = this.nodes;
    // ↑
    if (this.isWalkableAt(x, y - 1)) {
        neighbors.push(nodes[x][y - 1]);
        s0 = true;
    }
    // →
    if (this.isWalkableAt(x + 1, y)) {
        neighbors.push(nodes[x + 1][y]);
        s1 = true;
    }
    // ↓
    if (this.isWalkableAt(x, y + 1)) {
        neighbors.push(nodes[x][y + 1]);
        s2 = true;
    }
    // ←
    if (this.isWalkableAt(x - 1, y)) {
        neighbors.push(nodes[x - 1][y]);
        s3 = true;
    }
    if (diagonalMovement === DiagonalMovement.Never) {
        return neighbors;
    }

    if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
        d0 = s3 && s0;
        d1 = s0 && s1;
        d2 = s1 && s2;
        d3 = s2 && s3;
    } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
        d0 = s3 || s0;
        d1 = s0 || s1;
        d2 = s1 || s2;
        d3 = s2 || s3;
    } else if (diagonalMovement === DiagonalMovement.Always) {
        d0 = true;
        d1 = true;
        d2 = true;
        d3 = true;
    } else {
        throw new Error('Incorrect value of diagonalMovement');
    }

    // ↖
    if (d0 && this.isWalkableAt(x - 1, y - 1)) {
        neighbors.push(nodes[x - 1][y - 1]);
    }
    // ↗
    if (d1 && this.isWalkableAt(x + 1, y - 1)) {
        neighbors.push(nodes[x + 1][y - 1]);
    }
    // ↘
    if (d2 && this.isWalkableAt(x + 1, y + 1)) {
        neighbors.push(nodes[x + 1][y + 1]);
    }
    // ↙
    if (d3 && this.isWalkableAt(x - 1, y + 1)) {
        neighbors.push(nodes[x - 1][y + 1]);
    }

    return neighbors;
}

module.exports = Grid;