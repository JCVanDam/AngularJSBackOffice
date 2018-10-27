app.factory('contextFactory', function(){
  return {

    delete: function(contextElem, elem, displayElem){
      var tmpTab = contextElem.split(';');

      if (elem.name && elem.id){
    		for (var i = 0;  i < tmpTab.length; i++){
          var coupleTab = tmpTab[i].split(',');

          if (coupleTab[0] === elem.id){
    				displayElem.splice(i, 1);
    				tmpTab.splice(i, 1);
    			}
    		}
        contextElem = "";
        for (key in tmpTab){
          var tmp = tmpTab[key].split(',');
          if (tmp != "")
            contextElem += tmp[0] + ',' + tmp[1] + ';';
        }
    	}
      return contextElem;
    },

    add: function(contextElem, elem, displayElem, key){
      if (elem.name && elem.id){
        var item = {
          name    : null,
          id      : null,
          display : true
        };
        for (index in displayElem[key]){
          if (index != (displayElem[key].length - 1) && displayElem[key][index].cookieName == elem.name)
            return "NAME ERROR";
          if (index != (displayElem[key].length - 1) && displayElem[key][index].cookieId == elem.id)
            return "ID ERROR";
        }
        for (index in displayElem[key]){
          displayElem[key][index].display = false;
        }
        displayElem.push(item);
        var newElem = elem.id + ',' + elem.name + ';';
        contextElem[key] += newElem;
      }
      return contextElem;
    },

    translateModifContext: function(tags, cookies){
      var contextRes = {'tags': '', 'cookies': ''};

      for (var i = 0; i < tags.length; i++){
  			if (tags[i].tagId && tags[i].tagName)
  				contextRes['tags'] = contextRes['tags'] + tags[i].tagId  + ',' + tags[i].tagName + ';';
  		}
  		for (i = 0; i < cookies.length; i++){
  			if (cookies[i].cookieId && cookies[i].cookieName)
  				contextRes['cookies'] = contextRes['cookies'] + cookies[i].cookieId  + ',' + cookies[i].cookieName + ';';
  		}
      return contextRes;
    },

    getContextValues: function(contextElem, elem, name){
    	var tmp  = "";
      var i    = 0;

    	if (contextElem[name]){
    		for (property in contextElem[name]){
          var keys  = Object.keys(contextElem[name]);
    			if (contextElem[name] && contextElem[name][property]){
    				elem.push({
    					id			: keys[i],
    					name		: contextElem[name][property],
    					display	: false
    				});
    				tmp += property + ',' + contextElem[name][property] + ';';
    			}
          i++;
    		}
    	}
    	elem.push({
    		id			: null,
    		name		: null,
    		display	: true
    	});
      return tmp;
    }
  }
})
