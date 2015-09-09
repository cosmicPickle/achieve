var personalControllers = angular.module('personalControllers', []);

personalControllers.controller('PersonalCreateCtrl', 
['$scope', '$rootScope', '$translatePartialLoader', '$translate',
  function ($scope, $rootScope, $translatePartialLoader, $translate) {
        
        $scope.title = null;
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');

        //Contains any errors that come up
        $scope.errors = [];

        $translate('createPersonal').then(function(title){
            $scope.title = title;
            $rootScope.title = title;
        });
  }]);

personalControllers.controller('PersonalCategoryCreateCtrl', 
['$scope', '$rootScope', '$routeParams', '$translatePartialLoader', '$translate', '$sanitize', 'createWizard', 'Categories',
  function ($scope, $rootScope, $routeParams, $translatePartialLoader, $translate, $sanitize, createWizard, Categories) {
      
        $scope.title = null;
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');

        //Contains any errors that come up
        $scope.errors = [];
        
        //The type of what we are creating
        $scope.type = 'category';
        
        //The current step number (that the user will see)
        $scope.stepNum = 1;
        
        //The current parent in the category step
        $scope.parent = null;
        
        //The categories from the categories select step
        $scope.categories = null;

        //The ui-iconpicker prepends "fa fa-lg" to the icon. This is a model which
        //will be filtered to just the name of the icon
        $scope.iconModelRaw;
        
        //The form data that will be sent to server
        $scope.formData = {};
         
        
        $scope.$watch('iconModelRaw', function(icon){
            if(icon)
                $scope.formData.image = icon.replace('fa fa-lg', '');
        });

        //Goes to the previous step of the wizard
        $scope.previous = function() {
            if(createWizard.previous())
            {
                $scope.stepNum --;
                $translate('newCategory', {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }
        
        //Goes to the next step of the wizard
        $scope.next = function() {
            if(createWizard.next())
            {
                $scope.stepNum ++;
                $translate('newCategory', {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }

        //Changes the current parent category and loads all child categories
        $scope.changeParent = function(parent) {
            $scope.parent = parent;
            Categories.list({parent : parent.id}, function(resp) {
                if(angular.isDefined(resp.data) && resp.data.Categories.length)
                    $scope.categories = resp.data.Categories;
                else
                {
                    $translate('noChildCategories').then(function(noChildCategories){
                        $rootScope.errors = [noChildCategories];
                    })
                }
            });
        };
        
        //Selects the category
        $scope.selectCategory = function(category) {
            $scope.formData.parent_id = category.id;
            
            angular.forEach($scope.categories, function(c, i){
                c.selected = 0;
            });
            
            category.selected = 1;
        }
        
        //The onload and onsubmit functions for the wizard 
        var listCategory = function() {
            if($scope.categories != null)
                return;
            
            Categories.list({}, function(resp) {
               if(angular.isDefined(resp.data) && resp.data.Categories.length)
                   $scope.categories = resp.data.Categories;
            });
        }
        
        var saveCategory = function() {
            $scope.formData.user_defined = 1;
            $scope.formData.users_id = -1;
            
            Categories.create($scope.formData, function(resp){
                if(!resp.status)
                    $scope.previous();
            });
        }
        
        //The configuration for the wizard goes here
        $scope.wizardConfig = {
            category : {
                0 : {
                    alias : "select-category",
                    onload : listCategory
                },
                1 : {
                    alias : "details-category",
                    onsubmit : saveCategory
                },
                2 : {
                    alias : "done"
                }
            }
        };
        
        createWizard.init($scope.wizardConfig, $scope.type);
}]);


personalControllers.controller('PersonalTaskCreateCtrl', 
['$scope', '$rootScope', '$routeParams', '$translatePartialLoader', '$translate', '$sanitize', 'createWizard', 'Categories', 'Tasks',
  function ($scope, $rootScope, $routeParams, $translatePartialLoader, $translate, $sanitize, createWizard, Categories, Tasks) {
      
        $scope.title = null;
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');

        //Contains any errors that come up
        $scope.errors = [];
        
        //The type of what we are creating
        $scope.type = "task";
        
        //The current step number (that the user will see)
        $scope.stepNum = 1;
        
        //The current parent in the category step
        $scope.parent = null;
        
        //The categories from the categories select step
        $scope.categories = null;
        
        //The ui-iconpicker prepends "fa fa-lg" to the icon. This is a model which
        //will be filtered to just the name of the icon
        $scope.iconModelRaw;
        
        //The form data that will be sent to server
        $scope.formData = {};
         
        
        $scope.$watch('iconModelRaw', function(icon){
            if(icon)
                $scope.formData.image = icon.replace('fa fa-lg', '');
        });
        
        //Goes to the previous step of the wizard
        $scope.previous = function() {
            if(createWizard.previous())
            {
                $scope.stepNum --;
                $translate('newTask', {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }
        
        //Goes to the next step of the wizard
        $scope.next = function() {
            if(createWizard.next())
            {
                $scope.stepNum ++;
                $translate('newTask', {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }

        //Changes the current parent category and loads all child categories
        $scope.changeParent = function(parent) {
            $scope.parent = parent;
            Categories.list({parent : parent.id}, function(resp) {
                if(angular.isDefined(resp.data) && resp.data.Categories.length)
                    $scope.categories = resp.data.Categories;
                else
                {
                    $translate('noChildCategories').then(function(noChildCategories){
                        $rootScope.errors = [noChildCategories];
                    })
                }
            });
        }
        
        //Selects the category
        $scope.selectCategory = function(category) {
            $scope.formData.categories_id = category.id;
            
            angular.forEach($scope.categories, function(c, i){
                c.selected = 0;
            });
            
            category.selected = 1;
        }
        
        //The onload and onsubmit functions for the wizard 
        var listCategory = function() {
            if($scope.categories != null)
                return;
            
            Categories.list({}, function(resp) {
               if(angular.isDefined(resp.data) && resp.data.Categories.length)
                   $scope.categories = resp.data.Categories;
            });
        }
        
        var saveTask = function() {
            $scope.formData.user_defined = 1;
            $scope.formData.users_id = -1;
            
            Tasks.create($scope.formData, function(resp){
                if(!resp.status)
                    $scope.previous();
            });
        }
      
        //The configuration for the wizard goes here
        $scope.wizardConfig = {
            task : {
                0 : {
                    alias : "select-category",
                    onload : listCategory
                },
                1 : {
                    alias : "details-task",
                    onsubmit : saveTask
                },
                2 : {
                    alias : "done"
                }
            }
        };
        
        createWizard.init($scope.wizardConfig, $scope.type);
}]);


personalControllers.controller('PersonalAchievementCreateCtrl', 
['$scope', '$rootScope', '$routeParams', '$translatePartialLoader', '$translate', '$sanitize', 'createWizard', 'Tasks', 'Achievements', 'AchievementTypes',
  function ($scope, $rootScope, $routeParams, $translatePartialLoader, $translate, $sanitize, createWizard, Tasks, Achievements, AchievementTypes) {
      
        $scope.title = null;
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');

        //Contains any errors that come up
        $scope.errors = [];
        
        //The type of what we are creating
        $scope.type = 'achievement';
        
        //The current step number (that the user will see)
        $scope.stepNum = 1;
        
        //The tasks from the tasks select step
        $scope.tasks = null;
        
        //The available types of achievements
        $scope.achvTypes = null;
        
        //The ui-iconpicker prepends "fa fa-lg" to the icon. This is a model which
        //will be filtered to just the name of the icon
        $scope.iconModelRaw;
        
        //The form data that will be sent to server
        $scope.formData = {};
         
        
        $scope.$watch('iconModelRaw', function(icon){
            if(icon)
                $scope.formData.image = icon.replace('fa fa-lg', '');
        });

        //Goes to the previous step of the wizard
        $scope.previous = function() {
            if(createWizard.previous())
            {
                $scope.stepNum --;
                $translate('newAchievement', {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }
        
        //Goes to the next step of the wizard
        $scope.next = function() {
            if(createWizard.next())
            {
                $scope.stepNum ++;
                $translate('newAchievement' + $scope.type, {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                });
            }
        }
        
        //Selects the task
        $scope.selectTask = function(task) {
            $scope.formData.tasks_id = task.id
            $scope.formData.categories_id = task.category.id;
            
            angular.forEach($scope.tasks, function(t, i){
                t.selected = 0;
            });
            
            task.selected = 1;
        }
        
        var listTasks = function() {
            if($scope.tasks != null)
                return;
            
            Tasks.list({ onlymy : 1, withcategory : 1}, function(resp){
                if(angular.isDefined(resp.data) && resp.data.Tasks.length)
                   $scope.tasks = resp.data.Tasks;
            })
        }
        
        var loadAchvTypes = function() {
            if($scope.achvTypes != null)
                return;
            
            AchievementTypes.list({}, function(resp){
                if(angular.isDefined(resp.data) && resp.data.AchievementTypes.length)
                    $scope.achvTypes = resp.data.AchievementTypes;
            });
        }
        
        var saveAchievement = function() {
            $scope.formData.user_defined = 1;
            $scope.formData.users_id = -1;
            
            Achievements.create($scope.formData, function(resp){
                if(!resp.status)
                    $scope.previous();
            });
        }
        
        //The configuration for the wizard goes here
        $scope.wizardConfig = {
            achievement : {
                0 : {
                    alias : "select-task",
                    onload : listTasks
                },
                1 : {
                    alias : "details-achievement",
                    onload : loadAchvTypes,
                    onsubmit : saveAchievement
                },
                2 : {
                    alias : "done"
                }
            }
        };
        
        createWizard.init($scope.wizardConfig, $scope.type);
}]);


personalControllers.controller('PersonalLevelCreateCtrl', 
['$scope', '$rootScope', '$routeParams', '$translatePartialLoader', '$translate', '$sanitize', 'createWizard', 'Achievements', 'AchievementLevels',
  function ($scope, $rootScope, $routeParams, $translatePartialLoader, $translate, $sanitize, createWizard, Achievements, AchievementLevels) {
      
        $scope.title = null;
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');

        //Contains any errors that come up
        $scope.errors = [];
        
        //The type of what we are creating
        $scope.type = 'level';
        
        //The current step number (that the user will see)
        $scope.stepNum = 1;
        
        //The achievements from the select achievement step
        $scope.achievements = null;
        
        //The currently selected achievement
        $scope.selectedAchv = null;
        
        //The ui-iconpicker prepends "fa fa-lg" to the icon. This is a model which
        //will be filtered to just the name of the icon
        $scope.iconModelRaw;
        
        //The form data that will be sent to server
        $scope.formData = {};
         
        $scope.$watch('iconModelRaw', function(icon){
            if(icon)
                $scope.formData.image = icon.replace('fa fa-lg', '');
        });

        //Goes to the previous step of the wizard
        $scope.previous = function() {
            if(createWizard.previous())
            {
                $scope.stepNum --;
                $translate('newLevel', {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }
        
        //Goes to the next step of the wizard
        $scope.next = function() {
            if(createWizard.next())
            {
                $scope.stepNum ++;
                $translate('newLevel' + $scope.type, {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                });
            }
        }
        
        //Selects the task
        $scope.selectAchievement = function(achv) {
            $scope.formData.achievements_id = achv.id
            $scope.selectedAchv = achv;
            $scope.formData.level_num = achv.levels.length + 1;
            
            if(!achv.levels.length)
            {
                $scope.formData.repetition = 0;
                $scope.formData.timeframe = 0;
            }
            if(achv.type.alias != 'timed')
                $scope.formData.timeframe = 0;
            
            angular.forEach($scope.achievements, function(a, i){
                a.selected = 0;
            });
            
            achv.selected = 1;
        }
        
        var listAchievements = function() {
            if($scope.achievements != null)
                return;
            
            Achievements.list({ onlymy : 1, withcategory : 1, withlevels : 1, withtype : 1}, function(resp){
                if(angular.isDefined(resp.data) && resp.data.Achievements.length)
                   $scope.achievements = resp.data.Achievements;
            })
        }
        
        var saveAchievementLevels = function() {
            $scope.formData.user_defined = 1;
            $scope.formData.users_id = -1;
            
            AchievementLevels.create($scope.formData, function(resp){
                if(!resp.status)
                    $scope.previous();
            });
        }
        
        //The configuration for the wizard goes here
        $scope.wizardConfig = {
            level : {
                0 : {
                    alias : "select-achievement",
                    onload : listAchievements
                },
                1 : {
                    alias : "details-achievement",
                    onsubmit : saveAchievementLevels
                },
                2 : {
                    alias : "done"
                }
            }
        };
        
        createWizard.init($scope.wizardConfig, $scope.type);
}]);