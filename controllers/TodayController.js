angular.module('expenseTrackerApp').controller('TodayController', function($scope,$location) {
    // Main controller logic
    $scope.isActiveLink = function(route) {
        console.log($location.absUrl().split('/').pop());
        console.log(route);
        return route === $location.absUrl().split('/').pop();
    }
});