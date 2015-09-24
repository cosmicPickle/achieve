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
['$rootScope', '$scope', '$q', '$routeParams', '$route', '$translatePartialLoader', '$translate', 'Users', 'Statistics',
function ($rootScope, $scope, $q, $routeParams, $route, $translatePartialLoader, $translate, Users, Statistics) {
    
    //Setting the translation configuration
    $translatePartialLoader.addPart('profile');

    //Contains the errors
    $scope.errors = [];
    
    //The statistics about the achievements with most levels achieved
    $scope.achievementStats = [];
    
    //The statistics about the categories with most levels achieved
    $scope.categoryStats = [];
    
    //The statistics showing the tasks most completed in the last month
    $scope.taskStats = [];
    
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
    
    fetchUser().then(function(){
        Statistics.mostAchievements({ user : $scope.uid}, function(resp){
            if(angular.isDefined(resp.data.achievedLevels))
                $scope.achievementStats = resp.data.achievedLevels;
        });
        Statistics.mostCategories({ user : $scope.uid}, function(resp){
            if(angular.isDefined(resp.data.achievedLevels))
                $scope.categoryStats = resp.data.achievedLevels;
        });
        Statistics.mostTasks({ user : $scope.uid}, function(resp){
            if(angular.isDefined(resp.data.completedTasks))
                $scope.taskStats = resp.data.completedTasks;
        });
    })
    
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
    
    var now = moment();
    //Load history from the beggining of the month
    $scope.startDate = moment(now).startOf("month");
    //The upper limit will be the end of today
    $scope.endDate = moment(now).endOf("day");
    
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
        History.list({
            user : $scope.uid, 
            startDate : $scope.startDate.format('X'), 
            endDate : $scope.endDate.format('X'),
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
        
        var time = moment($scope.endDate).startOf('day');
        while(!time.isBefore($scope.startDate))
        {
            var index = $scope.calendar.length;
            $scope.calendar[index] = {
                timestamp : time.format('YYYY-MM-DDTHH:mm:ss'),
                date : time.format("DD ddd MM YYYY"),
                history : []
            };
            angular.forEach($scope.history, function(h, i) {
                var hdatem = moment(h.date.replace(" ", "T") + "+00:00");
                var start = moment(time);
                var end = moment(time).add(1, 'days');
                if(hdatem.isBetween(start, end) || hdatem.isSame(start) || hdatem.isSame(end))
                {
                    h.date = hdatem.format("YYYY-MM-DD HH:mm:SS");
                    $scope.calendar[index].history[$scope.calendar[index].history.length] = h;
                }
               
            });
            time = time.subtract(1, 'days');
        }
    }
    
    //Loads more entries by moving the time limits and fetching history again
    $scope.loadMore = function() {
        $scope.endDate = moment($scope.startDate).subtract(1, 'seconds');
        $scope.startDate = moment($scope.startDate).subtract(7, 'days');

        $scope.loadHistory();
    }
    
    fetchUser().then(function(){
        $scope.loadHistory();
    });
}]);
