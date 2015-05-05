var app = angular.module('app', []);

app.controller('ViewCtrl', function ($scope) {
  $scope.settings = 
  {
    time: 13,
    officeHours : {start: 8, end: 17},
    currentZone: +10
  }
  var timeZone =[
    {location:"Melbourne",zone:+10,time:null,officeHours:{start:null,end:null}},
    {location:"New York",zone:-5,time:null,officeHours:{start:null,end:null}},
    {location:"Rome",zone:+1,time:null,officeHours:{start:null,end:null}},
    {location:"London",zone:0,time:null,officeHours:{start:null,end:null}}
  ]
  $scope.data = {
    localTime : null,
    timeZone: timeZone
  }
  $scope.setLocationTime = function(offset){
    d = new Date();
    utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    nd = new Date(utc + (3600000*offset));
    date = nd.toLocaleDateString();
    time = nd.toLocaleTimeString();
    return {date:date,time:time};
  }
  $scope.setOfficeHour = function(offset){
    var cityZone = offset//offset the time zone of the country
    var currentZone = $scope.settings.currentZone;
    if(cityZone>=0 && currentZone >0) //both easterner than London
      offset = (currentZone-cityZone); //difference with the current timezone
    else if(cityZone<0 && currentZone >0) //current east other zone west
      offset = -(currentZone-cityZone); //difference with the current timezone
    start = $scope.settings.officeHours.start-offset;
    if(start<0)
      start = 24-Math.abs(start); 
    end = $scope.settings.officeHours.end-offset;
    if(end<0)
      end = 24-Math.abs(end);  
    return {start:start,end:end}
  }
  $scope.init = function(){
    for( i in $scope.data.timeZone){
      var z = $scope.data.timeZone[i]
      var d = $scope.setLocationTime(z.zone);
      z.time = d.time;
      z.date = d.date;
      var o = $scope.setOfficeHour(z.zone);
      z.officeHours = o;
      console.log(z);
    }
  }
});
app.directive('entry', function() {
  return {
  	restrict:'E',
    templateUrl: 'directives/entry.html'
  };
});