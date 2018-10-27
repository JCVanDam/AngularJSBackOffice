app.factory('utfMode', function(){
  return {
    decode: function(s) {
      if(s) {
        var regex;
        var defs = {
          '&#39;'	  :"'",
          '&quot;'  :'"',
          '&lt;'    :'<',
          '&gt;'    :'>',
          '&#x3D;'  :'=',
          '&egrave;':'è',
          '&eacute;':'é',
          '&ecirc;'	:'ê',
          '&euml;'	:'ë',
          '&agrave;':'à',
          '&aacute;':'á',
          '&acirc;'	:'â',
          '&igrave;':'ì',
          '&iacute;':'í',
          '&icirc;'	:'î',
          '&iuml;'	:'ï',
          '&Agrave;':'À',
          '&Aacute;':'Á',
          '&Acirc;'	:'Â',
          '&Egrave;':'È',
          '&Eacute;':'É',
          '&Ecirc;'	:'Ê',
          '&Euml;'	:'Ë'
        };

       for(var key in defs) {
          regex = new RegExp(key, "g");
          s = s.replace(regex, defs[key]);
        }
      }
      return s;
    },
    encode: function(s) {
      if (s){
        var regex;
        var defs = {
          "'" : '&#39;',
          '"' : '&quot;',
          '<' : '&lt;',
          '>' : '&gt;',
          '=' : '&#x3D;',
          'è' : '&egrave;',
          'é' : '&eacute;',
          'ê' : '&ecirc;',
          'ë' : '&euml;',
          'à' : '&agrave;',
          'á' : '&aacute;',
          'â' : '&acirc;',
          'ì' : '&igrave;',
          'í' : '&iacute;',
          'î' : '&icirc;',
          'ï' : '&iuml;',
          'À' : '&Agrave;',
          'Á' : '&Aacute;',
          'Â' : '&Acirc;',
          'È' : '&Egrave;',
          'É' : '&Eacute;',
          'Ê' : '&Ecirc;',
          'Ë' : '&Euml;'
        };

        for (var key in defs) {
          regex = new RegExp(key, "g");
          s = s.replace(regex, defs[key]);
        }
      }
      return s;
    }
  }
});
