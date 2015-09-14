var uiInputDirectives = angular.module('uiInputDirectives',['achieveApi']);

uiInputDirectives.directive('achvInputSelect', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            dest : '=',
            source : '@',
            lable : '@'
        },
        templateUrl : 'assets/views/directives/achvInputSelect.html',
        controller : ['$scope', function($scope){

            var injector = angular.injector(['ng', 'uiInputDirectives']);
            var srcObject = injector.get($scope.source);
            $scope.items = [];

            srcObject.list({},function(resp){
                if(angular.isDefined(resp.data) && angular.isDefined(resp.data[$scope.source]))
                {
                    $scope.items = resp.data[$scope.source];
                    $scope.$apply();
                }
            });
        }]
    } 
}).directive('achvModalSelect', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            dest : '=',
            destObj : '=',
            source : '@',
            link : '@',
            deepSelect : '@',
            lable : '@',
            onlymy : '@'
        },
        templateUrl : 'assets/views/directives/achvModalSelect.html',
        controller : ['$scope', '$modal', '$translate', '$rootScope', function($scope, $modal, $translate, $rootScope){
                
            
            $scope.modalInstance = null;
            $scope.selection = [];
            $scope.parentSelection = [];
            
            $scope.selected = null;
            $scope.parentId = null;
            $scope.path = [];
            $scope.homogenous = 1;
            
            var injector = angular.injector(['ng', 'uiInputDirectives']);
            if($scope.source.split('.').length > 1)
            {
                if($scope.deepSelect != 0)
                {
                    $scope.homogenous = 0;
                    $scope.srcName = $scope.source.split('.')[1];
                    $scope.parentSrcName = $scope.source.split('.')[0];
                    var srcObject = injector.get($scope.srcName);
                    var parentSrcObject = injector.get($scope.parentSrcName);
                }
                else
                {
                    $scope.homogenous = 1;
                    $scope.srcName = $scope.source.split('.')[1];
                    $scope.parentSrcName = null;
                    var srcObject = injector.get($scope.srcName);
                    var parentSrcObject = null;
                }
            }
            else
            {
                $scope.srcName = $scope.source;
                $scope.parentSrcName = null;
                var srcObject = injector.get($scope.srcName);
                var parentSrcObject = null;
            }
            
            $scope.$watch('dest', function(dest) {
                if(dest)
                    srcObject.view({id : dest},function(resp){
                        if(resp.data && angular.isDefined(resp.data[$scope.srcName]) && resp.data[$scope.srcName].length)
                        {
                            $scope.selected = resp.data[$scope.srcName][0];
                            $scope.destObj = $scope.selected;
                        }
                        else
                            $rootScope.errors = resp.errors;
                        
                        $scope.$apply();
                    });
            })
            
            $scope.openModal = function() {
                if($scope.modalInstance == {})
                    return;
                
                $scope.modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'assets/views/directives/selectModal.html',
                    scope : $scope,
                    size : 'lg',
                    controller : ['$scope', function($scope) {
                        $scope.loadSelection = function() {
            
                            if($scope.deepSelect) {
                                
                                if($scope.homogenous)
                                    srcObject.list({parent : $scope.parentId, onlymy : $scope.onlymy},function(resp){
                                        if(angular.isDefined(resp.data) && angular.isDefined(resp.data[$scope.srcName]) && resp.data[$scope.srcName].length)
                                        {
                                            $scope.selection = resp.data[$scope.srcName];
                                            $scope.$apply();
                                        }
                                        else
                                        {
                                            $translate('noChildren').then(function(err) {
                                                $rootScope.errors = [err];
                                            });
                                            return;
                                        }
                                    });
                                else
                                {
                                    if($scope.parentId)
                                    {
                                        var data = {onlymy : $scope.onlymy};
                                        data[$scope.link] = $scope.parentId;

                                        srcObject.list(data ,function(resp){
                                            if(angular.isDefined(resp.data) && angular.isDefined(resp.data[$scope.srcName]))
                                            {
                                                $scope.selection = resp.data[$scope.srcName];
                                                $scope.$apply();
                                            }
                                        });
                                    }
                                    
                                    parentSrcObject.list({parent : $scope.parentId} ,function(resp){
                                        if(angular.isDefined(resp.data) && angular.isDefined(resp.data[$scope.parentSrcName]))
                                        {
                                            $scope.parentSelection = resp.data[$scope.parentSrcName];
                                            $scope.$apply();
                                        }
                                    });
                                }
                            }
                            else
                                srcObject.list({onlymy : $scope.onlymy},function(resp){
                                    if(angular.isDefined(resp.data) && angular.isDefined(resp.data[$scope.srcName]))
                                    {
                                        $scope.selection = resp.data[$scope.srcName];
                                        $scope.$apply();
                                    }
                                });
                        }  
                           
                        $scope.loadSelection();

                        //Dismisses a modal window
                        $scope.dismissModal = function() {
                            if($scope.modalInstance == {})
                                return;

                            $scope.modalInstance.dismiss('canceled')
                        }

                        $scope.selectItem = function(item) {
                            $scope.selected = item;
                            $scope.modalInstance.close($scope.selected);
                        }

                        $scope.childSelection = function(item, isSelection) {
                            if(!$scope.deepSelect)
                                return;
                            
                            if(isSelection && !$scope.homogenous)
                                return;
                            
                            $scope.path[$scope.path.length] = $scope.parentId;
                            $scope.parentId = angular.isDefined(item.id) ? item.id : null;
                            $scope.loadSelection();
                        }
                        
                        $scope.back = function() {
                            
                            $scope.parentId = $scope.path.pop();
                            $scope.loadSelection();
                        }
                    }],
                    resolve: {
                      selected: function () {
                        return $scope.selected;
                      }
                    }
                });
                
                $scope.modalInstance.result.then(function(selected){
                    $scope.selected = selected;
                    $scope.dest = selected.id;
                })
            };
        }]
    } 
})