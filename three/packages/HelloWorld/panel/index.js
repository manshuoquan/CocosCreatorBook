Editor.Panel.extend({
  //定义样式
  style:":host { margin: 5px; }
         h2 { color: #f90; }",

  template:'<h2>标准面板</h2>
            <ui-button id="btn">点击</ui-button>
            <hr />
            <div>状态: <span id="label">--</span></div>',
  //定义面板样式
  $: {
    btn: '#btn',
    label: '#label',
  },
  //处理回调和逻辑
  ready () {
    this.$btn.addEventListener('confirm', () => {
      this.$label.innerText = '你好';
      setTimeout(() => {
        this.$label.innerText = '--';
      }, 500);
    });
  },
});