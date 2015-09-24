var personalControllers = angular.module('personalControllers', ['achieveApi', 'pascalprecht.translate']);

personalControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('personal');
}]);

personalControllers.controller('PersonalCreateQuickCtrl', 
['$scope', '$rootScope', '$q', '$stateParams', '$translate', '$ionicSlideBoxDelegate', '$ionicModal', 'Tasks', 'Achievements', 'AchievementLevels', 'base64',
  function ($scope, $rootScope, $q, $stateParams, $translate,  $ionicSlideBoxDelegate, $ionicModal, Tasks, Achievements, AchievementLevels, base64 ) {
      
        //Reseting header styles
        $rootScope.headerCss = $rootScope.defaultHeaderCss;
        
        $scope.achvTypeIds = {
            timed : 1,
            oneTime : 2,
            repeatable : 3
        };
        
        $scope.formData = {
            repetition : 15
        };
        
        $scope.formValidation = {
            0 : ['title'],
            1 : ['description'],
            2 : ['image'],
            3 : [],
            4 : ['color'],
            5 : ['achv_types_id'],
            6 : ['repetition']
        }
        
        $scope.firstSlide = true;
        $scope.lastSlide = false;

        $scope.$on('$ionicView.enter', function(){
            $ionicSlideBoxDelegate.enableSlide(false);
            
            $scope.slideChanged = function($index) {
                
                $scope.firstSlide = false;
                $scope.lastSlide = false;
                
                if($index == 0)
                    $scope.firstSlide = true;
                if($index == $ionicSlideBoxDelegate.slidesCount() - 1)
                    $scope.lastSlide = true;
            }
            
            $scope.slideValidate = function(){
                var slide = $ionicSlideBoxDelegate.currentIndex();
                var invalid = false;
                
                angular.forEach($scope.formValidation[slide], function(required){
                    if(!$scope.formData[required])
                        invalid = true;
                });
                
                if(invalid)
                    return false;
                
                return true;
            }
            
            $scope.nextSlide = function() {
                $ionicSlideBoxDelegate.next();
            }
            
            $scope.previousSlide = function() {
                $ionicSlideBoxDelegate.previous();
            }
            
            var genTask = function() {
                
                $scope.formData.alias = base64.encode($rootScope.currentUser.email + "_" + $scope.formData.title.toLowerCase().replace(/\s|\n|\t|-/g, "_") + "_" + moment().format('X'));
                
                var data = {
                    title : $scope.formData.title,
                    alias : $scope.formData.alias,
                    description : $scope.formData.description,
                    image : $scope.formData.image,
                    bg_image : $scope.formData.bg_image,
                    color : $scope.formData.color,
                    bg_color : "#f5f5f5", 
                }
                
               return $q(function(resolve, reject){
                    Tasks.create(data, function(resp){
                        if(!resp.status)
                            reject();
                        else
                            resolve(resp.data.insert_id)
                    });
               });
            }
            
            var genAchievement = function(taskId) {
                var data = {
                    tasks_id : taskId,
                    achv_types_id : $scope.formData.achv_types_id,
                    title : $scope.formData.title,
                    alias : $scope.formData.alias,
                    image : $scope.formData.image,
                    bg_image : $scope.formData.bg_image,
                    color : $scope.formData.color,
                    bg_color : "#f5f5f5",
                }
                
                return $q(function(resolve, reject){
                    Achievements.create(data, function(resp){
                        if(!resp.status)
                            reject();
                        else
                            resolve(resp.data.insert_id)
                    });
               });
            }
            
            var genLevels = function(achvId) {
                
                var promises = []
                var levelTimeframes = [0, 30, 60, 90, 180, 360, 540, 720];
                
                if($scope.achvTypeIds.oneTime != $scope.formData.achv_types_id)
                    for(var i = 1; i <= 8; i ++)
                    {
                        var data = {
                            achievements_id : achvId,
                            level_num : i,
                            repetition : levelTimeframes[i - 1]/30*$scope.formData.repetition,
                            alias : $scope.formData.alias + '_level_' + i,
                            title : $scope.formData.title + ": " + $translate.instant('level') + " " + i,
                            image : 'icon-level-' + i
                        };
                        
                        if($scope.achvTypeIds.timed == $scope.formData.achv_types_id)
                            data.timeframe = levelTimeframes[i - 1];
                        
                        promises[promises.length] = $q(function(resolve,reject){
                            AchievementLevels.create(data, function(resp){
                                if(!resp.status)
                                    reject();
                                else
                                    resolve(resp.data.insert_id)
                            });
                        });
                    }
                else
                {
                    for(var i = 1; i <= 2; i ++)
                    {
                        var data = {
                            achievements_id : achvId,
                            level_num : i,
                            repetition : (i == 2) ? 1 : 0,
                            alias : $scope.formData.alias + '_level_' + i,
                            title : $scope.formData.title + ": " + $translate.instant('level') + " " + i,
                            image : 'icon-level-' + ((i == 2) ? 8 : 1),
                        };
                        
                        promises[promises.length] = $q(function(resolve,reject){
                            AchievementLevels.create(data, function(resp){
                                if(!resp.status)
                                    reject();
                                else
                                    resolve(resp.data.insert_id)
                            });
                        });
                    }
                }
                
                return promises;
            }
            
            $scope.generate = function(){
                genTask().then(genAchievement).then(function(achvId) {
                    var promises = genLevels(achvId);
                    $q.all(promises).then(function(){
                        $ionicModal.fromTemplateUrl("okQuickCreateModal.html", {
                            scope: $scope
                        }).then(function(okModal) {
                            $scope.okModal = okModal;
                            $scope.openOkModal();
                        });

                        $scope.openOkModal = function() {
                            $scope.okModal.show();
                        };

                        $scope.closeOkModal = function() {
                            $scope.okModal.hide();
                        };

                    });
                });
            }
            
        });
}]);

personalControllers.controller('PersonalCreateCtrl', 
['$scope', '$rootScope', '$stateParams', '$cookies', '$translate', '$location', '$state', '$ionicModal', 'base64', 
  function ($scope, $rootScope, $stateParams, $cookies, $translate, $location, $state, $ionicModal, base64) {
      
        //Reseting header styles
        $rootScope.headerCss = $rootScope.defaultHeaderCss;
        
        $scope.type = $location.path().split('/')[3];
        
        $scope.success = false;
        
        $scope.title = null;
        
        //The entity we are currently editing
        $scope.entity = null;
        
        $scope.$watch('entity', function(entity){
            if(!entity)
                $translate($scope.type).then(function(type){
                    $translate('createPersonal', {
                        type : type
                    }).then(function(title){
                         $scope.title = title;
                    })
                })
            else
                $translate('editPersonal', {
                        title : (entity.locale[0] && entity.locale[0].title) || entity.title
                }).then(function(title){
                     $scope.title = title;
                });
        });
        
        //This is the configuration of available editable models. It maps a route
        //to provider
        $scope.providers = {
            category : 'Categories',
            task : 'Tasks',
            achievement : 'Achievements',
            level : 'AchievementLevels'
        };
        
        //We want a flowing creation process. The user creates a task, then they are
        //redirected to the achievement creation. This configuration is made here.
        //Also contains info about custom modals.
        $scope.nextSteps = {
            task : {
                nextType : 'achievement'
            },
            level : {
                customCreateModal : 'levelCreateModal.html',
                customEditModal : 'levelEditModal.html'
            }
        }
        
        //The form data that will be sent to server
        $scope.formData = {};
        
        //We check the state params for additional parameters which will join the 
        //formData
        $scope.typeParams = {
            achievement : {
                tasks_id : 'taskId',
            },
            level : {
                achievements_id : 'achvId'
            }
        };
        
        //The actual list of incoming stateParams
        $scope.actualParams = {};
        
        angular.forEach($scope.typeParams[$scope.type],function(param, index){
            if($stateParams[param])
            {
                $scope.formData[index] = $stateParams[param];
                $scope.actualParams[param] = $stateParams[param];
            }
        });
        
        //If the cookie contains information about the context we retrieve it and 
        //join it to the form data
        var context;
        if(context = $cookies.getObject('personalCreateContext'))
        {
            angular.extend($scope.formData, context);
            $cookies.remove('personalCreateContext');
        }
        
        //The modal select can return a whole object as well as just an Id. If we need
        //the whole object we can store it here
        $scope.selected = {};
        
        $scope.selectImage = function(image) {
            $scope.formData.image = image;
        }
        
        //Everything has an alias. Let's make it's generation automatic based on the title
        $scope.$watch('formData.title', function(title){
            if(!$scope.entity)
                if(title)
                    $scope.formData.alias = base64.encode($rootScope.currentUser.email + "_" + $scope.formData.title.toLowerCase().replace(/\s|\n|\t|-/g, "_") + "_" + moment().format('X'));
                else
                    $scope.formData.alias = "";
        });
        
        var injector = angular.injector(['ng', 'personalControllers']);
        var source = $scope.providers[$scope.type];
        var srcObject = injector.get(source);
            
        if($stateParams.id)
        {
            srcObject.simple({id : $stateParams.id},function(resp){
                if(!resp.status)
                    $rootScope.errors = resp.errors;
                
                if(resp.data && angular.isDefined(resp.data[source]) && resp.data[source].length)
                {
                    $scope.entity = resp.data[source][0];
                    angular.forEach(resp.data[source][0],function(v, i){
                        if(!angular.isObject(v) && i != 'created_at' && i != 'updated_at' && v != null)
                        {
                            $scope.formData[i] = angular.isNumber(v) ? parseInt(v).toString() : v;
                        }  
                    });
                    $scope.$apply();
                }
            });
        }
        
        $scope.save = function() {
            
            //After the users saves the entity they will be prompted with a modal. 
            //The configuration + open/close functions of the modal follow
            $scope.okModal;
            var modalName = !$scope.entity ? 
                            ($scope.nextSteps[$scope.type] && $scope.nextSteps[$scope.type].customCreateModal ? $scope.nextSteps[$scope.type].customCreateModal : 'okCreateModal.html') : 
                            ($scope.nextSteps[$scope.type] && $scope.nextSteps[$scope.type].customEditModal ? $scope.nextSteps[$scope.type].customEditModal : 'okSaveModal.html')
                    
            $ionicModal.fromTemplateUrl(modalName, {
                scope: $scope
            }).then(function(okModal) {
                $scope.okModal = okModal;
            });
            
            $scope.openOkModal = function() {
                $scope.okModal.show();
            };
            $scope.closeOkModal = function() {
                $scope.okModal.hide();
            };
            
            if($scope.entity)
                srcObject.update($scope.formData, function(resp){
                    if(!resp.status)
                        $rootScope.errors = resp.errors;
                    else
                    {
                        $scope.openOkModal();
                    }
                    $scope.$apply();
                });
            else
                srcObject.create($scope.formData, function(resp){
                    if(!resp.status)
                        $rootScope.errors = resp.errors;
                    else
                    {
                        $scope.formData.id = resp.data.insert_id;
                        $scope.openOkModal();
                    }
                    $scope.$apply();
                })
        }
  }]);