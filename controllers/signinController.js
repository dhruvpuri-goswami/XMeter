function signinController($scope, $http) {
    $scope.ctrl = this;
    $scope.ctrl.user = {};

    $scope.ctrl.signin = function (event) {
        event.preventDefault();
        if ($scope.signinForm.$valid) {
            // Form is valid, you can perform your signin logic here
            console.log($scope.ctrl.user);
            console.log('Form submitted successfully');

            // Perform HTTP request to authenticate user
            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/signin',
                data: JSON.stringify($scope.ctrl.user)
            }).then(function (response) {
                console.log(response);
                if (response.data.success) {
                    window.location.href = '/dashboard.html';
                } else {
                    alert('Signin failed');
                }
            }).catch(function (error) {
                console.error('Error occurred:', error);
            });
        } else {
            // Form is invalid, handle validation errors
            alert('Form submission failed. Please check the form fields.');
        }
    };
}