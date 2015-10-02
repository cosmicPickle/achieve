var utilsControllers = angular.module('utilsControllers', []);


utilsControllers.controller('LandingCtrl', 
['$rootScope', '$scope', '$state', '$translate', 'Guest',
    function ($rootScope, $scope, $state, $translate, Guest) {
        
        $rootScope.title = $translate.instant('welcome');
        
        $scope.continue = function() {
            Guest.create({}, function(resp){
                if(resp.status)
                    $state.go('list.category');
            });
        }
}]);

utilsControllers.controller('RegisterCtrl', 
['$rootScope', '$scope', '$state', '$translate', 'Users',
    function ($rootScope, $scope, $state, $translate, Users) {
        
        $rootScope.title = $translate.instant('register');
        $scope.formData = {
            register : 1,
            temporary : 0,
            email : "",
            password : "",
            re_password : ""
        };
        
        $rootScope.$watch('currentUser', function(user){
            if(!user)
                return;
            
           $scope.formData.id = user.id;
           
            $scope.register = function() {
                Users.update($scope.formData, function(resp){
                    if(resp.status)
                        $state.go('list.category');
                });
            };
        });

}]);