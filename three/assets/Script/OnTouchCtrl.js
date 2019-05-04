cc.Class({
    extends: cc.Component,

    properties: {
        canvas: cc.Node,
        follower: {
            default: null,
            type: cc.Node
        },
        followSpeed: 200
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        self.moveToPos = cc.p(0, 0);
        self.isMoving = false;
        self.canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            self.isMoving = true;
            self.moveToPos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
        }, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touches = event.getTouches();
            var touchLoc = touches[0].getLocation();
            self.moveToPos = self.follower.parent.convertToNodeSpaceAR(touchLoc);
        }, self.node);
        self.canvas.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.isMoving = false; // when touch ended, stop moving
        }, self.node);
    },

    // called every frame
    update: function (dt) {
        if (!this.isMoving) return;
        var oldPos = this.follower.position;
        // get move direction
        var direction = cc.pNormalize(cc.pSub(this.moveToPos, oldPos));
        // multiply direction with distance to get new position
        var newPos = cc.pAdd(oldPos, cc.pMult(direction, this.followSpeed * dt));
        // set new position
        this.follower.setPosition(newPos);
    }
});
