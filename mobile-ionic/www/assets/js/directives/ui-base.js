var uiBaseDirectives = angular.module('uiBaseDirectives',[]);

uiBaseDirectives.directive('achvListItem', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            linkType : '@',
            type : '@',
            colorDefault : "="
        },
        templateUrl : 'assets/views/directives/listItem.html',
        link : function(scope, element, attr) {

            var color = (scope.item && scope.item.color) || scope.colorDefault;
            var defColor = $(element).css('color');

            element.on('mouseenter', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : color || defColor
                },100);
            });

            element.on('mouseleave', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : defColor
                },200);
            });
        }
    } 
}).directive('achvItemControls', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            type : '=',
        },
        template : '<div class="item tabs tabs-secondary tabs-icon-left">' +
                    '<a class="tab-item" href="#/personal/create/{{type}}/{{item.id}}">' +
                        '<i class="icon ion-edit"></i>' +
                        '{{\'edit\' | translate}}' +
                    '</a>' + 
                    '<a class="tab-item" ng-click="delete(item)">' +
                        '<i class="icon ion-ios-trash"></i>' +
                        '{{\'delete\' | translate}}' +
                    '</a></div>',
        controller : ['$scope', '$rootScope', '$ionicModal', '$state', function($scope, $rootScope, $ionicModal, $state){
                
            $scope.modalInstance = null;

            $ionicModal.fromTemplateUrl('assets/views/directives/deleteConfirmModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modalInstance = modal;
            });

            $scope.delete = function(item) {
                $scope.modalInstance.show();
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

                //Dismisses a modal window
                $scope.dismissModal = function() {
                    $scope.modalInstance.hide();
                }

                $scope.confirmDelete = function() {
                    
                    srcObject.delete({id : item.id}, function(resp){
                        if(!resp.status)
                        {
                            $rootScope.errors = resp.errors;
                            $scope.$apply();
                            $scope.modalInstance.hide();

                        }
                        else    
                        {
                            $state.go($state.$current, {}, {
                                reload : true,
                                notify: true
                            });
                            $scope.modalInstance.hide();
                        }

                    })
                }
            }
        }],
    } 
}).directive('achvPerformTask', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            task : '=',
            color : '=',
            bgColor : '=',
            initDate : '=',
            reload : '@'
        },
        template : '<a class="item item-icon item-icon-left" ng-click="openHistoryModal()">' +
                    '<i class="icon fa fa-check-square-o add-task-history"></i>{{\'performTask\' | translate}}</a>',
        controller : ['$scope',  '$ionicModal', '$route',  'History', function($scope, $ionicModal, $route, History){
                
            $scope.historyModal = null;
            $scope.initialTask = $scope.task;
            
            $ionicModal.fromTemplateUrl('assets/views/directives/addHistoryModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.historyModal = modal;
                //Opens up a modal with a date and time picker to input a new history
                $scope.openHistoryModal = function() {
                    $scope.historyModal.show();
                };

                $scope.$watch('task', function(task, old){
                    if(!task)
                        return;

                    $scope.color = task.color || task.category.color;
                    $scope.bg_color = task.bg_color || task.category.bg_color;
                });

                //Setting the date model
                if(!$scope.initDate)
                    $scope.dt = new Date();
                else
                    $scope.dt = new Date($scope.initDate);

                //Setting the max date
                $scope.maxDate = new Date();

                $scope.selectDate = function(val)
                {
                    $scope.dt = val;
                }
                
                $scope.selectTask = function(task)
                {
                    $scope.task = task;
                }
                //Dismisses a modal window
                $scope.dismissHistoryModal = function() {
                    $scope.historyModal.hide();
                }

                //Saves a history entry and closes the modal
                $scope.saveHistory = function(dt) {
                    //Converting to unix timestamp
                    var unix = moment(dt.getTime()).format('X');
                    //Adding entry to history
                    History.create({
                        users_id : -1,
                        tasks_id : $scope.task.id,
                        date : unix
                    }, function(resp) {
                        if(resp.status != 0)
                        {
                            if($scope.initialTask && $scope.task.id == $scope.initialTask.id)
                            {
                                if($scope.$parent.$parent.historyNum)
                                    $scope.$parent.$parent.historyNum ++;

                                if($scope.$parent.$parent.progress)
                                    $scope.$parent.$parent.progress = {
                                        current : $scope.$parent.$parent.progress.current + 1,
                                        max : $scope.$parent.$parent.progress.max
                                    };
                            }
                            $scope.historyModal.hide();

                            if($scope.reload)
                                $route.reload();
                        }
                    });

                }
            });
            
        }],
    } 
}).directive('achvAddNew', ['$cookies', function($cookies){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            data : '=',
            type : '@',
        },
        templateUrl : 'assets/views/directives/achvAddNew.html',
        link : function(scope, element, attr) {
            element.children('a').on('click',function(){
               $cookies.putObject('personalCreateContext', scope.data);
            });
        }
    } 
}]).directive('parseStyle', ["$interpolate", function($interpolate) {
    return function(scope, elem) {
        var exp = $interpolate(elem.html()),
            watchFunc = function () { return exp(scope); };

        scope.$watch(watchFunc, function (html) {
            elem.html(html);
        });
    };
}])
.directive('earned', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            color : '=',
            href : '@'
        },
        templateUrl : 'assets/views/directives/earned.html',
        link : function(scope, element, attr) {
        }
    } 
}).directive('profileNav', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            action : "=",
            uid : "="
        },
        templateUrl : 'assets/views/directives/profileNav.html',
        controller : ['$scope', '$location', function($scope, $location){
                //The profile actions
            $scope.actions = {
                general : {
                    title : 'general',
                    url : 'assets/views/partials/profileGeneral.html',
                    public : 1,
                },
                stats : {
                    title : 'stats',
                    url : 'assets/views/partials/profileStats.html',
                    public : 0,
                },
                history : {
                    title : 'history',
                    url : 'assets/views/partials/profileHistory.html',
                    public : 0,
                },
            } 

            //Determining whether all the actions wil be visible or not. If the user id 
            //is -1 it means we are looking at the current user. Then everething is visible.
            //If not only the public tabs are visible;
            angular.forEach($scope.actions, function(a, i){
               a.visible = + (a.public || (!a.public && $scope.uid == -1)); 
               a.active = + (a.visible && i == $scope.action);
            });

            //Modifies the route when the tab is changed
            $scope.changeAction = function(action, i) {

                if(i == $scope.action)
                    return; 

                var path = '/profile/' + i;
                if($scope.uid != -1)
                    path += "/" + $scope.uid;
                
                $location.path(path);
            }
        }]
    } 
}).directive('directiveGenerator', function($compile) {
    return {
        scope: {
            directive: '=',
            params: '='
        },
        link: function(scope, element) {
            
            var generatedTemplate = '<' + scope.directive + ' ';
            
            angular.forEach(scope.params, function(param, i){
                generatedTemplate += i + '="params.' + i + '" '
            })
            
            generatedTemplate += '></' + scope.directive + '>';
            element.append($compile(generatedTemplate)(scope));
        }
    };
})
.directive('statsItem', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            linkType : '=',
        },
        templateUrl : 'assets/views/directives/statsItem.html',
        controller : ['$scope', function($scope){
           $scope.link = '#/' + $scope.linkType + '/';
           $scope.title = '';
           $scope.image = '';
           $scope.colors = {
               color : '',
               bg_color : '',
           }
           
           if($scope.linkType == 'achievement')
           {
               $scope.link += $scope.item.achievement.alias;
               $scope.title = $scope.item.achievement.locale[0].title || $scope.item.achievement.title;
               $scope.image = $scope.item.achievement.image || 'fa-image';
               
               $scope.colors = {
                   color : $scope.item.achievement.color || $scope.item.achievement.category.color,
                   bg_color : $scope.item.achievement.bg_color || $scope.item.achievement.category.bg_color
               }
           }
           if($scope.linkType == 'category')
           {
               $scope.link += $scope.item.achievement.category.alias;
               $scope.title = (angular.isDefined($scope.item.achievement.category.locale[0]) && $scope.item.achievement.category.locale[0].title) || $scope.item.achievement.category.title;
               $scope.image = $scope.item.achievement.category.image || 'fa-image';
               
               $scope.colors = {
                   color : $scope.item.achievement.category.color,
                   bg_color : $scope.item.achievement.category.bg_color
               }
           }
           
           if($scope.linkType == 'task')
           {
               $scope.link += $scope.item.task.alias;
               $scope.title = ($scope.item.task.locale[0] && $scope.item.task.locale[0].title) || $scope.item.task.title;
               $scope.image = $scope.item.task.image || 'fa-image';
               
               $scope.colors = {
                   color : $scope.item.task.color || $scope.item.task.category.color,
                   bg_color : $scope.item.task.bg_color || $scope.item.task.category.bg_color
               }
           }
        }],
        link : function(scope, element, attr) {
            
            var defColor = $(element).css('color');
            
            element.on('mouseenter', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : scope.colors.color || defColor
                },100);
            });
            
            element.on('mouseleave', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : defColor
                },200);
            });
        }
    } 
}).directive('achvInclude', ['$compile', function($compile){
    return {
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : {
            src : '=',
        },
        controller : ['$scope', '$http', function($scope, $http){
            $http.get($scope.src).then(function(html){
                $scope.html = html.data;
            })
        }],
        link : function(scope, element, attrs) {
            scope.$watch('html', function(html){
                if(html)
                {
                    element.html(html);
                    $compile(element.contents())(scope.$parent);
                }
            })
        }
    };
}]);