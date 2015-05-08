var app = angular.module('app', []);

app.controller('ViewCtrl', function ($scope) {
  $scope.settings = 
  {
    officeHours : {start: 8, end: 17},
    awakeHours : {start: 6, end: 19},
    freeHours : {start: 17, end: 8},
  }
  $scope.locations = db;
  $scope.results ={
    officeHours : [],
    awakeHours : [],
    freeHours : []
  }
  $scope.temp = {
    selection : [],
    matchHours : [],
    match: null,
    matchReady: false
  }
  $scope.checkboxModel ={}
////////////////////////////////////////////
//// TIMING FUNCTIONS
/////////////////////////////////////
  //what hours match (office, dayNight)
  $scope.getMatchingHours = function(option){
    $scope.temp.matchReady = false;
    $scope.temp.matchHours = [];
    if($scope.temp.selection.length<2) //only match if 2 elements
      return null;
    //find element in list  
    var locations = []
    for(i in $scope.temp.selection){
      locations.push($scope.temp.selection[i].obj)
    }
    ///
    var hours = [];  
    switch(option){
      case "officeHours":
        hours = $scope.settings.officeHours;
      break;
      case "awakeHours":
        hours = $scope.settings.awakeHours;
      break;
    } 
    //
    var startIndex = endIndex = 0;
    var s1 = locations[0].zone+hours.start;
    var e1 = locations[0].zone+hours.end;
    var interval = hours.end - hours.start;
    console.log(interval)
    for(i in locations){
      s2 = locations[i].zone+hours.start;
      if(interval>Math.abs(locations[startIndex].zone - locations[i].zone)){
        if((s2 < s1)||(startIndex==null)){
          s1 = s2;
          startIndex = i;
        } 
        e2 = locations[i].zone+hours.end;
        if((e2 > e1 )||(endIndex==null)){
          e1 = e2;
          endIndex = i;
          console.log(e2+" "+endIndex)
        }
      } 
    }
    console.log(locations)
    //convert in local time
    var m = false;
    for(i in locations){
      loc = locations[i];
      start = $scope.timeCompare(hours.start,locations[startIndex].zone,loc.zone);
      end = $scope.timeCompare(hours.end,locations[endIndex].zone,loc.zone);
      console.log(start.time+" "+end.time)
      console.log(hours.start+" "+hours.end)
      if(!(start.time>=hours.start && start.time<hours.end && end.time>=hours.start && end.time<=hours.end)){
        m = false;
      }
      else{
        m = true;
      }
      $scope.temp.matchHours.push({
        country: loc.country,
        start:start ,
        end: end,
        matched: m
      })
    }
    $scope.temp.matchReady = true;
    return ({ready:$scope.temp.matchReady,match:$scope.temp.matchHours})
  }
  //what's the time in location2 when location1 is .... 
  $scope.timeCompare = function(time1,zone1,zone2){
    if(zone1 > 0 && zone2<0)
      zone2--; // need to consider also 1h from midnight
    if(zone1 < 0 && zone2>=0)
      zone2++; // need to consider also 1h from midnight
    time2 = 24 - ((zone1 - zone2) - time1); 
    while(time2 > 24){
      time2 -= 24;
    }
    if(zone1<zone2 && time2<time1){day2=+1}
    else if(zone1>zone2 && time2>time1 ){day2=-1}
    else day2 = 0;
    return ({time:time2,day:day2})
  }
  $scope.hoursCompare = function(zone1,zone2,hours1){
    //start2 = start time office hour for other location
    var time1 = {
      zone : zone1,
      start: hours1.start,
      end : hours1.end
    }
    var time2 = {
      zone : zone2,
    }
    time2.start = $scope.timeCompare(time1.start,time1.zone,time2.zone).time;
    time2.end =  $scope.timeCompare(time1.end,time1.zone,time2.zone).time;
    //end2 = end time office hour for other location
    // office hours for other location
    return ({start:time2.start,end:time2.end})
  }
  
  $scope.findLocationFromName = function(country1,country2){
    for(i in $scope.locations){
      if(country1 == $scope.locations[i].country)
        loc1 = $scope.locations[i];
      if(country2 == $scope.locations[i].country)
        loc2 = $scope.locations[i];
    }
    return ({loc1:loc1,loc2:loc2})
  }
  //when interval2 is contained in interval1
  $scope.matchHours = function(start1,end1,start2,end2){
    var match = {};
    console.log(start1+","+end1+","+start2+","+end2)
    if(start2>end1){
      match.start = "nomatch";//null;
      match.end = "nomatch";//null;
    }else{
      if(start1 > start2){  //
          match.start = start1;
      }  
      else{
        match.start = start2;
      }
      if(end1 > end2){  //
          match.end = end2;
      }  
      else{
        match.end = end1;
      }
    }
    return ({start:match.start,end:match.end})
  }
////////////////////////////////////////////
//// INTERACTIONs
/////////////////////////////////////
  $scope.addcountry = function(loc){
    var tempArray = [];
    for(i in $scope.temp.selection){
      tempArray.push($scope.temp.selection[i].obj)
    }
    if(!$scope.isDuplicate(tempArray,loc)){
      $scope.temp.selection.push({
        obj: loc,
        num: 1
      })
    }
    else{
      var i = $scope.findIndexDuplicate(tempArray,loc);
      $scope.temp.selection[i].num++;
    }
  }
  $scope.tableMatch = function(obj){
    if(obj.matched){
      return "success"
    }
    else{
      return "warning"
    }
  }
  $scope.buildResult = function(){
    //test value debugging
    $scope.checkboxModel.awakeHours = $scope.checkboxModel.officeHours = true;
    if($scope.checkboxModel.awakeHours){
      var s = $scope.getMatchingHours("awakeHours");
      if(s){
        $scope.results.awakeHours = s.match;
        $scope.results.showAwakeHours = s.ready;
      }
    }
    if($scope.checkboxModel.officeHours){
      var s = $scope.getMatchingHours("officeHours");
      if(s){
        $scope.results.officeHours = s.match;
        $scope.results.showOfficeHours = s.ready;
      }
    }
    if($scope.checkboxModel.freeHours){
      var s = $scope.getMatchingHours("officeHours");
      if(s){
        $scope.results.freeHours = s.match;
        $scope.results.showFreeHours = s.ready;
      }
    }
  }
  $scope.update = function(){}
////////////////////////////////////////////
//// DUPLICATE
/////////////////////////////////////
  $scope.findIndexDuplicate = function(array,obj){
    for(i in array){
      if(obj == array[i])
        return i;  //index of the obj
    }
    return null;
  }
  $scope.isDuplicate = function(array,obj){
    for(i in array){
      if(obj == array[i])
        return true;
    }
    return false;
  }
});
////////////////////////////////////////////
//// DIRECTIVE
/////////////////////////////////////  
app.directive('entry', function() {
  return {
  	restrict:'E',
    templateUrl: 'directives/entry.html'
  };
});