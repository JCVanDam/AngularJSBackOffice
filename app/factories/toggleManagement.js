app.factory('toggleManagement', function(){
  return {
    save: function(items){
      var block = {};
      for (var i = 0; i < items.length; i++)
        block[items[i]] = false;
      block[items[0]] = true;
      return block;
    },
    getToggle: function(block, id){
      for (var key in block)
  			block[key] = false;
      block[id] = true;
      return block;
    },
    getToggleMenu: function(block, id){
      block[id] = !block[id];
      return block;
    },
    saveSelectToggle: function(items){
      var block = {};
      for (var i = 0; i < items.length; i++)
        block[items[i]] = '';
      block[items[0]] = 'selected';
      return block;
    },
    getSelectToggle: function(block, id){
      for (var key in block)
  			block[key] = '';
      block[id] = 'selected';
      return block;
    }
  }
});
