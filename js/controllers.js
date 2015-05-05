var app = angular.module('app', []);

app.controller('ViewCtrl', function ($scope) {
  $scope.settings = 
  {
    time: 13,
    officeHours : {start: 8, end: 17},
    currentZone: +10,
    span:72
  }
  var locations =[
    {city:"Melbourne",zone:+10},
    {city:"New York",zone:-5},
    {city:"Rome",zone:+1},
    {city:"London",zone:0}
  ]
  $scope.officeHours = [];
  $scope.setOfficeArray = function(){
    for(var i=-12; i<=12; i++){
      start1= i - ( 24 - $scope.settings.officeHours.start);
      start2 = i + $scope.settings.officeHours.start;
      end1 = i - ( 24 - $scope.settings.officeHours.end);
      end2 = i + $scope.settings.officeHours.end; 
      if(start1<-24) start1 = -24;
      if(start1>24) start1 = 24;
      if(start2<-24) start2 = -24;
      if(start2>24) start2 = 24;
      if(end1<-24) end1 = -24;
      if(end1>24) end1 = 24;
      if(end2<-24) end2 = -24;
      if(end2>24) end2 = 24;
      office = {zone:i,start1:start1,end1:end1,start2:start2,end2:end2};
      console.log(office)
      $scope.officeHours.push(office)
    }
  }
  $scope.setOfficeArray();
  $scope.drawBars = function(){
    var data = [4, 8, 15, 16, 23, 42];

    var x = d3.scale.linear()
        .domain([0, d3.max(data)])
        .range([0, 420]);

    d3.select(".chart")
      .selectAll("div")
        .data(data)
      .enter().append("div")
        .style("width", function(d) { return x(d) + "px"; })
        .text(function(d) { return d; });
  }
  $scope.drawBars();
  
});
app.directive('entry', function() {
  return {
  	restrict:'E',
    templateUrl: 'directives/entry.html'
  };
});