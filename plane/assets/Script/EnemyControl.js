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
        type: 1
    },

    onLoad: function () {
        this.bulletPool = new cc.NodePool();
        var initCount = 5;
        for (var i = 0; i < initCount; ++i) {
            var enemy = cc.instantiate(this.bulletPrefab); 
            enemy.test = function(other, self){
                console.log('enemy.onCollisionEnter1');
            }
            this.bulletPool.put(enemy); 
        }
        //创建子弹逻辑
        /*var bulletLogic = cc.callFunc(function(target) {
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
            bullet.runAction(cc.sequence(cc.moveTo(1, pos.x, -600),finished))
            this.node.runAction(cc.sequence(cc.delayTime(1),bulletLogic))
        }, this)
        this.node.runAction(cc.sequence(cc.delayTime(1),bulletLogic))*/
    },

    start: function () {

    },

    setControlNode :function(node,index)
    {
        this.nodeControl = node
        this.enmeyIndex = index
    },

    update: function (dt) {
        
    },

    onCollisionEnter: function (other, self) {
        var exp = cc.instantiate(this.explodePrefab)
        var gameControl = this.nodeControl.getComponent("GameControl")
        var index = this.enmeyIndex
        var enemy = this.enmeyIndex
        var onFinished = function()
        {
            exp.destroy();
            gameControl.enemyDes(index,enemy)
        }
        exp.getComponent(cc.Animation).on('finished', onFinished, this);
        self.node.addChild(exp)
    }
});
