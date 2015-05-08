var app = angular.module('app', []);

app.controller('ViewCtrl', function ($scope) {
  $scope.settings = 
  {
    officeHours : {start: 8, end: 17},
    dayNight : {start: 6, end: 19},
  }
  $scope.locations =[
    {city:"Melbourne",zone:+9},
    {city:"New York",zone:-4},
    {city:"Ra",zone:+4},
    {city:"Ra",zone:+3},
    {city:"R",zone:+2},
    {city:"Rome",zone:+1},
    {city:"London",zone:0}
  ]
  $scope.temp = {
    selection : [],
    matchHours : [],
    match: null,
    matchReady: false
  }
  $scope.officeHours = [];
////////////////////////////////////////////
//// TIMING FUNCTIONS
/////////////////////////////////////
  //what hours match (office, dayNight)
  $scope.getMatchingHours = function(option){
    $scope.temp.matchReady = false;
    $scope.temp.matchHours = [];
    if($scope.temp.selection.length<2) //only match if 2 elements
      return;
    //find element in list  
    var locations = []
    for(i in $scope.temp.selection){
      locations.push($scope.temp.selection[i].obj)
    }
    ///
    var hours = [];  
    switch(option){
      case "officeHours":
        hours.push($scope.settings.officeHours);
      break;
      case "dayNight":
        hours.push($scope.settings.dayNight);
      break;
    }      
    for(var i=0; i<locations.length-1;i++){
      var loc1 = locations[i];
      var loc2 = locations[i+1];
      var hours1 = hours[i];
      var hours2 = $scope.hoursCompare(loc1.zone,loc2.zone,hours1);
      hours.push(hours2);    
    }
    ///matching
    var match = {};
    for(var i=0; i<locations.length-1;i++){
      var loc1 = locations[i+1];
      var loc2 = locations[i];
      if(i == 0){
        hours1 = hours[i+1];
        hours2 = hours[i];
      }
      else {
        hours1 = hours[i];
        hours2 = $scope.temp.match;
      }
      console.log(loc1.city+" "+loc2.city)
      //match is always the last one
      console.log("compare "+loc1.city+" "+hours1.start+" - "+hours1.end+" with "+loc2.city+" "+hours2.start+" - "+hours2.end);
      $scope.temp.match = $scope.matchHours (hours1.start,hours1.end,hours2.start,hours2.end);
      console.log("match: "+$scope.temp.match.start+" - "+$scope.temp.match.end);
      
    } 
    $scope.temp.matchReady = true;
    //get match hours related to country
    for(i in locations){
      var l = locations[i];
      console.log(l.city+" "+$scope.temp.match.start+" "+$scope.temp.match.end)
      var h = $scope.hoursCompare(locations[locations.length-1].zone,l.zone,$scope.temp.match)
      $scope.temp.matchHours.push({city:l.city,start:h.start,end:h.end})
    }
    //
    return (match.start+" - "+match.end )
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
  
  $scope.findLocationFromName = function(city1,city2){
    for(i in $scope.locations){
      if(city1 == $scope.locations[i].city)
        loc1 = $scope.locations[i];
      if(city2 == $scope.locations[i].city)
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
    /*
    if(start2 > end1 && end2 < end1 && end2 >start1){  //
        match.start = start1;
        match.end = end2;
    }  
    else if(start2 > start1 && start2 < end1 && (end2 >= end1 ||  end2 < end1)){
      match.start = start2;
      match.end = end1;
    }
    else if(start1<=start2 && start2<end1 && end2>end1){
      match.start = start2;
      match.end = end1;
    }
    else if(start1 >= start2 && ((end2>end1)||(end2<start1))){
      match.start = start1;
      match.end = end1;
    }
    else{
      match.start = "nomatch";//null;
      match.end = "nomatch";//null;

    }*/
    return ({start:match.start,end:match.end})
  }
////////////////////////////////////////////
//// INTERACTIONs
/////////////////////////////////////
  $scope.addCity = function(loc){
    var tempArray = [];
    for(i in $scope.temp.selection){
      tempArray.push($scope.temp.selection[i].obj)
    }
    if(!$scope.isDuplicate(tempArray,loc)){
      $scope.temp.selection.push({
        obj: loc,
        num: 1
      })
      console.log("addCity "+loc.city)
    }
    else{
      var i = $scope.findIndexDuplicate(tempArray,loc);
      $scope.temp.selection[i].num++;
    }
  }
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