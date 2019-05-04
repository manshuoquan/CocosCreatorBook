var HeroInfoData = [
                    {"name":"及时雨","name2":"宋江","id":0,"level":30,"blood":0.98,"intro":"原为山东郓城县押司，身材矮小，面目黝黑，为梁山起义军领袖，在一百单八将中稳坐梁山泊第一把交椅"},
                    {"name":"玉麒麟","name2":"卢俊义","id":1,"level":30,"blood":0.95,"intro":"武艺高强，棍棒天下无双，江湖人称河北三绝"},
                    {"name":"智多星","name2":"吴用","id":2,"level":30,"blood":0.90,"intro":"满腹经纶，通晓文韬武略，足智多谋，常以诸葛亮自比"},
                    {"name":"入云龙","name2":"公孙胜","id":3,"level":30,"blood":0.89,"intro":"他与晁盖、吴用等七人结义，一同劫取生辰纲，后上梁山入伙"},
                    {"name":"大  刀","name2":"关胜","id":4,"level":30,"blood":0.88,"intro":"在梁山好汉中排名第五，位居马军五虎将第一位，河东解良（今山西运城）人，是三国名将关羽的后代，精通兵法，使一把青龙偃月刀"},
                    {"name":"豹子头","name2":"林冲","id":5,"level":30,"blood":0.85,"intro":"东京人氏，原是八十万禁军枪棒教头，因其妻子被太尉高俅的养子高衙内看上，而多次遭到陷害，最终被逼上梁山落草"},
                    {"name":"霹雳火","name2":"秦明","id":6,"level":30,"blood":0.83,"intro":"因其性如烈火，故而人称“霹雳火”。祖籍山后开州。善使一条狼牙棒。本是青州指挥司统制，攻打清风山时，因中宋江的计策，被俘后无家可归，只得归顺"},
                    {"name":"双  鞭","name2":"呼延灼","id":7,"level":30,"blood":0.82,"intro":"宋朝开国名将铁鞭王呼延赞嫡派子孙，祖籍并州太原（今属山西太原），上梁山之前为汝宁郡都统制，武艺高强，杀伐骁勇，有万夫不当之勇"},
                    {"name":"小李广","name2":"花荣","id":8,"level":30,"blood":0.81,"intro":"原是清风寨副知寨，使一杆银枪，一张弓射遍天下无敌手，生得一双俊目，齿白唇红，眉飞入鬓，细腰乍臂，银盔银甲，善骑烈马，能开硬弓"},
                    {"name":"小旋风","name2":"柴进","id":9,"level":30,"blood":0.79,"intro":"沧州人氏，后周皇裔，人称柴大官人。他曾帮助过林冲、宋江、武松等人，仗义疏财，后因李逵在高唐州打死殷天锡，被高廉打入死牢，最终被梁山好汉救出，因此入伙梁山"}
]
cc.Class({
    extends: cc.Component,

    properties: {
    	content: {
            default: null,
            type: cc.Node
        },
        board: {
            default: null,
            type: cc.Node
        },
        prefab: {
            default: null,
            type: cc.Prefab
        },
        nameLabel1: {
            default: null,
            type: cc.Label
        },
        nameLabel2: {
            default: null,
            type: cc.Label
        },
        intro: {
            default: null,
            type: cc.Label
        },
        level: {
            default: null,
            type: cc.Label
        },
        spriteFrame:{
            default: null,
            type: cc.Sprite
        },
    },

    updateCell: function (index) {

    },
    //点击跳转
    onClickItem: function(tar,obj) {
    	var index = obj.index
        this.board.active = true
        //初始化详情信息
        var info = HeroInfoData[index]
        this.nameLabel1.string = info.name
        this.nameLabel2.string = info.name2
        this.level.string = info.level
        this.intro.string = info.intro
        //更新立绘
        this.spriteFrame.spriteFrame = this.content.getComponent("SpriteFrameMangager")["bigSpriteFrame" + info.id]
    },
    //关闭详情界面
    onClose:function(){
        this.board.active = false
    },
    // use this for initialization
    onLoad: function () {
    	this.content.height = 200 * HeroInfoData.length
    	for(var i = 0;i < HeroInfoData.length;i ++)
    	{
            //创建具体cell
            var item = cc.instantiate(this.prefab)
            this.content.addChild(item)
            item.setPosition(cc.p(0,-97 - 200 * i))
            item.getComponent("ListCell").upDateInfo(this.content.getComponent("SpriteFrameMangager")["iconSpriteFrame" + HeroInfoData[i].id],HeroInfoData[i])
    	    //添加点击事件
            var clickEventHandler = new cc.Component.EventHandler();
            clickEventHandler.target = this; 
            clickEventHandler.component = "UiControl";
            clickEventHandler.handler = "onClickItem";
            clickEventHandler.customEventData = {"index":i};

            var button = item.getComponent("ListCell").button
            button.clickEvents.push(clickEventHandler);
    	}
    },

    // called every frame
    update: function (dt) {

    },
});
