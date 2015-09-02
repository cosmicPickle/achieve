var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('ProfileMainCtrl', 
['$rootScope', '$scope', '$q', '$routeParams', '$route', '$translatePartialLoader', '$translate', 'Users', 'UserAchievements', 'History', 'objArr',
function ($rootScope, $scope, $q, $routeParams, $route, $translatePartialLoader, $translate, Users,  UserAchievements, History, objArr) {
    
    //Setting the translation configuration
    $translatePartialLoader.addPart('profile');

    //Contains the errors
    $scope.errors = [];
    
    //Setting the user id
    $scope.uid = $routeParams.user || -1;
    
    //The user we are inspecting. Note that the user id might be -1 in case we are 
    //Looking through the current user
    $scope.user = {};
    
    //The current action
    $scope.action = $routeParams.action;
    
    /**
     * These function fetch data for the various profile actions
     */
    
    //Contains the promise of a fetched user
    var fetchedUser = (function() {
        return $q(function(resolve, reject){
            Users.simple({user : $scope.uid}, function(resp) {
                    
                if(resp.status == 0)
                {
                    reject('Status : 0')
                    $scope.errors = resp.errors;
                    return;
                }

                if(!resp.data || !resp.data.Users.length)
                {
                    //No achievement was returned
                    $translate('invalidUser').then(function(err){
                        $scope.errors = [err];
                        reject(err);
                    });

                    return;
                }

                resolve('');
                $scope.user = resp.data.Users[0];
            });
        });
    })();
    
    /**
     * 
     * General Profile related functions and variables
     */
    var profileGeneral = function() {
        
    };
    
    /**
     * 
     * Statistics related functions and variables
     */
    var profileStats = function() {
        
    };
    
    /**
     * 
     * History related functions
     */
    var profileHistory = function() {
        
    };
    
    $scope.fetchHistory = function() {
        
    }
    
    
    
    //The profile actions
    $scope.actions = {
        general : {
            title : 'general',
            url : 'assets/views/partials/profileGeneral.html',
            public : 1,
            callback : profileGeneral
        },
        stats : {
            title : 'stats',
            url : 'assets/views/partials/profileStats.html',
            public : 0,
            callback : profileStats
        },
        history : {
            title : 'history',
            url : 'assets/views/partials/profileHistory.html',
            public : 0,
            callback : profileHistory
        },
    } 
    
    //Determining whether all the actions wil be visible or not. If the user id 
    //is -1 it means we are looking at the current user. Then everething is visible.
    //If not only the public tabs are visible;
    angular.forEach($scope.actions, function(a, i){
       a.visible = + (a.public || (!a.public && $scope.uid == -1)); 
       a.active = + (a.visible && i == $scope.action);
       
       if(a.active)
           a.callback();
    });
    
    //Modifies the route when the tab is changed
    $scope.changeAction = function(action, i) {
        
        if(i == $scope.action)
            return; 
        
        $route.updateParams({
           action : i,
           user : ($scope.uid != -1) ? $scope.uid : ''
        });
    }

}]);
