var taskControllers = angular.module('taskControllers', []);

taskControllers.controller('TaskMainCtrl', ['$scope', '$q', '$routeParams', 'Tasks', 'Favourites', 'Achievements',
    function ($scope, $q, $routeParams, Tasks, Favourites, Achievements) {
        
        //The errors will go here
        $scope.errors = [];
        
        //The current task
        $scope.task = {};
        
        //Is the task favourited or not by the user
        $scope.favourited = [];
        
        //The list of achievements you can get by doing this task
        $scope.achievements = [];
        
        
        //This is the promisefunction which loads the task first. All subsequent
        //calls depend on it.
        var fetchTask = function() {
            return $q(function(resolve, reject){
                Tasks.simple({alias : $routeParams.alias}, function(resp){
                    
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
            Favourites.list({task : $scope.task.id, user_id : -1}, function(resp){
                
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Favourites.length)
                    $scope.favourited = resp.data.Favourites[0];
            });
            
            //And achievements
            Achievements.list({task : $scope.task.id}, function(resp) {
               
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Achievements.length)
                    $scope.achievements = resp.data.Achievements[0];
                
            });
        });
    }]);
