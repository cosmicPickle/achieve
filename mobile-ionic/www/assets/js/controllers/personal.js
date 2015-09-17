var personalControllers = angular.module('personalControllers', ['achieveApi', 'pascalprecht.translate']);

personalControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('personal');
}]);

personalControllers.controller('PersonalCreateCtrl', 
['$scope', '$rootScope', '$stateParams', '$translatePartialLoader', '$cookies', '$translate', '$location', '$state', '$ionicNavBarDelegate',
  function ($scope, $rootScope, $stateParams, $translatePartialLoader, $cookies, $translate, $location, $state, $ionicNavBarDelegate) {
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
                         $ionicNavBarDelegate.title(title);
                    })
                })
            else
                $translate('editPersonal', {
                        title : (entity.locale[0] && entity.locale[0].title) || entity.title
                }).then(function(title){
                     $scope.title = title;
                     $ionicNavBarDelegate.title(title);
                });
        });
        
        //The form data that will be sent to server
        $scope.formData = {};
        
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
            if(title)
                $scope.formData.alias = title.replace(/ /g, '_').toLowerCase(); 
            else
                $scope.formData.alias = "";
        });
        
        //This is the configuration of available editable models. It maps a route
        //to provider
        $scope.providers = {
            category : 'Categories',
            task : 'Tasks',
            achievement : 'Achievements',
            level : 'AchievementLevels'
        };
        
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
            
            if($scope.entity)
                srcObject.update($scope.formData, function(resp){
                    if(!resp.status)
                        $rootScope.errors = resp.errors;
                    else
                    {
                        $scope.success = true;
                        setTimeout(function(){
                           $scope.success = false;
                           $scope.$apply();
                        }, 3000);
                    }
                        
                    
                    $scope.$apply();
                });
            else
                srcObject.create($scope.formData, function(resp){
                    if(!resp.status)
                        $rootScope.errors = resp.errors;
                    else
                    {
                        $cookies.put('personalCreateSuccess', 1);
                        $state.go($state.$current, {
                            id : resp.data.insert_id,
                        }, {
                            reload : true,
                            notify: true
                        });
                    }
                    
                    $scope.$apply();
                })
        }
  }]);