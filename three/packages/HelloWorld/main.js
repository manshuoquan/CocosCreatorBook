'use strict';

module.exports = {
  load () {
    //加载完成时回调
  },

  unload () {
    //卸载完成回调
  },

  messages: {
    open() {
      Editor.log('Hello World!');
      Editor.Panel.open('HelloWorld');
    }
  },
};