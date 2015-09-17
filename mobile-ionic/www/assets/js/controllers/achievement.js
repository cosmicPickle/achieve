var achievementControllers = angular.module('achievementControllers', ['pascalprecht.translate']);

achievementControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('achievement');
}]);

achievementControllers.controller('AchievementTabsCtrl', 
['$scope','$stateParams', function ($scope, $stateParams) {
    $scope.alias = $stateParams.achvAlias;
}]);
        
achievementControllers.controller('AchievementMainCtrl', 
['$rootScope', '$scope', '$q', '$stateParams', '$modal', '$translatePartialLoader','$ionicPopover', '$translate', 'Favourites', 'Achievements', 'UserAchievements', 'History', 'objArr',
    function ($rootScope, $scope, $q, $stateParams, $modal, $translatePartialLoader, $ionicPopover, $translate, Favourites, Achievements, UserAchievements, History, objArr) {
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('achievement');
        
        $scope.catAlias = $stateParams.catAlias;
        
        $scope.achvAlias = $stateParams.achvAlias;
        
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
        
        //The total number of times the task has been completed for this achievement
        //across all levels (without the history from the last level)
        $scope.totalRepCurrent = 0;
        
        //The total number of repetitions needed for this achievement
        $scope.totalRepNum = 0;
        
        //Setting the dynamic title of the page
        $scope.$watch('achievement', function(achievement){
            $translate('achievementTitle', {
                title : ((angular.isDefined(achievement.locale) && angular.isDefined(achievement.locale[0]) && achievement.locale[0].title) || achievement.title)
            }).then(function(achievementTitle){
                $scope.title = achievementTitle; 
                $rootScope.title = achievementTitle;
            });
        });
        
        //setting the menu pop-over
        $ionicPopover.fromTemplateUrl('my-popover.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });


        $scope.openPopover = function($event) {
            $scope.popover.show($event);
        };
        $scope.closePopover = function() {
            $scope.popover.hide();
        };
  
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
        
        //The promise that fetches the achievement
        var fetchAchievement = function() {
            return $q(function(resolve, reject){
                Achievements.simple({alias : $stateParams.achvAlias}, function(resp) {
                    
                    if(resp.status == 0)
                    {
                        reject('Status : 0')
                        $scope.errors = resp.errors;
                        return;
                    }
                    
                    if(!resp.data || !resp.data.Achievements.length)
                    {
                        //No achievement was returned
                        $translate('invalidAchievement').then(function(err){
                            $scope.errors = [err];
                            reject(err);
                        });
                        return;
                    }
                    
                    resolve('');
                    $scope.achievement = resp.data.Achievements[0];
                    
                    //Setting the category to the task mainly for directives
                    $scope.achievement.task.category = $scope.achievement.category;
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
           
            Favourites.list({achievement_id : $scope.achievement.id, user_id : -1}, function(resp){
                
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
                
                if(!$scope.achievement.levels.length)
                {
                    $translate("noLevels").then(function(err){
                        $rootScope.errors = [err];
                    })
                    return;
                }
                //Getting the current level. It is the one with max level_num from
                //the earned levels
                if(!$scope.earnedLevels.length)
                {
                    //The user hasn't earned a level yet. The first level of each
                    //achievemenent has no requirements so we will insert that to
                    //them
                    $scope.currentLevel = objArr.min($scope.achievement.levels, 'level_num');
                    $scope.earnedLevels = [{
                        level : $scope.currentLevel,
                        created_at : moment().format("YYYY-MM-DD HH:mm:SS")
                    }];
                    //Inserting the new level
                    /**
                     * TODO : CREATE THE USER ACHIEVEMENT WITH A PROMISE
                     */
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
                
                //We need the number of reps completed across all levels (without the history from the last level)
                $scope.totalRepCurrent = objArr.sum($scope.earnedLevels,'level.repetition');
               
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
                        //Need the timeframe of the achievement. It shows the number of days,
                        //in which the user needs to complete the achievement
                        var timeframe = ($scope.nextLevel.timeframe)*24*60*60;
                        //The timestamp of the last achieved level
                        var lastAchievedTS = new Date(objArr.max($scope.earnedLevels, 'level.level_num').created_at.replace(" ", "T") + "+00:00").getTime();
                        //the MomentJS of the last achieved level
                        var lastAchieved = moment(lastAchievedTS);
                        
                        //We need the start date to be either now - the timeframe of the achievement,
                        //or the time of the last achieved level, whichever comes first
                        var start = moment().subtract(timeframe, 'days');
                        if(lastAchieved.isAfter(start))
                            start = lastAchieved;
                        
                        //The end is NOW!!!!
                        var end = moment();
                        
                        History.list({
                            startDate : start.format('X'),
                            endDate : end.format('X'),
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
                        if(objArr.max($scope.earnedLevels, 'level.level_num').created_at)
                            var start = moment(objArr.max($scope.earnedLevels, 'level.level_num').created_at);
                        
                        History.list({
                            startDate : start.format('X'), 
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

