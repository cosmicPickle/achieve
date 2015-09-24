var taskControllers = angular.module('taskControllers', ['pascalprecht.translate']);

taskControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('task');
}]);

taskControllers.controller('TaskTabsCtrl', 
['$scope','$stateParams', function ($scope, $stateParams) {
    $scope.alias = $stateParams.taskAlias;
}]);

taskControllers.controller('TaskMainCtrl', 
['$rootScope', '$scope', '$q', '$stateParams', '$translatePartialLoader', '$translate', '$sanitize', 'Tasks', 'Favourites', 'Achievements', 'History', 'base64',
    function ($rootScope, $scope, $q, $stateParams, $translatePartialLoader, $translate, $sanitize, Tasks, Favourites, Achievements, History, base64) {
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('task');
        
        //The errors will go here
        $scope.errors = [];
        
        //The current task
        $scope.task = null;
        
        //The row id from the favourites table if exists
        $scope.favouriteId = 0;
        
        //If the achievemnt has been favourited or not
        $scope.favourited = 0;
        
        //The icons for a favourite and not favourite achievements
        $scope.fvIcons = ['fa-heart-o', 'fa-heart'];
        
        //The list of achievements you can get by doing this task
        $scope.achievements = [];
        
        //Setting the dynamic title of the page
        $scope.$watch('task', function(task){
            if(!task)
                return;
            
            $scope.imagesDir = achieveServerUrl + "resources/files/images/" 
                                + (task.user_defined ? base64.encode($rootScope.currentUser.email) : 'system')
                                + "/";
                        
            $translate('taskTitle', {
                title : ((angular.isDefined(task.locale) && angular.isDefined(task.locale[0]) && task.locale[0].title) || task.title)
            }).then(function(taskTitle){
                $scope.title = taskTitle; 
                $rootScope.title = taskTitle;
            });
        });
        
         /**
         * A few helper functions follow
         * 
         */
        
        //Modifies the tasks's favourite status. Also makes a call to the backend
        //to update the info
        $scope.setFavourite = function() {
            var fav = + !$scope.favourited;
            
            if(fav)
                Favourites.create({
                    users_id : -1,
                    tasks_id : $scope.task.id,
                }, function(resp){
                    if(resp.status == 0)
                        $scope.errors = resp.errors;
                    else
                    {
                        $scope.favourited = fav;
                        $scope.favouriteId = resp.data.insert_id;
                    }
                })
            else if($scope.favouriteId)
                Favourites.delete({
                    id : $scope.favouriteId,
                }, function(resp){
                    if(resp.status == 0)
                        $scope.errors = resp.errors;
                    else
                    {
                        $scope.favourited = fav;
                        $scope.favouriteId = 0;
                    }
                })
        }
        
        //This is the promisefunction which loads the task first. All subsequent
        //calls depend on it.
        var fetchTask = function() {
            return $q(function(resolve, reject){
                Tasks.simple({alias : $stateParams.taskAlias}, function(resp){
                    
                    if(resp.status == 0)
                    {
                        reject('Status : 0')
                        $scope.errors = resp.errors;
                        return;
                    }
                    
                    if(!resp.data || !resp.data.Tasks.length)
                    {
                        //No task was returned
                        reject('Invalid Task');
                        $scope.errors = ['Invalid Task'];
                        return;
                    }
                    
                    resolve('');
                    $scope.task = resp.data.Tasks[0];
                });
            });
        };
        
        //Fetch task, then...
        fetchTask().then(function(){
           
            //Fetch favourites
            Favourites.list({task_id : $scope.task.id, user_id : -1}, function(resp){
                
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Favourites.length)
                {
                    $scope.favourited = 1;
                    $scope.favouriteId = resp.data.Favourites[0].id;
                }
            });
            
            //And achievements
            Achievements.list({task : $scope.task.id}, function(resp) {
               
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Achievements.length)
                    $scope.achievements = resp.data.Achievements;
                
            });
        });
    }]);
