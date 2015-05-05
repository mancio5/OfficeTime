var app = angular.module('app', []);

app.controller('ViewCtrl', function ($scope) {
  $scope.settings = 
    {
      max_score : 3,
      min_score : -3,
      showCat : false,
    }

});
app.directive('entry', function() {
  return {
  	restrict:'E',
    templateUrl: 'directives/entry.html'
  };
});