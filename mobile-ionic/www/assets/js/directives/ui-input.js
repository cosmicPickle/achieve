var uiInputDirectives = angular.module('uiInputDirectives',['achieveApi']);

uiInputDirectives.directive('achvInputSelect', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            dest : '=',
            source : '@',
            lable : '@',
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
}).directive('achvInputRadio', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            dest : '=',
            source : '@',
            lable : '@',
        },
        templateUrl : 'assets/views/directives/achvInputRadio.html',
        controller : ['$scope', function($scope){
            
            $scope.select = function(val) {
                $scope.dest = val;
            }
            
            if(angular.isUndefined($scope.select))
                $scope.display = "select";
            
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
}).directive('textarea', function() {
  return {
    restrict: 'E',
    link: function(scope, element, attr){
        var update = function(){
            element.css("height", "auto");
            element.css("height", element[0].scrollHeight + "px");
        };
        scope.$watch(attr.ngModel, function(){
            update();
        });
    }
  };
}).directive('achvTimepicker', function() {
    return {
        restrict: 'E',
        templateUrl: 'assets/views/directives/achvTimepicker.html',
        scope : {
            seed : "=",
            hourStep : "=",
            minuteStep : "="
        },
        controller : ['$scope', function($scope){
            
            $scope.moment = null
            $scope.$watch('seed', function(seed){
                $scope.moment = moment(seed).format('ddd DD/MM/YYYY HH:mm:SS');
            }, true);
            
            $scope.stepUp = function(_set, current, step) {
                $scope.seed[_set](current + (step ? step : 1));
            };
            
            $scope.stepDown = function(_set, current, step) {   
                $scope.seed[_set](current - (step ? step : 1));
            };
        }]
    };
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
            onlymy : '@',
            callback : '='
        },
        templateUrl : 'assets/views/directives/achvModalSelect.html',
        controller : ['$scope', '$ionicModal', '$translate', '$rootScope', function($scope, $ionicModal, $translate, $rootScope){
                
            
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
                            if($scope.callback)
                                $scope.callback($scope.selected);
                        }
                        else
                            $rootScope.errors = resp.errors;
                        
                        $scope.$apply();
                    });
            });
            
            $scope.$watch('destObj', function(destObj){
                $scope.selected = destObj;
            });
            
            $ionicModal.fromTemplateUrl('assets/views/directives/selectModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modalInstance = modal;
            });
            
            $scope.openModal = function() {
                $scope.modalInstance.show();
            }

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
                $scope.modalInstance.hide()
            }

            $scope.selectItem = function(item) {
                $scope.selected = item;
                $scope.dest = item.id;
                
                $scope.modalInstance.hide();

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
        }]
    } 
})
.directive('achvInputImages', function() {
    return {
        restict : 'A',
        require : 'ngModel',
        scope : {
            callback : "=",
            imageCurrent : "="
        },
        controller : ['$scope', '$ionicModal', '$rootScope', '$translate', 'Files', 'base64', 'FileUploader', function($scope, $ionicModal, $rootScope, $translate, Files, base64, FileUploader){
            
            $scope.images = [];
            $scope.uploader = new FileUploader();
            $scope.uploader.url = achieveServerUrl + 'public/index.php/upload';
            $scope.uploader.autoUpload = true;
            $scope.uploader.onSuccessItem = function(item, resp, status, header) {
                
                if(!resp.status)
                {
                    $rootScope.errors = resp.errors;
                    return;
                }
                
                $scope.images.unshift(resp.data.uploaded_file);
                $scope.selectImage(resp.data.uploaded_file);
            }
            
            $scope.openUploadSelect = function() {
                $('#file-upload').trigger('click');
            };
            
            $ionicModal.fromTemplateUrl('assets/views/directives/imageModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modalInstance = modal;
            });
            
            $scope.openModal = function() {
                $scope.modalInstance.show();
                
                $rootScope.$watch('currentUser', function(currentUser){
                
                if(currentUser)
                    $scope.imagesDir = achieveServerUrl + "resources/files/images/" 
                                    + base64.encode(currentUser.email)
                                    + "/";
                });

                Files.list({}, function(resp){
                    if(resp.status)
                        $scope.images = resp.data.files;
                });
            };
            
            //Dismisses a modal window
            $scope.dismissModal = function() {
                $scope.modalInstance.hide();
            }

            $scope.selectImage = function(image) {
                $scope.modalInstance.hide();
                
                $scope.imageCurrent = image;
                if(image)
                {
                    $scope.imageCurrent = image.split('/');
                    $scope.imageCurrent = $scope.imageCurrent[$scope.imageCurrent.length - 1];
                }
                else
                   $scope.formData.bg_image_name = ""; 
               
                if($scope.callback)
                    $scope.callback(image);
            }
        }],
        link : function(scope, element, attrs, ngModelController) {
            scope.$watch('imageCurrent', function(image){
                if(image)
                    $(element).siblings('img').attr('src', scope.imagesDir + image);
            });
            
            
            element.on('click', function(){
                scope.openModal();
            });
        }
    }
})
.directive('achvInputIcons', function() {
    return {
        restict : 'A',
        transclude : true,
        require : 'ngModel',
        replace : true,
        scope : {
            callback : "=",
            iconCurrent : "="
        },
        controller : ['$scope', '$ionicModal', '$translate', function($scope, $ionicModal, $translate, ngModelController){

            $scope.iconSets = {
                 fa : {
                     lable : $translate.instant('fontAwesome'),
                     icons : ["fa-500px","fa-adjust","fa-adn","fa-align-center","fa-align-justify","fa-align-left","fa-align-right","fa-amazon","fa-ambulance","fa-anchor","fa-android","fa-angellist","fa-angle-double-down","fa-angle-double-left","fa-angle-double-right","fa-angle-double-up","fa-angle-down","fa-angle-left","fa-angle-right","fa-angle-up","fa-apple","fa-archive","fa-area-chart","fa-arrow-circle-down","fa-arrow-circle-left","fa-arrow-circle-o-down","fa-arrow-circle-o-left","fa-arrow-circle-o-right","fa-arrow-circle-o-up","fa-arrow-circle-right","fa-arrow-circle-up","fa-arrow-down","fa-arrow-left","fa-arrow-right","fa-arrow-up","fa-arrows","fa-arrows-alt","fa-arrows-h","fa-arrows-v","fa-asterisk","fa-at","fa-automobile","fa-backward","fa-balance-scale","fa-ban","fa-bank","fa-bar-chart","fa-bar-chart-o","fa-barcode","fa-bars","fa-battery-0","fa-battery-1","fa-battery-2","fa-battery-3","fa-battery-4","fa-battery-empty","fa-battery-full","fa-battery-half","fa-battery-quarter","fa-battery-three-quarters","fa-bed","fa-beer","fa-behance","fa-behance-square","fa-bell","fa-bell-o","fa-bell-slash","fa-bell-slash-o","fa-bicycle","fa-binoculars","fa-birthday-cake","fa-bitbucket","fa-bitbucket-square","fa-bitcoin","fa-black-tie","fa-bold","fa-bolt","fa-bomb","fa-book","fa-bookmark","fa-bookmark-o","fa-briefcase","fa-btc","fa-bug","fa-building","fa-building-o","fa-bullhorn","fa-bullseye","fa-bus","fa-buysellads","fa-cab","fa-calculator","fa-calendar","fa-calendar-check-o","fa-calendar-minus-o","fa-calendar-o","fa-calendar-plus-o","fa-calendar-times-o","fa-camera","fa-camera-retro","fa-car","fa-caret-down","fa-caret-left","fa-caret-right","fa-caret-square-o-down","fa-caret-square-o-left","fa-caret-square-o-right","fa-caret-square-o-up","fa-caret-up","fa-cart-arrow-down","fa-cart-plus","fa-cc","fa-cc-amex","fa-cc-diners-club","fa-cc-discover","fa-cc-jcb","fa-cc-mastercard","fa-cc-paypal","fa-cc-stripe","fa-cc-visa","fa-certificate","fa-chain","fa-chain-broken","fa-check","fa-check-circle","fa-check-circle-o","fa-check-square","fa-check-square-o","fa-chevron-circle-down","fa-chevron-circle-left","fa-chevron-circle-right","fa-chevron-circle-up","fa-chevron-down","fa-chevron-left","fa-chevron-right","fa-chevron-up","fa-child","fa-chrome","fa-circle","fa-circle-o","fa-circle-o-notch","fa-circle-thin","fa-clipboard","fa-clock-o","fa-clone","fa-close","fa-cloud","fa-cloud-download","fa-cloud-upload","fa-cny","fa-code","fa-code-fork","fa-codepen","fa-coffee","fa-cog","fa-cogs","fa-columns","fa-comment","fa-comment-o","fa-commenting","fa-commenting-o","fa-comments","fa-comments-o","fa-compass","fa-compress","fa-connectdevelop","fa-contao","fa-copy","fa-copyright","fa-creative-commons","fa-credit-card","fa-crop","fa-crosshairs","fa-css3","fa-cube","fa-cubes","fa-cut","fa-cutlery","fa-dashboard","fa-dashcube","fa-database","fa-dedent","fa-delicious","fa-desktop","fa-deviantart","fa-diamond","fa-digg","fa-dollar","fa-dot-circle-o","fa-download","fa-dribbble","fa-dropbox","fa-drupal","fa-edit","fa-eject","fa-ellipsis-h","fa-ellipsis-v","fa-empire","fa-envelope","fa-envelope-o","fa-envelope-square","fa-eraser","fa-eur","fa-euro","fa-exchange","fa-exclamation","fa-exclamation-circle","fa-exclamation-triangle","fa-expand","fa-expeditedssl","fa-external-link","fa-external-link-square","fa-eye","fa-eye-slash","fa-eyedropper","fa-facebook","fa-facebook-f","fa-facebook-official","fa-facebook-square","fa-fast-backward","fa-fast-forward","fa-fax","fa-feed","fa-female","fa-fighter-jet","fa-file","fa-file-archive-o","fa-file-audio-o","fa-file-code-o","fa-file-excel-o","fa-file-image-o","fa-file-movie-o","fa-file-o","fa-file-pdf-o","fa-file-photo-o","fa-file-picture-o","fa-file-powerpoint-o","fa-file-sound-o","fa-file-text","fa-file-text-o","fa-file-video-o","fa-file-word-o","fa-file-zip-o","fa-files-o","fa-film","fa-filter","fa-fire","fa-fire-extinguisher","fa-firefox","fa-flag","fa-flag-checkered","fa-flag-o","fa-flash","fa-flask","fa-flickr","fa-floppy-o","fa-folder","fa-folder-o","fa-folder-open","fa-folder-open-o","fa-font","fa-fonticons","fa-forumbee","fa-forward","fa-foursquare","fa-frown-o","fa-futbol-o","fa-gamepad","fa-gavel","fa-gbp","fa-ge","fa-gear","fa-gears","fa-genderless","fa-get-pocket","fa-gg","fa-gg-circle","fa-gift","fa-git","fa-git-square","fa-github","fa-github-alt","fa-github-square","fa-gittip","fa-glass","fa-globe","fa-google","fa-google-plus","fa-google-plus-square","fa-google-wallet","fa-graduation-cap","fa-gratipay","fa-group","fa-h-square","fa-hacker-news","fa-hand-grab-o","fa-hand-lizard-o","fa-hand-o-down","fa-hand-o-left","fa-hand-o-right","fa-hand-o-up","fa-hand-paper-o","fa-hand-peace-o","fa-hand-pointer-o","fa-hand-rock-o","fa-hand-scissors-o","fa-hand-spock-o","fa-hand-stop-o","fa-hdd-o","fa-header","fa-headphones","fa-heart","fa-heart-o","fa-heartbeat","fa-history","fa-home","fa-hospital-o","fa-hotel","fa-hourglass","fa-hourglass-1","fa-hourglass-2","fa-hourglass-3","fa-hourglass-end","fa-hourglass-half","fa-hourglass-o","fa-hourglass-start","fa-houzz","fa-html5","fa-i-cursor","fa-ils","fa-image","fa-inbox","fa-indent","fa-industry","fa-info","fa-info-circle","fa-inr","fa-instagram","fa-institution","fa-internet-explorer","fa-intersex","fa-ioxhost","fa-italic","fa-joomla","fa-jpy","fa-jsfiddle","fa-key","fa-keyboard-o","fa-krw","fa-language","fa-laptop","fa-lastfm","fa-lastfm-square","fa-leaf","fa-leanpub","fa-legal","fa-lemon-o","fa-level-down","fa-level-up","fa-life-bouy","fa-life-buoy","fa-life-ring","fa-life-saver","fa-lightbulb-o","fa-line-chart","fa-link","fa-linkedin","fa-linkedin-square","fa-linux","fa-list","fa-list-alt","fa-list-ol","fa-list-ul","fa-location-arrow","fa-lock","fa-long-arrow-down","fa-long-arrow-left","fa-long-arrow-right","fa-long-arrow-up","fa-magic","fa-magnet","fa-mail-forward","fa-mail-reply","fa-mail-reply-all","fa-male","fa-map","fa-map-marker","fa-map-o","fa-map-pin","fa-map-signs","fa-mars","fa-mars-double","fa-mars-stroke","fa-mars-stroke-h","fa-mars-stroke-v","fa-maxcdn","fa-meanpath","fa-medium","fa-medkit","fa-meh-o","fa-mercury","fa-microphone","fa-microphone-slash","fa-minus","fa-minus-circle","fa-minus-square","fa-minus-square-o","fa-mobile","fa-mobile-phone","fa-money","fa-moon-o","fa-mortar-board","fa-motorcycle","fa-mouse-pointer","fa-music","fa-navicon","fa-neuter","fa-newspaper-o","fa-object-group","fa-object-ungroup","fa-odnoklassniki","fa-odnoklassniki-square","fa-opencart","fa-openid","fa-opera","fa-optin-monster","fa-outdent","fa-pagelines","fa-paint-brush","fa-paper-plane","fa-paper-plane-o","fa-paperclip","fa-paragraph","fa-paste","fa-pause","fa-paw","fa-paypal","fa-pencil","fa-pencil-square","fa-pencil-square-o","fa-phone","fa-phone-square","fa-photo","fa-picture-o","fa-pie-chart","fa-pied-piper","fa-pied-piper-alt","fa-pinterest","fa-pinterest-p","fa-pinterest-square","fa-plane","fa-play","fa-play-circle","fa-play-circle-o","fa-plug","fa-plus","fa-plus-circle","fa-plus-square","fa-plus-square-o","fa-power-off","fa-print","fa-puzzle-piece","fa-qq","fa-qrcode","fa-question","fa-question-circle","fa-quote-left","fa-quote-right","fa-ra","fa-random","fa-rebel","fa-recycle","fa-reddit","fa-reddit-square","fa-refresh","fa-registered","fa-remove","fa-renren","fa-reorder","fa-repeat","fa-reply","fa-reply-all","fa-retweet","fa-rmb","fa-road","fa-rocket","fa-rotate-left","fa-rotate-right","fa-rouble","fa-rss","fa-rss-square","fa-rub","fa-ruble","fa-rupee","fa-safari","fa-save","fa-scissors","fa-search","fa-search-minus","fa-search-plus","fa-sellsy","fa-send","fa-send-o","fa-server","fa-share","fa-share-alt","fa-share-alt-square","fa-share-square","fa-share-square-o","fa-shekel","fa-sheqel","fa-shield","fa-ship","fa-shirtsinbulk","fa-shopping-cart","fa-sign-in","fa-sign-out","fa-signal","fa-simplybuilt","fa-sitemap","fa-skyatlas","fa-skype","fa-slack","fa-sliders","fa-slideshare","fa-smile-o","fa-soccer-ball-o","fa-sort","fa-sort-alpha-asc","fa-sort-alpha-desc","fa-sort-amount-asc","fa-sort-amount-desc","fa-sort-asc","fa-sort-desc","fa-sort-down","fa-sort-numeric-asc","fa-sort-numeric-desc","fa-sort-up","fa-soundcloud","fa-space-shuttle","fa-spinner","fa-spoon","fa-spotify","fa-square","fa-square-o","fa-stack-exchange","fa-stack-overflow","fa-star","fa-star-half","fa-star-half-empty","fa-star-half-full","fa-star-half-o","fa-star-o","fa-steam","fa-steam-square","fa-step-backward","fa-step-forward","fa-stethoscope","fa-sticky-note","fa-sticky-note-o","fa-stop","fa-street-view","fa-strikethrough","fa-stumbleupon","fa-stumbleupon-circle","fa-subscript","fa-subway","fa-suitcase","fa-sun-o","fa-superscript","fa-support","fa-table","fa-tablet","fa-tachometer","fa-tag","fa-tags","fa-tasks","fa-taxi","fa-television","fa-tencent-weibo","fa-terminal","fa-text-height","fa-text-width","fa-th","fa-th-large","fa-th-list","fa-thumb-tack","fa-thumbs-down","fa-thumbs-o-down","fa-thumbs-o-up","fa-thumbs-up","fa-ticket","fa-times","fa-times-circle","fa-times-circle-o","fa-tint","fa-toggle-down","fa-toggle-left","fa-toggle-off","fa-toggle-on","fa-toggle-right","fa-toggle-up","fa-trademark","fa-train","fa-transgender","fa-transgender-alt","fa-trash","fa-trash-o","fa-tree","fa-trello","fa-tripadvisor","fa-trophy","fa-truck","fa-try","fa-tty","fa-tumblr","fa-tumblr-square","fa-turkish-lira","fa-tv","fa-twitch","fa-twitter","fa-twitter-square","fa-umbrella","fa-underline","fa-undo","fa-university","fa-unlink","fa-unlock","fa-unlock-alt","fa-unsorted","fa-upload","fa-usd","fa-user","fa-user-md","fa-user-plus","fa-user-secret","fa-user-times","fa-users","fa-venus","fa-venus-double","fa-venus-mars","fa-viacoin","fa-video-camera","fa-vimeo","fa-vimeo-square","fa-vine","fa-vk","fa-volume-down","fa-volume-off","fa-volume-up","fa-warning","fa-wechat","fa-weibo","fa-weixin","fa-whatsapp","fa-wheelchair","fa-wifi","fa-wikipedia-w","fa-windows","fa-won","fa-wordpress","fa-wrench","fa-xing","fa-xing-square","fa-y-combinator","fa-y-combinator-square","fa-yahoo","fa-yc","fa-yc-square","fa-yelp","fa-yen","fa-youtube","fa-youtube-play","fa-youtube-square"]
                 },
                 ionic : {
                     lable : $translate.instant('ionicIcons'),
                     icons : ["ion-alert","ion-alert-circled","ion-android-add","ion-android-add-circle","ion-android-alarm-clock","ion-android-alert","ion-android-apps","ion-android-archive","ion-android-arrow-back","ion-android-arrow-down","ion-android-arrow-dropdown","ion-android-arrow-dropdown-circle","ion-android-arrow-dropleft","ion-android-arrow-dropleft-circle","ion-android-arrow-dropright","ion-android-arrow-dropright-circle","ion-android-arrow-dropup","ion-android-arrow-dropup-circle","ion-android-arrow-forward","ion-android-arrow-up","ion-android-attach","ion-android-bar","ion-android-bicycle","ion-android-boat","ion-android-bookmark","ion-android-bulb","ion-android-bus","ion-android-calendar","ion-android-call","ion-android-camera","ion-android-cancel","ion-android-car","ion-android-cart","ion-android-chat","ion-android-checkbox","ion-android-checkbox-blank","ion-android-checkbox-outline","ion-android-checkbox-outline-blank","ion-android-checkmark-circle","ion-android-clipboard","ion-android-close","ion-android-cloud","ion-android-cloud-circle","ion-android-cloud-done","ion-android-cloud-outline","ion-android-color-palette","ion-android-compass","ion-android-contact","ion-android-contacts","ion-android-contract","ion-android-create","ion-android-delete","ion-android-desktop","ion-android-document","ion-android-done","ion-android-done-all","ion-android-download","ion-android-drafts","ion-android-exit","ion-android-expand","ion-android-favorite","ion-android-favorite-outline","ion-android-film","ion-android-folder","ion-android-folder-open","ion-android-funnel","ion-android-globe","ion-android-hand","ion-android-hangout","ion-android-happy","ion-android-home","ion-android-image","ion-android-laptop","ion-android-list","ion-android-locate","ion-android-lock","ion-android-mail","ion-android-map","ion-android-menu","ion-android-microphone","ion-android-microphone-off","ion-android-more-horizontal","ion-android-more-vertical","ion-android-navigate","ion-android-notifications","ion-android-notifications-none","ion-android-notifications-off","ion-android-open","ion-android-options","ion-android-people","ion-android-person","ion-android-person-add","ion-android-phone-landscape","ion-android-phone-portrait","ion-android-pin","ion-android-plane","ion-android-playstore","ion-android-print","ion-android-radio-button-off","ion-android-radio-button-on","ion-android-refresh","ion-android-remove","ion-android-remove-circle","ion-android-restaurant","ion-android-sad","ion-android-search","ion-android-send","ion-android-settings","ion-android-share","ion-android-share-alt","ion-android-star","ion-android-star-half","ion-android-star-outline","ion-android-stopwatch","ion-android-subway","ion-android-sunny","ion-android-sync","ion-android-textsms","ion-android-time","ion-android-train","ion-android-unlock","ion-android-upload","ion-android-volume-down","ion-android-volume-mute","ion-android-volume-off","ion-android-volume-up","ion-android-walk","ion-android-warning","ion-android-watch","ion-android-wifi","ion-aperture","ion-archive","ion-arrow-down-a","ion-arrow-down-b","ion-arrow-down-c","ion-arrow-expand","ion-arrow-graph-down-left","ion-arrow-graph-down-right","ion-arrow-graph-up-left","ion-arrow-graph-up-right","ion-arrow-left-a","ion-arrow-left-b","ion-arrow-left-c","ion-arrow-move","ion-arrow-resize","ion-arrow-return-left","ion-arrow-return-right","ion-arrow-right-a","ion-arrow-right-b","ion-arrow-right-c","ion-arrow-shrink","ion-arrow-swap","ion-arrow-up-a","ion-arrow-up-b","ion-arrow-up-c","ion-asterisk","ion-at","ion-backspace","ion-backspace-outline","ion-bag","ion-battery-charging","ion-battery-empty","ion-battery-full","ion-battery-half","ion-battery-low","ion-beaker","ion-beer","ion-bluetooth","ion-bonfire","ion-bookmark","ion-bowtie","ion-briefcase","ion-bug","ion-calculator","ion-calendar","ion-camera","ion-card","ion-cash","ion-chatbox","ion-chatbox-working","ion-chatboxes","ion-chatbubble","ion-chatbubble-working","ion-chatbubbles","ion-checkmark","ion-checkmark-circled","ion-checkmark-round","ion-chevron-down","ion-chevron-left","ion-chevron-right","ion-chevron-up","ion-clipboard","ion-clock","ion-close","ion-close-circled","ion-close-round","ion-closed-captioning","ion-cloud","ion-code","ion-code-download","ion-code-working","ion-coffee","ion-compass","ion-compose","ion-connection-bars","ion-contrast","ion-crop","ion-cube","ion-disc","ion-document","ion-document-text","ion-drag","ion-earth","ion-easel","ion-edit","ion-egg","ion-eject","ion-email","ion-email-unread","ion-erlenmeyer-flask","ion-erlenmeyer-flask-bubbles","ion-eye","ion-eye-disabled","ion-female","ion-filing","ion-film-marker","ion-fireball","ion-flag","ion-flame","ion-flash","ion-flash-off","ion-folder","ion-fork","ion-fork-repo","ion-forward","ion-funnel","ion-gear-a","ion-gear-b","ion-grid","ion-hammer","ion-happy","ion-happy-outline","ion-headphone","ion-heart","ion-heart-broken","ion-help","ion-help-buoy","ion-help-circled","ion-home","ion-icecream","ion-image","ion-images","ion-information","ion-information-circled","ion-ionic","ion-ios-alarm","ion-ios-alarm-outline","ion-ios-albums","ion-ios-albums-outline","ion-ios-americanfootball","ion-ios-americanfootball-outline","ion-ios-analytics","ion-ios-analytics-outline","ion-ios-arrow-back","ion-ios-arrow-down","ion-ios-arrow-forward","ion-ios-arrow-left","ion-ios-arrow-right","ion-ios-arrow-thin-down","ion-ios-arrow-thin-left","ion-ios-arrow-thin-right","ion-ios-arrow-thin-up","ion-ios-arrow-up","ion-ios-at","ion-ios-at-outline","ion-ios-barcode","ion-ios-barcode-outline","ion-ios-baseball","ion-ios-baseball-outline","ion-ios-basketball","ion-ios-basketball-outline","ion-ios-bell","ion-ios-bell-outline","ion-ios-body","ion-ios-body-outline","ion-ios-bolt","ion-ios-bolt-outline","ion-ios-book","ion-ios-book-outline","ion-ios-bookmarks","ion-ios-bookmarks-outline","ion-ios-box","ion-ios-box-outline","ion-ios-briefcase","ion-ios-briefcase-outline","ion-ios-browsers","ion-ios-browsers-outline","ion-ios-calculator","ion-ios-calculator-outline","ion-ios-calendar","ion-ios-calendar-outline","ion-ios-camera","ion-ios-camera-outline","ion-ios-cart","ion-ios-cart-outline","ion-ios-chatboxes","ion-ios-chatboxes-outline","ion-ios-chatbubble","ion-ios-chatbubble-outline","ion-ios-checkmark","ion-ios-checkmark-empty","ion-ios-checkmark-outline","ion-ios-circle-filled","ion-ios-circle-outline","ion-ios-clock","ion-ios-clock-outline","ion-ios-close","ion-ios-close-empty","ion-ios-close-outline","ion-ios-cloud","ion-ios-cloud-download","ion-ios-cloud-download-outline","ion-ios-cloud-outline","ion-ios-cloud-upload","ion-ios-cloud-upload-outline","ion-ios-cloudy","ion-ios-cloudy-night","ion-ios-cloudy-night-outline","ion-ios-cloudy-outline","ion-ios-cog","ion-ios-cog-outline","ion-ios-color-filter","ion-ios-color-filter-outline","ion-ios-color-wand","ion-ios-color-wand-outline","ion-ios-compose","ion-ios-compose-outline","ion-ios-contact","ion-ios-contact-outline","ion-ios-copy","ion-ios-copy-outline","ion-ios-crop","ion-ios-crop-strong","ion-ios-download","ion-ios-download-outline","ion-ios-drag","ion-ios-email","ion-ios-email-outline","ion-ios-eye","ion-ios-eye-outline","ion-ios-fastforward","ion-ios-fastforward-outline","ion-ios-filing","ion-ios-filing-outline","ion-ios-film","ion-ios-film-outline","ion-ios-flag","ion-ios-flag-outline","ion-ios-flame","ion-ios-flame-outline","ion-ios-flask","ion-ios-flask-outline","ion-ios-flower","ion-ios-flower-outline","ion-ios-folder","ion-ios-folder-outline","ion-ios-football","ion-ios-football-outline","ion-ios-game-controller-a","ion-ios-game-controller-a-outline","ion-ios-game-controller-b","ion-ios-game-controller-b-outline","ion-ios-gear","ion-ios-gear-outline","ion-ios-glasses","ion-ios-glasses-outline","ion-ios-grid-view","ion-ios-grid-view-outline","ion-ios-heart","ion-ios-heart-outline","ion-ios-help","ion-ios-help-empty","ion-ios-help-outline","ion-ios-home","ion-ios-home-outline","ion-ios-infinite","ion-ios-infinite-outline","ion-ios-information","ion-ios-information-empty","ion-ios-information-outline","ion-ios-ionic-outline","ion-ios-keypad","ion-ios-keypad-outline","ion-ios-lightbulb","ion-ios-lightbulb-outline","ion-ios-list","ion-ios-list-outline","ion-ios-location","ion-ios-location-outline","ion-ios-locked","ion-ios-locked-outline","ion-ios-loop","ion-ios-loop-strong","ion-ios-medical","ion-ios-medical-outline","ion-ios-medkit","ion-ios-medkit-outline","ion-ios-mic","ion-ios-mic-off","ion-ios-mic-outline","ion-ios-minus","ion-ios-minus-empty","ion-ios-minus-outline","ion-ios-monitor","ion-ios-monitor-outline","ion-ios-moon","ion-ios-moon-outline","ion-ios-more","ion-ios-more-outline","ion-ios-musical-note","ion-ios-musical-notes","ion-ios-navigate","ion-ios-navigate-outline","ion-ios-nutrition","ion-ios-nutrition-outline","ion-ios-paper","ion-ios-paper-outline","ion-ios-paperplane","ion-ios-paperplane-outline","ion-ios-partlysunny","ion-ios-partlysunny-outline","ion-ios-pause","ion-ios-pause-outline","ion-ios-paw","ion-ios-paw-outline","ion-ios-people","ion-ios-people-outline","ion-ios-person","ion-ios-person-outline","ion-ios-personadd","ion-ios-personadd-outline","ion-ios-photos","ion-ios-photos-outline","ion-ios-pie","ion-ios-pie-outline","ion-ios-pint","ion-ios-pint-outline","ion-ios-play","ion-ios-play-outline","ion-ios-plus","ion-ios-plus-empty","ion-ios-plus-outline","ion-ios-pricetag","ion-ios-pricetag-outline","ion-ios-pricetags","ion-ios-pricetags-outline","ion-ios-printer","ion-ios-printer-outline","ion-ios-pulse","ion-ios-pulse-strong","ion-ios-rainy","ion-ios-rainy-outline","ion-ios-recording","ion-ios-recording-outline","ion-ios-redo","ion-ios-redo-outline","ion-ios-refresh","ion-ios-refresh-empty","ion-ios-refresh-outline","ion-ios-reload","ion-ios-reverse-camera","ion-ios-reverse-camera-outline","ion-ios-rewind","ion-ios-rewind-outline","ion-ios-rose","ion-ios-rose-outline","ion-ios-search","ion-ios-search-strong","ion-ios-settings","ion-ios-settings-strong","ion-ios-shuffle","ion-ios-shuffle-strong","ion-ios-skipbackward","ion-ios-skipbackward-outline","ion-ios-skipforward","ion-ios-skipforward-outline","ion-ios-snowy","ion-ios-speedometer","ion-ios-speedometer-outline","ion-ios-star","ion-ios-star-half","ion-ios-star-outline","ion-ios-stopwatch","ion-ios-stopwatch-outline","ion-ios-sunny","ion-ios-sunny-outline","ion-ios-telephone","ion-ios-telephone-outline","ion-ios-tennisball","ion-ios-tennisball-outline","ion-ios-thunderstorm","ion-ios-thunderstorm-outline","ion-ios-time","ion-ios-time-outline","ion-ios-timer","ion-ios-timer-outline","ion-ios-toggle","ion-ios-toggle-outline","ion-ios-trash","ion-ios-trash-outline","ion-ios-undo","ion-ios-undo-outline","ion-ios-unlocked","ion-ios-unlocked-outline","ion-ios-upload","ion-ios-upload-outline","ion-ios-videocam","ion-ios-videocam-outline","ion-ios-volume-high","ion-ios-volume-low","ion-ios-wineglass","ion-ios-wineglass-outline","ion-ios-world","ion-ios-world-outline","ion-ipad","ion-iphone","ion-ipod","ion-jet","ion-key","ion-knife","ion-laptop","ion-leaf","ion-levels","ion-lightbulb","ion-link","ion-load-a","ion-load-b","ion-load-c","ion-load-d","ion-location","ion-lock-combination","ion-locked","ion-log-in","ion-log-out","ion-loop","ion-magnet","ion-male","ion-man","ion-map","ion-medkit","ion-merge","ion-mic-a","ion-mic-b","ion-mic-c","ion-minus","ion-minus-circled","ion-minus-round","ion-model-s","ion-monitor","ion-more","ion-mouse","ion-music-note","ion-navicon","ion-navicon-round","ion-navigate","ion-network","ion-no-smoking","ion-nuclear","ion-outlet","ion-paintbrush","ion-paintbucket","ion-paper-airplane","ion-paperclip","ion-pause","ion-person","ion-person-add","ion-person-stalker","ion-pie-graph","ion-pin","ion-pinpoint","ion-pizza","ion-plane","ion-planet","ion-play","ion-playstation","ion-plus","ion-plus-circled","ion-plus-round","ion-podium","ion-pound","ion-power","ion-pricetag","ion-pricetags","ion-printer","ion-pull-request","ion-qr-scanner","ion-quote","ion-radio-waves","ion-record","ion-refresh","ion-reply","ion-reply-all","ion-ribbon-a","ion-ribbon-b","ion-sad","ion-sad-outline","ion-scissors","ion-search","ion-settings","ion-share","ion-shuffle","ion-skip-backward","ion-skip-forward","ion-social-android","ion-social-android-outline","ion-social-angular","ion-social-angular-outline","ion-social-apple","ion-social-apple-outline","ion-social-bitcoin","ion-social-bitcoin-outline","ion-social-buffer","ion-social-buffer-outline","ion-social-chrome","ion-social-chrome-outline","ion-social-codepen","ion-social-codepen-outline","ion-social-css3","ion-social-css3-outline","ion-social-designernews","ion-social-designernews-outline","ion-social-dribbble","ion-social-dribbble-outline","ion-social-dropbox","ion-social-dropbox-outline","ion-social-euro","ion-social-euro-outline","ion-social-facebook","ion-social-facebook-outline","ion-social-foursquare","ion-social-foursquare-outline","ion-social-freebsd-devil","ion-social-github","ion-social-github-outline","ion-social-google","ion-social-google-outline","ion-social-googleplus","ion-social-googleplus-outline","ion-social-hackernews","ion-social-hackernews-outline","ion-social-html5","ion-social-html5-outline","ion-social-instagram","ion-social-instagram-outline","ion-social-javascript","ion-social-javascript-outline","ion-social-linkedin","ion-social-linkedin-outline","ion-social-markdown","ion-social-nodejs","ion-social-octocat","ion-social-pinterest","ion-social-pinterest-outline","ion-social-python","ion-social-reddit","ion-social-reddit-outline","ion-social-rss","ion-social-rss-outline","ion-social-sass","ion-social-skype","ion-social-skype-outline","ion-social-snapchat","ion-social-snapchat-outline","ion-social-tumblr","ion-social-tumblr-outline","ion-social-tux","ion-social-twitch","ion-social-twitch-outline","ion-social-twitter","ion-social-twitter-outline","ion-social-usd","ion-social-usd-outline","ion-social-vimeo","ion-social-vimeo-outline","ion-social-whatsapp","ion-social-whatsapp-outline","ion-social-windows","ion-social-windows-outline","ion-social-wordpress","ion-social-wordpress-outline","ion-social-yahoo","ion-social-yahoo-outline","ion-social-yen","ion-social-yen-outline","ion-social-youtube","ion-social-youtube-outline","ion-soup-can","ion-soup-can-outline","ion-speakerphone","ion-speedometer","ion-spoon","ion-star","ion-stats-bars","ion-steam","ion-stop","ion-thermometer","ion-thumbsdown","ion-thumbsup","ion-toggle","ion-toggle-filled","ion-transgender","ion-trash-a","ion-trash-b","ion-trophy","ion-tshirt","ion-tshirt-outline","ion-umbrella","ion-university","ion-unlocked","ion-upload","ion-usb","ion-videocamera","ion-volume-high","ion-volume-low","ion-volume-medium","ion-volume-mute","ion-wand","ion-waterdrop","ion-wifi","ion-wineglass","ion-woman","ion-wrench","ion-xbox"]
                 }
            }
            
            $scope.scrollItems = [];
            $scope.currentSet = null;
            $scope.scrollEnded = false;
            $scope.filterIcons = '';
            
            $scope.loadMore = function() {
                var keys = Object.keys($scope.iconSets);
                var num = 200;
                
                if(!$scope.currentSet)
                {
                    $scope.currentSet = {
                        setKey : 0,
                        setOffset : 0
                    };
                    
                    $scope.scrollItems[$scope.scrollItems.length] = {
                        type : 'divider',
                        lable : $scope.iconSets[keys[$scope.currentSet.setKey]].lable
                    }
                }
                
                var limit = $scope.currentSet.setOffset + num;
                for(var i = $scope.currentSet.setOffset; i < limit; i++)
                {
                    if(!$scope.iconSets[keys[$scope.currentSet.setKey]])
                    {
                         $scope.scrollEnded = true;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                        return 0;
                    }   
                    
                    $scope.currentSet.setOffset = i;
                    if(i >= $scope.iconSets[keys[$scope.currentSet.setKey]].icons.length)
                    {      
                        $scope.currentSet.setKey++;
                        $scope.currentSet.setOffset = 0;
                        limit = limit - i;
                        i = 0;
                        
                        if($scope.currentSet.setKey >= keys.length)
                        {
                            $scope.scrollEnded = true;
                            $scope.$broadcast('scroll.infiniteScrollComplete');
                            return 0;
                        }
                        
                        $scope.scrollItems[$scope.scrollItems.length] = {
                            type : 'divider',
                            lable : $scope.iconSets[keys[$scope.currentSet.setKey]].lable
                        } 
                    }
                    
                    $scope.scrollItems[$scope.scrollItems.length] = {
                        type : 'icon',
                        icon : $scope.iconSets[keys[$scope.currentSet.setKey]].icons[i]
                    }
                }
                
                $scope.$broadcast('scroll.infiniteScrollComplete');
                return 1;
            }
            
            $scope.changeFilterModel = function(val){
                if(!val)
                    return;
                
                $scope.loadMore();
            }
            
            $scope.$watch('filterIcons', $scope.changeFilterModel)
            
            $ionicModal.fromTemplateUrl('assets/views/directives/iconModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modalInstance = modal;
            });
            
            $scope.openModal = function() {
                $scope.modalInstance.show();
            };
            
            //Dismisses a modal window
            $scope.dismissModal = function() {
                $scope.modalInstance.hide();
            }

            $scope.selectIcon = function(icon) {
                $scope.modalInstance.hide();
                
                $scope.iconCurrent = icon;
                if($scope.callback)
                    $scope.callback(icon);
            }
        }],
        link : function(scope, element, attrs, ngModelController) {
            scope.$watch('iconCurrent', function(icon){
                element.html('<i class="icon fa ' + icon + ' "></i>');
            });
            
            
            element.on('click', function(){
                scope.openModal();
            });
        }
    } 
})