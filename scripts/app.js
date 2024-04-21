const app = angular.module('expenseTrackerApp', []).run(function ($rootScope, $http) {
    $rootScope.showExpenseModal = false;
    $rootScope.showBudgetIncomeModal = false;
    $rootScope.openExpenseModal = function () {
        console.log('Opening expense modal');
        $rootScope.showExpenseModal = true;
    };
    $rootScope.closeExpenseModal = function () {
        $rootScope.showExpenseModal = false;
    };
    $rootScope.openIncomeModal = function () {
        $rootScope.showBudgetIncomeModal = true;
    };
    $rootScope.closeIncomeModal = function () {
        $rootScope.showBudgetIncomeModal = false;
    };

    $rootScope.dateToday = function () {
        return new Date().toISOString().split("T")[0];
    }


    // set user data
    $rootScope.user = JSON.parse(localStorage.getItem('user'));


    $rootScope.recentExpenses = [];

    // get expenses
    $rootScope.getExpenses = function () {
        const user = JSON.parse(localStorage.getItem('user'));
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/get-expenses/3',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                email: user.email
            }
        }).then(function successCallback(response) {
            $rootScope.recentExpenses = response.data.expenses;
            console.log(response);
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };


    //get time on AM and PM
    $rootScope.getTime = function (date) {
        const dateD = new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        return dateD;
    }

    $rootScope.getMonthYear = function(id){
        // id have month and year
        if(id === undefined) return "month, year";
        const month = id.month;
        const year = id.year;
        const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        return `${months[month-1]}, ${year}`;
    }

    // calculate time difference
    $rootScope.calculateTimeDiff = function (date) {
        const expenseDate = new Date(date).getTime();
        const currentDate = new Date().getTime();

        const diff = currentDate - expenseDate;

        //if less than a minute
        if (diff < 60000) {
            return 'Just now';
        }

        //if less than an hour
        if (diff < 3600000) {
            const minutes = Math.floor(diff / 60000);
            return `${minutes} m`;
        }

        //if less than a day
        if (diff < 86400000) {
            const hours = Math.floor(diff / 3600000);
            return `${hours} h`;
        }

        //if less than a week
        if (diff < 604800000) {
            const days = Math.floor(diff / 86400000);
            return `${days} d`;
        }

        //if more than a week
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        //if more than a month
        if (days > 30) {
            const months = Math.floor(days / 30);
            return `${months} month`;
        }

        //if more than a year
        if (days > 365) {
            const years = Math.floor(days / 365);
            return `${years} year`;
        }

        return days;
    }

    
    
    // get monthly expenses
    $rootScope.monthlyExpenses = [];
    $rootScope.getMonthlyExpenses = function () {
        const user = JSON.parse(localStorage.getItem('user'));
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/get-monthly-expenses/4',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                email: user.email
            }
        }).then(function successCallback(response) {
            $rootScope.monthlyExpenses = response.data.expenses;
            console.log(response);
        }).catch(function errorCallback(response) {
            console.error(response);
        });
    };

    $rootScope.getExpenses();
    $rootScope.getMonthlyExpenses();
});
