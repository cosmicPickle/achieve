var personalControllers = angular.module('personalControllers', ['achieveApi']);

personalControllers.controller('PersonalMainCtrl', 
['$scope', '$rootScope', '$translatePartialLoader',
  function ($scope, $rootScope, $translatePartialLoader) {
      //Setting the translation configuration
       $translatePartialLoader.addPart('personal');
}]);
personalControllers.controller('PersonalCreateCtrl', 
['$scope', '$rootScope', '$routeParams', '$translatePartialLoader', '$cookies', '$location', '$route',
  function ($scope, $rootScope, $routeParams, $translatePartialLoader, $cookies, $location, $route) {
        
        //Setting the translation configuration
        $translatePartialLoader.addPart('personal');
        
        $scope.type = $routeParams.type;
        
        $scope.success = $routeParams.success;
        
        $scope.title = null;
        
        //The entity we are currently editing
        $scope.entity = null;
        
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
        
        //The ui-iconpicker prepends "fa fa-lg" to the icon. This is a model which
        //will be filtered to just the name of the icon
        $scope.iconModelRaw;

        $scope.$watch('iconModelRaw', function(icon){
            if(icon)
                $scope.formData.image = icon.replace('fa fa-lg ', '');
        });
        
        $scope.$watch('formData.image', function(icon){
            if(icon)
                $scope.iconModelRaw = 'fa fa-lg ' + icon; 
        });
        
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
        
        if(angular.isUndefined($scope.providers[$scope.type]))
            $location.path('personal');
        
        var injector = angular.injector(['ng', 'personalControllers']);
        var source = $scope.providers[$scope.type];
        var srcObject = injector.get(source);
            
        if($routeParams.id)
        {
            srcObject.simple({id : $routeParams.id},function(resp){
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
                        $route.updateParams({
                            success : 1
                        })
                    
                    $scope.$apply();
                });
            else
                srcObject.create($scope.formData, function(resp){
                    if(!resp.status)
                        $rootScope.errors = resp.errors;
                    else
                        $route.updateParams({
                            id : resp.data.insert_id,
                            success : 1
                        });
                    
                    $scope.$apply();
                })
        }
  }]);