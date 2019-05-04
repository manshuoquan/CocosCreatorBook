'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'HelloWorld:open' () {
      // open entry panel registered in package.json
      Editor.Panel.open('helloworld');
    },
    'HelloWorld:say-hello' () {
      Editor.log('Hello World!');
      // send ipc message to panel
      Editor.Ipc.sendToPanel('HelloWorld', 'HelloWorld:hello');
    },
    'HelloWorld:clicked' () {
      Editor.log('Button clicked!');
    }
  },
};