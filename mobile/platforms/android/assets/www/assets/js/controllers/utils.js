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