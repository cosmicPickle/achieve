var categoryControllers = angular.module('categoryControllers', ['pascalprecht.translate']);

categoryControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('category');
}]);

categoryControllers.controller('CategoryMainCtrl', 
['$rootScope', '$scope', '$q', '$location', '$stateParams', '$translatePartialLoader', '$translate', 'Categories', 'Achievements', 'Tasks', 'base64',
  function ($rootScope, $scope, $q, $location, $stateParams, $translatePartialLoader, $translate, Categories, Achievements, Tasks, base64) {
      
        //If this is the personal or categories listing
        $scope.listType = $location.path().split('/')[1];
        
        if($scope.listType == 'personal')
            //Reseting header styles
            $rootScope.headerCss = $rootScope.defaultHeaderCss;
        
        //The category alias
        $scope.catAlias = $stateParams.catAlias;
        
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

        //If this is a personal listing setting the title of the page
        if($scope.listType == 'personal')
            $scope.title = $translate.instant('personalTitle');
        else
            //Setting the dynamic title of the page
            $scope.$watch('category', function(category){
                if(category)
                {
                    $scope.imagesDir = achieveServerUrl + "resources/files/images/" 
                                  + (category.user_defined ? base64.encode($rootScope.currentUser.email) : 'system')
                                  + "/";

                    if(category.bg_image)
                        $rootScope.headerCss = {
                            background : "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(" + $scope.imagesDir + category.bg_image + ")",
                            color : '#ffffff'
                        }
                    else
                        $rootScope.headerCss = $rootScope.defaultHeaderCss;
                }
                
                $translate('categoryTitle', {
                    title : ((angular.isDefined(category.locale) && angular.isDefined(category.locale[0]) && category.locale[0].title) || category.title),
                    type : $translate.instant($scope.listType)
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
                //If this is a personal listing we do not need categories. Resolve immediatelly.
                if($scope.listType == 'personal')
                {
                    resolve('');
                    return;
                }
                
                //If we dont have a category catAlias defined we need to fetch the 
                //top category
                var method = $stateParams.catAlias ? 'simple' : 'list';
                var params = $stateParams.catAlias ? {alias : $stateParams.catAlias} : {};

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
            
            if($scope.listType == 'categories' || $scope.listType == 'favourites')
            {
                //Fetch the child categories if this isn't a personal listing
                Categories.list({parent : $scope.category.id}, function(resp){
                    if(resp.status == 0)
                        $scope.errors = resp.errors;

                    if(resp.data && resp.data.Categories.length)
                        $scope.children = resp.data.Categories;
                });
                
                //Fetch achievements that aren't personal
                Achievements.list({category : $scope.category.id, notmy : 1}, function(resp){
                    
                    if(resp.data && resp.data.Achievements.length)
                        $scope.achievements = resp.data.Achievements;
                });
            }
            if($scope.listType == 'personal')
                Achievements.list({onlymy : 1}, function(resp){
                    if(resp.data && resp.data.Achievements.length)
                        $scope.achievements = resp.data.Achievements;
                });
        });
            
  }]);
  
categoryControllers.controller('FavouritesCtrl', 
['$scope', '$rootScope', 'Favourites',
  function ($scope, $rootScope, Favourites) {
        //Reseting header styles
        $rootScope.headerCss = $rootScope.defaultHeaderCss;
        
        //Contains any errors that come up
        $scope.errors = [];

        //Contains the favourite achievement of users
        $scope.favAchievements = [];
        
        //The current page of achievements being loaded
        $scope.pageAchv = 1;
        
        //Indicates if we need to show the "Load More" button for achievements
        $scope.loadMoreAchv = 1;
        
        //Contains the favourite tasks of users
        $scope.favTasks = [];
        
        //The current page of tasks being loaded
        $scope.pageTasks = 1;
        
        //Indicates if we need to show the "Load More" button for tasks
        $scope.loadMoreTasks = 1;
        
        $scope.loadMoreAchievements = function() {
            Favourites.list({achievement : 1, extended : 1, page : $scope.pageAchv}, function(resp){
                if(resp.data != null && resp.data.Favourites)
                    angular.forEach(resp.data.Favourites, function(fav, i){
                        $scope.favAchievements[$scope.favAchievements.length] = fav;
                    })
                if(resp.data == null || resp.data.ItemsNum < resp.data.itemsPerPage)
                    $scope.loadMoreAchv = 0;
            });   
            $scope.pageAchv ++;
        }
        
        $scope.loadMoreTasks = function() {
            Favourites.list({task : 1, extended : 1, page : $scope.pageTasks}, function(resp){
                if(resp.data != null && resp.data.Favourites)
                    angular.forEach(resp.data.Favourites, function(fav, i){
                        $scope.favTasks[$scope.favTasks.length] = fav;
                    })
                if(resp.data == null || resp.data.ItemsNum < resp.data.itemsPerPage)
                    $scope.loadMoreTasks = 0;
            });  
            $scope.pageTasks ++;
        }
        
        $scope.loadMoreAchievements();
        //$scope.loadMoreTasks();
  }]);

