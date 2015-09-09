var personalControllers = angular.module('personalControllers', []);

personalControllers.controller('PersonalCreateCtrl', 
['$scope', '$q', '$location', '$rootScope', '$routeParams', '$translatePartialLoader', '$translate', 'createWizard', 'Categories', 'Tasks', 'Achievements', 'AchievementLevels',
  function ($scope, $q, $location, $rootScope, $routeParams, $translatePartialLoader, $translate, createWizard, Categories, Tasks, Achievements, AchievementLevels) {
      
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');

        //Contains any errors that come up
        $scope.errors = [];
        
        //The type of what we are creating
        $scope.type = 0;
        
        //The current step number (that the user will see)
        $scope.stepNum = 1;
        
        //The current parent in the category step
        $scope.parent = null;
        
        //The categories from the categories select step
        $scope.categories = null;
        
        //The tasks from the tasks select step
        $scope.tasks = null;
        
        //As the category we select will be used for parent_id in the category 
        //creation and for categories_id for achievements and task creation,
        //we can't save it directly to the form;
        $scope.selectedCategory;
        
        //The ui-iconpicker prepends "fa fa-lg" to the icon. This is a model which
        //will be filtered to just the name of the icon
        $scope.iconModelRaw;
        
        //The form data that will be sent to server
        $scope.formData = {};
         
        
        $scope.$watch('iconModelRaw', function(icon){
            if(icon)
                $scope.formData.image = icon.replace('fa fa-lg', '');
        })
        //Changes the type of the creation
        $scope.changeType = function(type) {
            $scope.type = type;
            
            //We have to set NULL to everything, we are starting over
            if(type == 0)
            {
                $scope.categories = null;
                $scope.tasks = null;
            }                
        }

        
        //Goes to the previous step of the wizard
        $scope.previous = function() {
            if(createWizard.previous())
            {
                $scope.stepNum --;
                $translate('new' + $scope.type, {
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
                $translate('new' + $scope.type, {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
        }
        
        //The list with categories from which the user will select
        $scope.categories = null;
        
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
            $scope.selectedCategory = category.id;
            
            angular.forEach($scope.categories, function(c, i){
                c.selected = 0;
            });
            
            category.selected = 1;
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
            $scope.formData.parent_id = $scope.selectedCategory;
            $scope.formData.user_defined = 1;
            $scope.formData.users_id = -1;
            
            Categories.create($scope.formData, function(resp){});
        }
        
        var saveTask = function() {
            $scope.formData.categories_id = $scope.selectedCategory;
            $scope.formData.user_defined = 1;
            $scope.formData.users_id = -1;
            
            Tasks.create($scope.formData, function(resp){});
        }
        
        var listTasks = function() {
            if($scope.tasks != null)
                return;
            
            Tasks.list({ onlymy : 1}, function(resp){
                if(angular.isDefined(resp.data) && resp.data.Tasks.length)
                   $scope.tasks = resp.data.Tasks;
            })
        }
        
        var saveAchievement = function() {
            
        }
        
        var saveLevels = function() {
            
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
            },
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
            },
            achievement : {
                0 : {
                    alias : "select-task",
                    onload : listTasks
                },
                1 : {
                    alias : "details-achievement",
                    onsubmit : saveAchievement
                },
                2 : {
                    alias : "done"
                }
            }
        };

        $scope.$watch('type', function(type){
            if($scope.type)
            {
                createWizard.init($scope.wizardConfig, $scope.type);
                
                //Let's set the title
                $translate('new' + $scope.type, {
                    step : $scope.stepNum
                }).then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
            }
            else
                $translate('createPersonal').then(function(title){
                    $scope.title = title;
                    $rootScope.title = title;
                })
        });
  }]);

