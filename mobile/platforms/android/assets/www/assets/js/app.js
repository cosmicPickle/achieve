//Setting the server URL. This will be used across the app for server calls
var achieveServerUrl = "http://95.87.205.55/dev/achieve/v.0.0.2/api/"

var achieveApp = angular.module('achieveApp', [
    'ngSanitize',
    'ui.router',
    'achieveApi',
    'achieveArrays',
    'uiBaseDirectives',
    'angular-svg-round-progress',
    'ui.bootstrap',
    'pascalprecht.translate',
    'pageslide-directive',
    'categoryControllers',
    'achievementControllers',
    'utilsControllers']);

achieveApp.config(['$translateProvider', '$httpProvider', '$translatePartialLoaderProvider', '$stateProvider', '$urlRouterProvider', function($translateProvider, $httpProvider, $translatePartialLoaderProvider, $stateProvider, $urlRouterProvider) {
    // For any unmatched url, redirect to /state1
    $urlRouterProvider.otherwise("/list/category/");
    // Now set up the states
    $stateProvider
        .state('landing', {
            url: '/landing',
            templateUrl: "assets/views/partials/landing.html",
            controller : "LandingCtrl"
        })
        .state('list', {
            url: "/list",
            abstract: true,
            templateUrl: "assets/views/partials/list-tabs.html",
        })
        .state('list.category', {
            url: "/category/:catAlias",
            templateUrl: "assets/views/partials/category.html",
            controller: "CategoryMainCtrl"
        })
        .state('list.category.achievement', {
            url: "/:achvAlias",
            templateUrl: "assets/views/partials/achievement.html",
            controller: "AchievementMainCtrl"
        })
        .state('list.favourites', {
            url: "/favourites",
            templateUrl: "assets/views/partials/favourites.html",
            controller: "FavouritesCtrl"
        })
        .state('list.favourites.achievement', {
            url: "/:achvAlias",
            templateUrl: "assets/views/partials/achievement.html",
            controller: "AchievementMainCtrl"
        });
   
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'assets/lang/{lang}/{part}.json'
    });
    
    $translateProvider.preferredLanguage('en');
    $translatePartialLoaderProvider.addPart('ui-base');
    
    //Running the state config
    
    //Uncomment the following lines to allow cross domain requests. This will mainly
    //be used for the mobile version in order to allow remote requests to the API
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];

    //Registering the response interceptor to redirect to login if we get a request 
    //that is unouthorized
    $httpProvider.interceptors.push(['$q', '$rootScope', '$injector', function($q, $rootScope, $injector) {
        return {
            'request': function (config) {
                $rootScope.httpLoading = true;
                return config || $q.when(config);
            },
            'requestError': function (rejection) {
                $rootScope.http = $rootScope.http || $injector.get('$http');
                if ($rootScope.http.pendingRequests.length < 1) {
                    $rootScope.httpLoading = false;
                }
                return $q.reject(rejection);
            },
            'response' : function(response) {
                if(response.data.status == -1)
                {
                    $injector.get('$state').go('landing');
                }
                if(response.data.status == 0)
                {
                    $rootScope.errors = response.data.errors;
                }
                
                $rootScope.http = $rootScope.http || $injector.get('$http');
                
                if ($rootScope.http.pendingRequests.length < 1) {
                    $rootScope.httpLoading = false;
                }
                
                return response || $q.when(response);
            },
            'responseError': function (rejection) {
                $rootScope.http = $rootScope.http || $injector.get('$http');
                
                if ($rootScope.http.pendingRequests.length < 1) {
                    $rootScope.httpLoading = false;
                }
                
                return $q.reject(rejection);
            }
        };
    }]);
}]).run(['$rootScope', '$modal', '$state', '$window', '$location', 'Token', function($rootScope, $modal, $state, $window, $location, Token){
    
    var anonArea = ['#/landing', '#/login'];
    
    $rootScope.$watch(function(){
        return $location.path();
    }, function(path){
        
        if(!path)
            return;
        
        if(anonArea.indexOf(path) < 0)
            Token.view({},function(resp){
                //It's really quite surprising how I managed to code most of this without 
                //having an idea who the user is in the frontend
                if(resp.status > 0)
                {
                    $rootScope.currentUser =  resp.data.user;
                }
            });
    });
    
    
    //This variable shows whether the client is using mobile. (Well actually it 
    //shows if the screen width is < 768)
    $rootScope.isMobile = false;
    
    //The window jQuery object
    var w = $($window);
    
    //We watch the window dimentions for change
    $rootScope.$watch(function(){
        return {
            h : w.height(),
            w : w.width()
        };
    }, function(window){
        //And modify the isMobile variable
        $rootScope.isMobile = window.w < 768; 
    }, true);
    
    w.bind('resize', function () {
        //We need to apply the resize event to angular
        $rootScope.$apply();
    });
    
    //The global errors are set here
    $rootScope.errors = [];
    //This is the errors modal instance
    $rootScope.errorsModal = {};
    
    //Whether there is an Http request loading
    $rootScope.httpLoading = 0;
    
    //Shows if the side menu is open
    $rootScope.sideMenuOpen = false;
    
    //The function that shows/hides the side menu
    $rootScope.toggleSideMenu = function() {
        $rootScope.sideMenuOpen = ! $rootScope.sideMenuOpen;
    };
    
    //Creates the function that sets an active tab
    $rootScope.setActiveState = function(toState) {
        
        if(($state.current.name.split('.')).indexOf(toState) > 0)
            return 'active';
        
        return '';
    };
    
    $rootScope.$watch('errors', function(errors){
        if(angular.isDefined(errors) && errors.length)
            $rootScope.openErrorsModal();
    });
    
    $rootScope.$watch('httpLoading', function(httpLoading){
        $rootScope.httpLoading = httpLoading;
    });
    
    //Opens up a modal with a date and time picker to input a new history
    $rootScope.openErrorsModal = function() {
        $rootScope.errorsModal = $modal.open({
            animation: true,
            templateUrl: 'assets/views/directives/errorsModal.html',
            scope : $rootScope,
            controller : ['$scope', function($scope) {
            }],
            resolve: {
            }
        });
    };

    //Dismisses a modal window
    $rootScope.dismissErrorsModal = function() {
        $rootScope.errors = [];
        $rootScope.errorsModal.dismiss('closed')
    };
    
    //Creating a history so we can have a nice back button
    $rootScope.history = [];
    $rootScope.$on('$stateChangeSuccess', function(event, currentRoute, previousRoute) {
        if(!previousRoute)
            return;
        
        var repeated = -1;
        if((repeated = $rootScope.history.indexOf($location.$$path)) < 0)
            $rootScope.history.push($location.$$path);
        else
            do
            {
                $rootScope.history.pop();
            }    
            while($rootScope.history.length - 1 > repeated)
    });
    
    $rootScope.goBack = function(def) {
        if($rootScope.history.length <= 1)
            $location.path(def);
        
        $location.path($rootScope.history[$rootScope.history.length - 2]);
    }
}]);