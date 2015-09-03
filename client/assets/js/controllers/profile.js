var profileControllers = angular.module('profileControllers', []);

profileControllers.controller('ProfileGeneralCtrl', 
['$rootScope', '$scope', '$q', '$routeParams', '$route', '$translatePartialLoader', '$translate', 'Users', 'UserAchievements', 'objArr',
function ($rootScope, $scope, $q, $routeParams, $route, $translatePartialLoader, $translate, Users,  UserAchievements, objArr) {
    
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
    $scope.action = 'general';
    
    $scope.title = "";
    //Setting the dynamic title of the page
    $scope.$watch('user', function(user){
        $translate('generalTitle', {
            name : user.name  
        }).then(function(generalTitle){
            $scope.title = generalTitle; 
            $rootScope.title = generalTitle;
        });
    });
    
}]);

profileControllers.controller('ProfileStatsCtrl', 
['$rootScope', '$scope', '$q', '$routeParams', '$route', '$translatePartialLoader', '$translate', 'Users', 'UserAchievements', 'objArr',
function ($rootScope, $scope, $q, $routeParams, $route, $translatePartialLoader, $translate, Users,  UserAchievements, objArr) {
    
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
    $scope.action = 'stats';
    
    $scope.title = "";
    //Setting the dynamic title of the page
    $scope.$watch('user', function(user){
        $translate('statsTitle', {
            name : user.name  
        }).then(function(statsTitle){
            $scope.title = statsTitle; 
            $rootScope.title = statsTitle;
        });
    });
    
}]);

profileControllers.controller('ProfileHistoryCtrl', 
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
    $scope.action = 'history';
    
    var now = new Date();
    //Load history from the beggining of the month
    $scope.startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    //The upper limit will be the end of today
    $scope.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDay() - 1, 23, 59, 59);
    //The raw history
    $scope.history = [];
    //Calendar: the history by days
    $scope.calendar = [];
    
    $scope.title = "";
    //Setting the dynamic title of the page
    $scope.$watch('user', function(user){
        $translate('historyTitle', {
            name : user.name  
        }).then(function(historyTitle){
            $scope.title = historyTitle; 
            $rootScope.title = historyTitle;
        });
    });
    
    //Contains the promise of a fetched user
    var fetchUser = function() {
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
                    //No user was returned
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
    };
    
    //The function that is used to load history
    $scope.loadHistory = function() {
        console.log(new Date($scope.startDate), new Date($scope.endDate));
        History.list({
            user : $scope.uid, 
            startDate : Math.floor($scope.startDate/1000), 
            endDate : Math.floor($scope.endDate/1000),
            paginate : 0,
            extended: 1}, function(resp){
                if(resp.status == 0)
                {
                    $scope.errors = resp.errors;
                    return;
                }

                if(!resp.data || !resp.data.History.length)
                {
                    //No history was returned
                    $translate('noHistory').then(function(err){
                        $scope.errors = [err];
                        reject(err);
                    });
                    return;
                }
                //$scope.history = angular.extend($scope.history, resp.data.History);
                $scope.history = resp.data.History;
                $scope.createCalendar();
        });
    }
    
    //The function that creates the calendar
    $scope.createCalendar = function() {
        
        for(var time = new Date($scope.endDate).setHours(0,0,0); 
                time >= $scope.startDate.getTime(); 
                time -= 1000*60*60*24)
        {
            var index = $scope.calendar.length;
            $scope.calendar[index] = {
                timestamp : time,
                history : []
            };
            
            angular.forEach($scope.history, function(h, i) {
                var hdate = new Date(h.date.replace(" ", "T"));
                console.log(new Date(time), new Date(time + 1000*60*60*24), hdate, hdate.getTime() >= time, hdate.getTime() <= time + 1000*60*60*24);
                if(hdate.getTime() >= time && hdate.getTime() <= time + 1000*60*60*24)
                {
                    $scope.calendar[index].history[$scope.calendar[index].history.length] = h;
                }
            });
            console.log("BREAK");
        }
        
        console.log($scope.calendar);
    }
    
    //Loads more entries by moving the time limits and fetching history again
    $scope.loadMore = function() {
        $scope.endDate = new Date($scope.startDate.getTime() - 1000);
        $scope.startDate = new Date($scope.startDate.getTime() - 7*24*60*60*1000);
        $scope.loadHistory();
    }
    
    fetchUser().then(function(){
        $scope.loadHistory();
    });
}]);
