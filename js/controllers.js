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
    {city:"Rome",zone:+1},
    {city:"London",zone:0}
  ]
  $scope.temp = {}
  $scope.officeHours = [];
  //what hours match (office, dayNight)
  $scope.getMatchingHours = function(loc1,loc2,option){
      //find element in list     
      switch(option){
        case "officeHours":
          hours1 = $scope.settings.officeHours;
        break;
        case "dayNight":
          hours1 = $scope.settings.dayNight;
         
        break;
      }
      hours2 = $scope.hoursCompare(loc1.zone,loc2.zone,hours1);
      match = $scope.matchHours (hours1.start,hours1.end,hours2.start,hours2.end);
      $scope.temp.matchLocations = [
        {city:loc1.city, start: hours1.start,end: hours1.end},
        {city:loc2.city, start: hours2.start,end: hours2.end}
      ]
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
    if(start2 > end1 && end2 < end1 && end2 >start1){  //
        match.start = start1;
        match.end = end2;
    }  
    else if(start2 > start1 && start2 < end1 && (end2 >= end1 ||  end2 < end1)){
      match.start = start2;
      match.end = end1;
    }
    else if(start2 > start1 && start2 > start1 && start1 < end2){
      match.start = start1;
      match.end = end2;
    }
    else{
      match.start = "nomatch";//null;
      match.end = "nomatch";//null;

    }
    console.log(start1)
    console.log(end1)
    console.log(start2)
    console.log(end2)
    console.log(match)
    return ({start:match.start,end:match.end})
  }
});
app.directive('entry', function() {
  return {
  	restrict:'E',
    templateUrl: 'directives/entry.html'
  };
});