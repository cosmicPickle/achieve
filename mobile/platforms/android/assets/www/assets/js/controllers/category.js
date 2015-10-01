var categoryControllers = angular.module('categoryControllers', []);

categoryControllers.config(['$translatePartialLoaderProvider', function($translatePartialLoaderProvider) {
    $translatePartialLoaderProvider.addPart('category');
}]);

categoryControllers.controller('CategoryMainCtrl', 
['$rootScope', '$scope', '$q', '$location', '$stateParams', '$translate', 'Categories', 'Achievements',
  function ($rootScope, $scope, $q, $location, $stateParams, $translate, Categories, Achievements) {
      
        //Contains any errors that come up
        $scope.errors = [];

        //Contains the current category
        $scope.category = {};

        //Contains the children of the category
        $scope.children = [];
        
        //Contains the achievements that belong to this category
        $scope.achievements = [];
        
        //The directory that contains the images
        $scope.imagesDir = $scope.imagesDir = achieveServerUrl + "resources/files/images/system/";
        
        //A list of the achievements unlocked by this user
        $scope.userUnlocked = null;
        
        //Only the ids of the unlocked achievements for easier searching
        $scope.userUnlockedIds = null;
        $rootScope.$watch('currentUser', function(user){
            if(!user)
                return;

            $scope.userUnlocked = user.unlocked;
            $scope.userUnlockedIds = user.unlocked.map(function(val){
                return val.id;
            });
        });
        
        
        //Setting the dynamic title of the page
        $scope.$watch('category', function(category){
            $scope.title = $translate.instant('categoryTitle', {
                title : ((angular.isDefined(category.locale) && angular.isDefined(category.locale[0]) && category.locale[0].title) || category.title),
            });
            $rootScope.title = $scope.title;
        });
        
       
        //We need to load the category before loading the children. We are going 
        //to use Angular's $q for promises
        var fetchCategory = function() {
            
            //We construct the promise
            return $q(function(resolve, reject) {
                //If we dont have a category alias defined we need to fetch the 
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
            
            //Fetch the child categories
            Categories.list({parent : $scope.category.id}, function(resp){
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                
                if(resp.data && resp.data.Categories.length)
                    $scope.children = resp.data.Categories;
            });
            
            var params = {category : $scope.category.id};
            if($rootScope.currentUser.temporary)
                params['order[]'] = ['unlock_energy', 'asc'];

            //Fetch the achievements or tasks depending on the list type
            Achievements.list(params, function(resp){

                if(resp.data && resp.data.Achievements.length)
                    $scope.achievements = resp.data.Achievements;
            });
        });
            
  }]);
  
categoryControllers.controller('FavouritesCtrl', 
['$scope', '$rootScope', '$q', '$location', '$stateParams', '$translatePartialLoader', '$translate', 'Favourites',
  function ($scope, $rootScope, $q, $location, $stateParams, $translatePartialLoader, $translate, Favourites) {
      
        //Setting the translation configuration
        $translatePartialLoader.addPart('category');

        //Contains any errors that come up
        $scope.errors = [];

        //Contains the favourite achievement of users
        $scope.favourites = [];
        
        //The current page of achievements being loaded
        $scope.page = 1;
        
        //Indicates if we need to show the "Load More" button for achievements
        $scope.loadMore = 1;

        //The directory that contains the images
        $scope.imagesDir = $scope.imagesDir = achieveServerUrl + "resources/files/images/system/";
        
        //A list of the achievements unlocked by this user
        $scope.userUnlocked = null;
        
        //Only the ids of the unlocked achievements for easier searching
        $scope.userUnlockedIds = null;
        $rootScope.$watch('currentUser', function(user){
            if(!user)
                return;

            $scope.userUnlocked = user.unlocked;
            $scope.userUnlockedIds = user.unlocked.map(function(val){
                return val.id;
            });
        });
        
        $scope.loadMoreFavourites = function() {
            Favourites.list({achievement : 1, extended : 1, page : $scope.page}, function(resp){
                if(resp.data != null && resp.data.Favourites)
                    angular.forEach(resp.data.Favourites, function(fav, i){
                        $scope.favourites[$scope.favourites.length] = fav;
                    })
                if(resp.data == null || resp.data.ItemsNum < resp.data.itemsPerPage)
                    $scope.loadMore = 0;
            });   
            $scope.page ++;
        }
        
        $scope.loadMoreFavourites();
  }]);

