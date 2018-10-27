app.factory('user', function(){
  return {
    setInfo(user_name, company_name){
      var api = array(user_name, company_name);
      return api;
    },
    getInfo(){
      var ret = this.setInfo();
      return ret;
    }
  }});
