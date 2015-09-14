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
            showLable : '@'
        },
        template : '<div class="list-item-title">' +
                   '<div ng-if="item.user_defined">' +
                   '<a class="list-item-a item-controls" ng-href="#/personal/create/{{type}}/{{item.id}}" tooltip="{{\'edit\' | translate}}"><i class="fa fa-edit"></i><span ng-if="showLable == 1">{{"edit" | translate}}</span></a>' + 
                   '<a class="list-item-a item-controls" ng-click="delete(item)" tooltip="{{\'delete\' | translate}}"><i class="fa fa-trash-o"></i><span ng-if="showLable == 1">{{"delete" | translate}}</span></a>' +
                   '</div></div>',
        controller : ['$scope', '$rootScope', '$modal', '$route', function($scope, $rootScope, $modal, $route){
                
            $scope.modalInstance = null;
            
            $scope.delete = function(item) {

                $scope.modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'assets/views/directives/deleteConfirmModal.html',
                    scope : $scope,
                    size : 'lg',
                    controller : ['$scope', function($scope) {
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
                            if($scope.modalInstance == {})
                                return;

                            $scope.modalInstance.dismiss('canceled')
                        }

                        $scope.confirmDelete = function() {
                            srcObject.delete({id : item.id}, function(resp){
                                if(!resp.status)
                                {
                                    $rootScope.errors = resp.errors;
                                    $scope.$apply();
                                    $scope.modalInstance.close();
                                    
                                }
                                else
                                    $route.reload();
                                
                            })
                        }
                    }]
                });
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
        template : '<i class="fa fa-check-square-o fa-2x add-task-history"' +
                    'tooltip-placement="top" tooltip="{{\'performTask\' | translate}}" ' +
                    'ng-style="{color : color}"' +
                    'ng-click="openHistoryModal()"></i>',
        controller : ['$scope',  '$modal', '$route',  'History', function($scope, $modal, $route, History){
            
            $scope.historyModal = null;
            
            //Opens up a modal with a date and time picker to input a new history
            $scope.openHistoryModal = function() {
                
                $scope.historyModal = $modal.open({
                    animation: true,
                    templateUrl: 'assets/views/directives/addHistoryModal.html',
                    scope : $scope,
                    controller : ['$scope', function($scope) {
                        $scope.$watch('task', function(task){
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
                       
                        //Dismisses a modal window
                        $scope.dismissHistoryModal = function() {
                            $scope.historyModal.dismiss('canceled')
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
                                    if($scope.$parent.$parent.$parent.historyNum)
                                        $scope.$parent.$parent.$parent.historyNum ++;

                                    if($scope.$parent.$parent.$parent.progress)
                                        $scope.$parent.$parent.$parent.progress = {
                                            current : $scope.$parent.$parent.$parent.progress.current + 1,
                                            max : $scope.$parent.$parent.$parent.progress.max
                                        };

                                    $scope.historyModal.close();
                                    
                                    if($scope.reload)
                                        $route.reload();
                                }
                            });

                        }
                    }]
                }); 
            };
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
            full : '@'
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
            var defColor = $(element).css('color');
            
            element.on('mouseenter', function(){
                $(element).finish();
                $(element).animate({
                   color : scope.color
                },100);
            });
            
            element.on('mouseleave', function(){
                $(element).finish();
                $(element).animate({
                   color : defColor
                },200);
            });
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
}).directive('stats', function(){
    return {
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : {
            items : '=',
            linkType : '@',
        },
        templateUrl : 'assets/views/directives/stats.html',
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