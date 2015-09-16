var categoryControllers = angular.module('categoryControllers', ['pascalprecht.translate']);

categoryControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('category');
}]);

categoryControllers.controller('CategoryMainCtrl', 
['$rootScope', '$scope', '$q', '$location', '$stateParams', '$translatePartialLoader', '$translate', 'Categories', 'Achievements', 'Tasks',
  function ($rootScope, $scope, $q, $location, $stateParams, $translatePartialLoader, $translate, Categories, Achievements, Tasks) {
        //The type of listing
        $scope.listType = $location.path().split('/')[3];

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
                //If we dont have a category alias defined we need to fetch the 
                //top category
                var method = $stateParams.alias ? 'simple' : 'list';
                var params = $stateParams.alias ? {alias : $stateParams.alias} : {};

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
            if($scope.listType == 'achievements')
                Achievements.list({category : $scope.category.id}, function(resp){
                    
                    if(resp.data && resp.data.Achievements.length)
                        $scope.achievements = resp.data.Achievements;
                });
            
            if($scope.listType == 'tasks')
                Tasks.list({category : $scope.category.id}, function (resp){
                   
                    if(resp.status == 0)
                        $scope.errors = resp.errors;

                    if(resp.data && resp.data.Tasks.length)
                        $scope.tasks = resp.data.Tasks;
                });
        });
            
  }]);
  
categoryControllers.controller('FavouritesCtrl', 
['$scope', '$q', '$location', '$stateParams', '$translatePartialLoader', '$translate', 'Favourites',
  function ($scope, $q, $location, $stateParams, $translatePartialLoader, $translate, Favourites) {
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
        $scope.loadMoreTasks();
  }]);

