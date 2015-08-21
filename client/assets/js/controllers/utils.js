var utilsControllers = angular.module('utilsControllers',[]);

utilsControllers.controller('AuthController', ['$scope', '$location', 'Token' , function($scope, $location, Token){
        Token.view({}, function(resp){
            if(!resp.status)
                window.location = $location.absUrl().split('index.html')[0] + 'login.html';
        });
        
}]);