function signupController($scope,$http) {
    $scope.ctrl = this;
    $scope.ctrl.signupForm = {};
    
    $scope.ctrl.signup = function (event) 
    {   
        console.log(event)
        event.preventDefault();
        if ($scope.signupForm.$valid) {
            // Form is valid, you can perform your signup logic here
            console.log($scope.ctrl.user);
            console.log('Form submitted successfully');
            if($scope.ctrl.user.password != $scope.ctrl.user.confirmPassword){
                alert('Password and Confirm Password do not match');
                return;
            }

            $http({
                method: 'POST',
                url: 'http://localhost:3000/api/signup',
                data: JSON.stringify($scope.ctrl.user)
            }).then(function (response) {
                console.log(response);
                if(response.data.success){
                    window.location.href = '/dashboard.html';
                } else {
                    alert('Signup failed');
                }
            }, function (error) {
                console.error('Error occurred:', error);
            });
        } else {
            // Form is invalid, handle validation errors
            alert('Form submission failed. Please check the form fields.');
        }
    };
}