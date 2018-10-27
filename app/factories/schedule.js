app.factory('schedule', function(){
  return {

/*
** Create an array with all the schedules values spaced by 10 minutes which are
** display on the select element HTML.
*/

    makeScheduleModel: function(){
  		var scheduleModel	= [];
  		var res;
  		var hourString;
  		var minString;
  		var item;
  		var i = 0;

  		for(var hour = 0; hour < 24; hour++){
  			for(var min = 0; min < 60; min += 10){
  				hourString	= (hour <= 9) ? "0" + hour : hour + "";
  				minString		= (min == 0) ? "0" + min : min + "";
  				res					= hourString + ":" + minString;
  				scheduleModel.push(res);
  				i++;
  			}
  			min = 0;
  		}
      return scheduleModel;
  	},

/*
** Change on value in schedule array.
*/

    setSchedule: function(schedule, day, timeRange, state, select){
  		var mode = (state == "open") ? 0 : 1;

      if (schedule[day][timeRange] == null)
        schedule[day][timeRange] = []
  		schedule[day][timeRange][mode] = select;
  	},

/*
** Change schedule array in string array with ';' like delimiter.
*/

    translateSchedule: function(scheduleRes){
      var day = [];
      var idx = 0;

  		for (var i in scheduleRes) {
  			var y = '';
  			for (var j in scheduleRes[i]) {
  				y = (j == "afternoon") ? y + scheduleRes[i][j] : y + scheduleRes[i][j] + ';';
  			}
  			y = y.replace(/,/g, ";");
  			day[idx] = y;
  			idx++;
  		}
      return day;
    },

/*
** Applies the same schedule template to all day which are open.
*/

    templateApply: function(schedule, scheduleTmp, selectLst, dayLst){
      var scheduleModel	= this.makeScheduleModel();
      var indexSchedule = [];
      var j             = 0;

      for (property in scheduleTmp){
				if (!selectLst[property]){
					schedule[property]["morning"] = [null, null];
					schedule[property]["afternoon"] = [null, null];
					dayLst[property] = false;
					j = j + 4;
				} else{
          dayLst[property] = true;
					for (timeRange in schedule[property]){
							for (var i = 0; i < 2; i++){
								var mode = (!i) ? "open" : "close";

								indexSchedule[j] = scheduleModel.indexOf(scheduleTmp[property][timeRange][i]);
								this.setSchedule(schedule, property, timeRange, mode, scheduleModel[indexSchedule[j]]);
								j++;
						}
					}
				}
			}
      return indexSchedule;
    },

/*
** Return an array with all the scheduleModel's index of schedule's value.
*/

    getIndexSchedule: function(schedule, dayLst){
      var scheduleModel	= this.makeScheduleModel();
      var indexSchedule = [];
      var j     				= 0;

      for (property in schedule){
        if ((!schedule[property]["morning"] || !schedule[property]["morning"][0]) && dayLst != undefined){
          dayLst[property] = !dayLst[property];
          j = j + 4;
        } else{
          for (timeRange in schedule[property]){
            for (var i = 0; i < 2; i++){
              var str = (!i) ? "open" : "close";
              indexSchedule[j] = (schedule[property][timeRange]) ? scheduleModel.indexOf(schedule[property][timeRange][i]) : scheduleModel[0];
              j++;
            }
          }
        }
      }
      return indexSchedule;
    },

/*
** Return an array with all the scheduleModel's index of schedule's value.
*/

  initializeSelect: function(schedule, selectLst){
    for (day in schedule){
      if (!schedule[day]['morning'] && !schedule[day]['afternoon']){
        selectLst[day] = false;
      }
    }
    return selectLst;
  }

/*
** Return an array with all the scheduleModel's index of schedule's value.
*/

    /*getIndexSchedule: function(schedule){
      var scheduleModel = this.makeScheduleModel();
      var tabIndex 			= [];

      for (property in schedule){
        for (timeRange in schedule[property]){
          if (schedule[property][timeRange]){
            tabIndex.push(scheduleModel.indexOf(schedule[property][timeRange][0]));
            tabIndex.push(scheduleModel.indexOf(schedule[property][timeRange][1]));
          }
        }
      }
      return tabIndex;
    }*/
  }
});
