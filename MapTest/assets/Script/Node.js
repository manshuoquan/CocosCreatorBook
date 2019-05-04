function Node(x, y, walkable) {
    this.x = x;    
    this.y = y;        
    this.f = 0;
    this.h = 0;
    this.g = 0;
    this.opened = false;
    this.closed = false;
    this.parent = null;
    this.walkable = (walkable == 0 ? false : true);
}

module.exports = Node;