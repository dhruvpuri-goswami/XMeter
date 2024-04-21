angular.module('expenseTrackerApp').controller('MainController', function($scope,$location) {
    // Main controller logic
    $scope.isActiveLink = function(route) {
        return route === $location.absUrl().split('/').pop();
    }
});