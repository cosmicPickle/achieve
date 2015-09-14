var utilsControllers = angular.module('utilsControllers',[]);

utilsControllers.controller('AuthController', ['$scope', 'Token', function($scope, Token){
    Token.view();
}]);

utilsControllers.controller('LogoutController', ['$scope', '$cookies', '$route', 'Logout', function($scope, $cookies, $route, Logout){
    Logout.doLogout({}, function(resp){
        if(resp.status)
            window.location.reload();
    });
}]);

utilsControllers.controller('LocaleController', ['$scope', '$route', '$rootScope', '$translate', 'Locale','objArr' , function($scope, $route, $rootScope, $translate, Locale, objArr){
        
        //Monitoring the $routeScope for structure change in order to refresh the frontend translations
        $rootScope.$on('$translatePartialLoaderStructureChanged', function () {
            $translate.refresh();
        });
  
        //This is where we will store the locales
        $scope.locales = [];
        
        //We request the list of locales
        Locale.list({}, function(resp){
            if(resp.status == 0)
                $scope.errors = resp.errors;
            else
            {
                $scope.locales = resp.data.locales;
                //Setting up the frontend language
                $translate.use(objArr.search($scope.locales, 'active', 1).code);
            }
        });
        
        //This function is used to change the current locale
        $scope.changeLocale = function(locale){
            //We do not want to make redundant calls if the locale is already selected
            if($scope.locales[locale].active == 1)
                return;
            
            //Makes a call to change the locale at backend
            Locale.update({
                locale : locale
            }, function(resp){
                if(resp.status == 0)
                    $scope.errors = resp.errors;
                else
                {
                    //reloads the current route
                    $route.reload();
                    
                    //Refreshes the current active locale on frontend
                    angular.forEach($scope.locales,function(l, i){
                        l.active = 0;
                    });
                    $scope.locales[locale].active = 1;
                    
                    //Changing the fronend language handled by angular-translate
                    $translate.use(locale);
                }
            });
        };
}]);

utilsControllers.controller('NavigationController', ['$scope', '$route', '$translatePartialLoader', function($scope, $route, $translatePartialLoader){
        //Setting the translation configuration
        $translatePartialLoader.addPart('navigation');
        
        $scope.menu = {};
        $scope.toggleMenu = function(item) {
            var open = item.open;
            
            angular.forEach($scope.menu, function(r, i){
                r.open = 0;
            }); 
            
            item.open = !open;
        }

        angular.forEach($route.routes, function(r, i){
            if(r.menu)
            {
                if(!r.menu.items && r.menu.link && !angular.isDefined($scope.menu[r.menu.link]))
                    $scope.menu[r.menu.link] = {
                        lable : r.menu.lable,
                        icon : r.menu.icon,
                        link : r.menu.link
                    };

                if(r.menu.items && !r.menu.nested)
                    angular.extend($scope.menu, r.menu.items);

                var index = (i.substr(i.length - 1, i.length) == '/') ? i.substr(0, i.length - 1) : i
                if(r.menu.items && r.menu.nested && !angular.isDefined($scope.menu[index]))
                {
                    $scope.menu[index] = r.menu;
                    $scope.menu[index].open = 0;
                }
            }
        });
    
}]);