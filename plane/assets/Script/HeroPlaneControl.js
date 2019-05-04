cc.Class({
    extends: cc.Component,

    properties: {
        bulletPrefab:{
            default: null,
            type: cc.Prefab
        },
        explodePrefab:{
            default: null,
            type: cc.Prefab
        },
        com1:{
            default: null,
            type: cc.Node
        },
        com2:{
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this.state = 3
        this.bulletPool = new cc.NodePool();
        var initCount = 5;
        for (var i = 0; i < initCount; ++i) {
            var enemy = cc.instantiate(this.bulletPrefab); 
            this.bulletPool.put(enemy); 
        }
        var bulletLogic = cc.callFunc(function(target) {
            if(this.state <= 0) 
                return
            var bullet
            if (this.bulletPool.size() > 0) { 
                bullet = this.bulletPool.get()
            } else { 
                bullet = cc.instantiate(this.bulletPrefab)
            }
            bullet.parent = this.node.parent
            var pos = this.node.getPosition()
            bullet.setPosition(pos)
            var finished = cc.callFunc(function(target) {
                this.bulletPool.put(bullet);
            }, this)
            bullet.runAction(cc.sequence(cc.moveTo(1, pos.x, 600),finished))
            this.node.runAction(cc.sequence(cc.delayTime(1),bulletLogic))
        }, this)
        this.node.runAction(cc.sequence(cc.delayTime(1),bulletLogic))
    },

    start: function () {

    },

    setControlNode :function(node)
    {
        this.nodeControl = node
    },

    update: function (dt) {
        
    },
    onCollisionEnter: function (other, self) {
        if(this.state == 3){
            this.state = 2
            this.com2.active = false
        }else if(this.state == 2){
            this.state = 1
            this.com3.active = false
        }else if(this.state == 1){
            this.state = 0
            var exp = cc.instantiate(this.explodePrefab)
            var onFinished = function()
            {
                exp.destroy();
            }
            exp.getComponent(cc.Animation).on('finished', onFinished,this);
            self.node.addChild(exp)

            this.nodeControl.getComponent("GameControl").setGameOver()
        }
    }
});
