var achieveApi = angular.module('achieveApi',['ngResource']);

var routeConfig = {
    list : {
        method : 'GET', params : {
            action : 'list'
        }
    },
    view : {
        method : 'GET' , params : {
            action : 'view'
        }
    },
    simple : {
        method : 'GET', params : {
            action : 'simple'
        }
    },
    create : {
        method : 'POST'
    },
    update : {
        method : 'PUT'
    },
    remove : {
        method : 'DELETE'  
    }
};

var nodes = {
    Categories : {
        path : 'categories',
        actions : ['list', 'view', 'simple', 'create', 'update', 'delete']
    },
    CategoriesLang : {
        path : 'categories/lang',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    Achievements : {
        path : 'achievements',
        actions : ['list', 'view', 'simple', 'create', 'update', 'delete']
    },
    AchievementLang : {
        path : 'achievements/lang',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    AchievementLevels : {
        path : 'achievements/levels',
        actions : ['list', 'view', 'simple', 'create', 'update', 'delete']
    },
    AchievementLevelsLang : {
        path : 'achievements/levels/lang',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    AchievementTypes : {
        path : 'achievements/types',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    AchievementTypesLang : {
        path : 'achievements/types/lang',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    Favourites : {
        path : 'favourites',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    History : {
        path : 'history',
        actions : ['list', 'create', 'update', 'delete']
    },
    RouteAccess : {
        path : 'route/access',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    Tasks : {
        path : 'tasks',
        actions : ['list', 'view', 'simple', 'create', 'update', 'delete']
    },
    TasksLang : {
        path : 'tasks/lang',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    UserAchievements : {
        path : 'user/achievements',
        actions : ['list', 'create', 'update', 'delete']
    },
    UserGroups : {
        path : 'user/groups',
        actions : ['list', 'view', 'create', 'update', 'delete']
    },
    Users : {
        path : 'users',
        actions : ['list', 'view', 'simple', 'create', 'update', 'delete']
    },
    Token : {
        path : 'token',
        actions : ['view']
    }
};

angular.forEach(nodes, function(node, lable){
    var methods = {};
    
    angular.forEach(node.actions, function(action, i){
       if(typeof routeConfig[action] != 'undefined')
           methods[action] = routeConfig[action];
    });
    
    achieveApi.factory(lable, ['$resource',
        function($resource){
            return $resource('../api/public/index.php/' + node.path + '/:action', {}, methods);
    }]);
});



  


