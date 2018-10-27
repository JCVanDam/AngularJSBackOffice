app.service('storeWidget',function(){
  var bidId;
  var tabIndex;
  var widgetType;
  var display = [
    {
       "label": "Bouton d'appel avec du texte",
       "send" : "buttontxt"
    },
    {
       "label": "Bouton avec une barre d'appel",
       "send" : "callbar"
    },
    {
        "label": "Bouton flotant avec une barre d'appel",
        "send" : "popbar"
    },
    {
        "label": "Bouton integrer dans une popin",
        "send" : "popin"
    }
  ];

  this.save = function(el1, el2, el3){
    window.sessionStorage.setItem('bid', el1);
    window.sessionStorage.setItem('tabIndex', el2);
    for(item in display){
			if(display[item].send == el3){
        el3 = item;
      }
    }
    window.sessionStorage.setItem('widgetType', el3);
  };
  this.getBidId = function(){
    return window.sessionStorage.getItem('bid')
  };
  this.gettabIndex = function(){
    return window.sessionStorage.getItem('tabIndex')
  };
  this.getwidgetType = function(){
    return window.sessionStorage.getItem('widgetType')
  };
});
