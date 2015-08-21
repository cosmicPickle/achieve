var achievementControllers = angular.module('achievementControllers', []);

achievementControllers.controller('AchievementMainCtrl', 
['$rootScope', '$scope', '$q', '$routeParams', '$modal', 'Favourites', 'Achievements', 'UserAchievements', 'History', 'objArr',
    function ($rootScope, $scope, $q, $routeParams, $modal, Favourites, Achievements, UserAchievements, History, objArr) {
        
        //Contains the errors
        $scope.errors = [];
        
        //The current achievement
        $scope.achievement = {};
        
        //Contains the colors of the achievement progressbar
        $scope.colors = {};
        
        //The row id from the favourites table if exists
        $scope.favouriteId = 0;
        
        //If the achievemnt has been favourited or not
        $scope.favourited = 0;
        
        //The icons for a favourite and not favourite achievements
        $scope.fvIcons = ['fa-heart-o', 'fa-heart'];

        
        //The levels earned by the user
        $scope.earnedLevels = [];
        
        //The current level the user is on
        $scope.currentLevel = {};
        
        //The next level. If they are the same the achievement is finished
        $scope.nextLevel = {};
        
        //Indicates if the user has finsihed the achievement
        $scope.finished = null;
        
        //The progress object it is calculated based on current achievement
        $scope.progress = {};
        
        //The number of history entries after the current level
        $scope.historyNum = 0;
        
        //The total number of repetitions needed for this achievement
        $scope.totalRepNum = 0;
        
        //The modal which pop's up in order to add a new history item
        $scope.historyModal = {};
        
        //Setting the dynamic title of the page
        $scope.$watch('achievement', function(achievement){
            $scope.title = "Achievement : " + achievement.title; 
            $rootScope.title = $scope.title;
        });
        
        //We need to watch the progress in order to go to a new level should the
        //progress reaches 100%
        $scope.$watch('progress', function(progress){
            
            if(!progress.current)
                return;
            
            if(progress.current != progress.max)
                return;
            
            
            fetchEarned();
            $scope.currentLevel = $scope.nextLevel;
            if($scope.currentLevel)
                $scope.nextLevel = objArr.search($scope.achievement.levels, 'level_num', $scope.currentLevel.level_num + 1);
            $scope.finished = !$scope.nextLevel
            
            $scope.historyNum = 0;
            
            if(!$scope.finished)
            {
                progress.current = 0;
                progress.max = $scope.currentLevel.repetition;
            }
            else
            {
                progress.current = 100;
                progress.max = 100;
            }
        });
        
        /**
         * A few helper functions follow
         * 
         */
        
        //Modifies the achievement's favourite status. Also makes a call to the backend
        //to update the info
        $scope.setFavourite = function() {
            var fav = + !$scope.favourited;
            
            if(fav)
                Favourites.create({
                    users_id : -1,
                    achievements_id : $scope.achievement.id,
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
        
        //Opens up a modal with a date and time picker to input a new history
        $scope.openHistoryModal = function() {
            if($scope.historyModal != {})
                $scope.historyModal = $modal.open({
                    animation: true,
                    templateUrl: 'assets/views/directives/add-history-modal.html',
                    scope : $scope,
                    controller : ['$scope', function($scope) {
                       //Setting the date model
                       $scope.dt = new Date();
                    }],
                    resolve: {
                      items: function () {
                        return $scope.items;
                      }
                    }
                });
        };
        
        //Dismisses a modal window
        $scope.dismissHistoryModal = function() {
            if($scope.historyModal == {})
                return;
            $scope.historyModal.dismiss('canceled')
        }
        
        //Saves a history entry and closes the modal
        $scope.saveHistory = function(dt) {
            //Converting to unix timestamp
            var unix = Math.floor(dt.getTime()/1000);
            
            //Adding entry to history
            History.create({
                users_id : -1,
                tasks_id : $scope.achievement.task.id,
                date : unix
            }, function(resp) {
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                else
                {
                    $scope.historyNum ++;
                    $scope.progress = {
                        current : $scope.progress.current + 1,
                        max : $scope.progress.max
                    };
                    $scope.historyModal.close();
                }
            });
            
        }
        
        //The promise that fetches the achievement
        var fetchAchievement = function() {
            return $q(function(resolve, reject){
                Achievements.simple({alias : $routeParams.alias}, function(resp) {
                    
                    if(resp.status == 0)
                    {
                        reject('Status : 0')
                        $scope.errors = resp.errors;
                        return;
                    }
                    
                    if(!resp.data || !resp.data.Achievements.length)
                    {
                        //No achievement was returned
                        reject('Invalid Achievement');
                        $scope.errors = ['Invalid Achievement'];
                        return;
                    }
                    
                    resolve('');
                    $scope.achievement = resp.data.Achievements[0];
                    $scope.colors = {
                        color : $scope.achievement.color || $scope.achievement.category.color,
                        bg_color : $scope.achievement.bg_color || $scope.achievement.category.bg_color
                    };
                });
            });
        };
        //The promise that fetches the earned achievements
        var fetchEarned = function(){
            return $q(function(resolve, reject){
                UserAchievements.list({achievement : $scope.achievement.id, user : -1}, function(resp) {

                    if(resp.status == 0)
                    {
                        reject('Status : 0')
                        $scope.errors = resp.errors;
                        return;
                    }

                    if(resp.data && resp.data.UserAchievements.length)
                    {
                        resolve('');
                        $scope.earnedLevels = resp.data.UserAchievements;
                    }
                    else
                    {
                        //No earned levels, but we still need to resolve this. 
                        //It just means the user hasn't earned anything on this
                        //achievement yet
                        resolve('');
                        return;
                    }    
                });
            });
        }
            
        fetchAchievement().then(function(){
           
            Favourites.list({achievement : $scope.achievement.id, user_id : -1}, function(resp){
                
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Favourites.length)
                {
                    $scope.favourited = 1;
                    $scope.favouriteId = resp.data.Favourites[0].id;
                }
                
            });
            
            //After we fetch the earned achievements we have everything to calculate
            //the progress
            fetchEarned().then(function(){
                
                //Getting the current level. It is the one with max level_num from
                //the earned levels
                if(!$scope.earnedLevels.length)
                {
                    //The user hasn't earned a level yet. The first level of each
                    //achievemenent has no requirements so we will insert that to
                    //them
                    $scope.currentLevel = objArr.min($scope.achievement.levels, 'level_num');
                    
                    //Inserting the new level
                    UserAchievements.create({
                        users_id : -1,
                        achievements_id : $scope.achievement.id,
                        achv_levels_id : $scope.currentLevel.id
                    },function(resp){
                        if(resp.status == 0)
                            $scope.errors = resp.errors;
                    });
                }
                else
                    $scope.currentLevel = objArr.max($scope.earnedLevels, 'level.level_num').level;
                
                //Getting the next level. It is the one with 
                //level_num = $scope.currentLevel.level_num + 1
                $scope.nextLevel = objArr.search($scope.achievement.levels, 'level_num', $scope.currentLevel.level_num + 1);
                
                //If we don't have a next level the achievement is finished
                $scope.finished = !$scope.nextLevel;
                
                //Next we need the total number of repetitions
                $scope.totalRepNum = objArr.sum($scope.achievement.levels, 'repetition');
                        
                //Next we need to calculate the user progress
                if($scope.finished)
                {
                    $scope.progress = {
                        current : $scope.currentLevel.repetition,
                        max : $scope.currentLevel.repetition
                    }
                }
                else
                {
                    //We need to get the history
                    if($scope.achievement.type.alias == 'one_time')
                    {
                        //This is a one time achievement. It is either done or not
                        //In this case not
                        $scope.progress = {
                            current : 0,
                            max : 1
                        }
                    }
                    if($scope.achievement.type.alias == 'timed')
                    {
                        //Need the timeframe of the achievement to be the timeframe of the next level minus the timeframe
                        //of the current one
                        var timeframe = ($scope.nextLevel.timeframe)*24*60*60;

                        History.list({
                            //Soft limit should be the timeframe allowed by the current achievement level. Unix timestamp
                            softLimit : timeframe,
                            //Hard limit should be the date of the last achieved level. String (as returned from the server)
                            hardLimit : objArr.max($scope.earnedLevels, 'level.level_num').created_at,
                            task : $scope.achievement.task.id, 
                            user : -1,
                            paginate: 0
                        },function(resp){
                            if(resp.status == 0)
                            {
                                //Let's hope we don't end up here, because it means something
                                //failed
                                $scope.errors = resp.errors;
                                $scope.progress = {
                                    current : 0,
                                    max : 0
                                }
                            }
                            else
                            {
                                //The current number of repetitions is the returnted history and the max
                                //is the next level requirement - the current level
                                $scope.progress = {
                                    current : resp.data.ItemsNum,
                                    max : $scope.nextLevel.repetition
                                }
                                
                                $scope.historyNum = resp.data.ItemsNum;
                            }
                        });
                    }
                    if($scope.achievement.type.alias == 'repetative')
                    {
                        History.list({
                            hardLimit : objArr.max($scope.earnedLevels, 'level.level_num').created_at, 
                            task : $scope.achievement.task.id, 
                            user : -1,
                            paginate: 0
                        },function(resp){
                            if(resp.status == 0)
                            {
                                //Let's hope we don't end up here, because it means something
                                //failed
                                $scope.errors = resp.errors;
                                $scope.progress = {
                                    current : 0,
                                    max : 0
                                }
                            }
                            else
                            {
                                //The current number of repetitions is the returnted history and the max
                                //is the next level requirement - the current level
                                $scope.progress = {
                                    current : resp.data.ItemsNum,
                                    max : $scope.nextLevel.repetition
                                }
                                
                                $scope.historyNum = resp.data.ItemsNum;
                            }
                        });
                    }
                }
                
            });
            
        });
    }]);

