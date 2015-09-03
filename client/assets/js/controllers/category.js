var categoryControllers = angular.module('categoryControllers', []);

categoryControllers.controller('CategoryMainCtrl', 
['$rootScope', '$scope', '$q', '$location', '$routeParams', '$translatePartialLoader', '$translate', 'Categories', 'Achievements', 'Tasks',
  function ($rootScope, $scope, $q, $location, $routeParams, $translatePartialLoader, $translate, Categories, Achievements, Tasks) {
      
        //Setting the translation configuration
        $translatePartialLoader.addPart('category');
        
        if($routeParams.type != 'achievements' && $routeParams.type != 'tasks')
            $location.path('/404');

        //The type of listing
        $scope.listType = $routeParams.type;
        
        //Contains any errors that come up
        $scope.errors = [];

        //Contains the current category
        $scope.category = {};

        //Contains the children of the category
        $scope.children = [];
        
        //Contains the achievements that belong to this category
        $scope.achievements = [];
        
        //Contains the tasks in this category
        $scope.tasks = [];
        
        //Setting the dynamic title of the page
        $scope.$watch('category', function(category){
            $translate('categoryTitle', {
                title : ((angular.isDefined(category.locale) && angular.isDefined(category.locale[0]) && category.locale[0].title) || category.title)
            }).then(function(categoryTitle){
                $scope.title = categoryTitle; 
                $rootScope.title = categoryTitle;
            });
        });
        
       
        //We need to load the category before loading the children. We are going 
        //to use Angular's $q for promises
        var fetchCategory = function() {
            //We construct the promise
            return $q(function(resolve, reject) {
                //If we dont have a category alias defined we need to fetch the 
                //top category
                var method = $routeParams.alias ? 'simple' : 'list';
                var params = $routeParams.alias ? {alias : $routeParams.alias} : {};
                
                //Trying to fetch the current category
                Categories[method](params, function(resp){
                    if(resp.status == 0)
                    {
                        //Something went wrong
                        reject('Status : 0');
                        $scope.errors = resp.errors;
                        return;
                    }
                    
                    if(!resp.data || !resp.data.Categories.length)
                    {
                        //No category was returned
                        $translate('invalidCategory').then(function(err){
                            $scope.errors = [err];
                            reject(err);
                        });
                        return;
                    }
                    
                    //Everything is ok. Resolving.
                    resolve('');
                    $scope.category = resp.data.Categories[0];
                });
            });
        };
        
        //Fetch category and then ... I don't even feel the need to write comments
        //any more
        fetchCategory().then(function(){
            
            //Fetch the child categories
            Categories.list({parent : $scope.category.id}, function(resp){
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Categories.length)
                    $scope.children = resp.data.Categories;
            });
            
            //Fetch the achievements or tasks depending on the list type
            if($routeParams.type == 'achievements')
                Achievements.list({category : $scope.category.id}, function(resp){

                    if(resp.status == 0)
                        $scope.errors = resp.errors;

                    if(resp.data && resp.data.Achievements.length)
                        $scope.achievements = resp.data.Achievements;
                });
            
            if($routeParams.type == 'tasks')
                Tasks.list({category : $scope.category.id}, function (resp){
                   
                    if(resp.status == 0)
                        $scope.errors = resp.errors;

                    if(resp.data && resp.data.Tasks.length)
                        $scope.tasks = resp.data.Tasks;
                });
        });
            
  }]);
