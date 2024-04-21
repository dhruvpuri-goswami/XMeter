angular.module('expenseTrackerApp').controller('ReminderController', function ($scope) {
    $scope.reminders = [
        {
            subject: 'Lunch at Cafe',
            amount: '$45.00',
            date: '12/04/2024',
            sentTo: 'Alice'
        },
        {
            subject: 'Movie Tickets',
            amount: '$30.00',
            date: '12/04/2024',
            sentTo: 'Rohan'
        }
    ];

    $scope.paymentSplits = [
        {
            subject: 'Movie Tickets',
            amount: '$30.00',
            date: '12/04/2024',
            receivedFrom: 'Rohan'
        },
        {
            subject: 'Movie Tickets',
            amount: '$30.00',
            date: '12/04/2024',
            receivedFrom: 'Rohan'
        }
    ];

    $scope.addReminder = function () {
        // Logic to add a new reminder
    };
});