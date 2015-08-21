<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>TODO supply a title</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style type="text/css">
            .result-ok {
                background-color: #67b168;
            }
            
            .result-fail {
                background-color: #ce8483;
            }
        </style>
    </head>
    <body>
        <div id="results">
            
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript">
            $(document).ready(function(){
                var baseUrl = 'http://localhost/dev/achieve/api/public/index.php/'
                var tests = [{
                        route : 'categories',
                        post : {
                                parent_id : 1,
                                alias : 'test_cat',
                                title : 'TestCat',
                                color : '#000000',
                                bg_color : '#ffffff'
                        },
                        put : {
                                alias : 'test_cat1',
                                title : 'TestCat1',
                                color : '#000001',
                                bg_color : '#fffffd'
                        },
                        get_list : {
                                parent : 12,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'categories/lang',
                        post : {
                                categories_id : 1,
                                title : 'TestCat',
                                locale : 'en_EN'
                        },
                        put : {
                                title : 'TestCat1',
                        },
                        get_list : {
                                category : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'achievements',
                        post : {
                                achv_types_id : 1,
                                categories_id : 1,
                                tasks_id : 1,
                                alias : 'test',
                                title : 'Test',
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                category : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'achievements/lang',
                        post : {
                                achievements_id : 1,
                                title : 'Test',
                                locale : 'en_EN'
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                achievement : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'achievements/levels',
                        post : {
                                achievements_id : 1,
                                alias : 'test',
                                title : 'Test',
                                repetition : 0,
                                timeframe : 0
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                achievement : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'achievements/levels/lang',
                        post : {
                                achv_levels_id : 1,
                                title : 'Test',
                                locale : 'en_EN'
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                level : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'achievements/types',
                        post : {
                                alias : 'test',
                                title : 'Test',
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                search : 'st1',
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'achievements/types/lang',
                        post : {
                                achv_types_id : 1,
                                title : 'Test',
                                locale : 'en_EN'
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                type : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'favourites',
                        post : {
                                users_id : 9,
                                achievements_id : 1,
                        },
                        put : {
                                achievements_id : null,
                                tasks_id : 1
                        },
                        get_list : {
                                task : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'history',
                        post : {
                                users_id : -1,
                                tasks_id : 1
                        },
                        put : {
                                tasks_id : 2
                        },
                        get_list : {
                                user : -1,
                        },
                        delete : {}
                    },
                    {
                        route : 'route/access',
                        post : {
                                user_groups_id : 1,
                                route : 'test',
                                method : 'GET'
                        },
                        put : {
                                route : 'test1',
                        },
                        get_list : {
                                method : 'GET',
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'tasks',
                        post : {
                                categories_id : 1,
                                alias : 'test',
                                title : 'Test',
                                color : '#45gbe3',
                                bg_color : '#ffffff',
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                category : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'tasks/lang',
                        post : {
                                tasks_id : 1,
                                title : 'Test',
                                locale : 'en_EN'
                        },
                        put : {
                                title : 'Test1',
                        },
                        get_list : {
                                task : 1,
                        },
                        get_view : {},
                        delete : {}
                    },
                    {
                        route : 'user/achievements',
                        post : {
                                users_id : -1,
                                achievements_id : 1,
                                achv_levels_id : 1,
                        },
                        put : {
                                achv_levels_id : 31,
                        },
                        get_list : {
                                achievement : 1,
                        },
                        delete : {}
                    },
                    {
                        route : 'user/groups',
                        post : {
                                alias : 'member',
                                title : 'Member',
                        },
                        put : {
                                alias : 'member1',
                                title : 'Member1',
                        },
                        get_list : {
                                search : 'mem'
                        },
                        delete : {}
                    },
                    {
                        route : 'users',
                        post : {
                                user_groups_id : 1,
                                email : 'member@data.bg',
                                name : 'Member Test',
                                password : '123qwe123',
                                re_password : '123qwe123',
                        },
                        put : {
                                email : 'member1@data.bg',
                                name : 'Member1 Test',
                                password : '123qwe1234',
                                re_password : '123qwe1234',
                        },
                        get_list : {
                                search : 'mem'
                        },
                        get_view : {},
                        delete : {}
                    },
                ];
                
                var results = function(msg, route, method, type)
                {
                    var result = $('<div></div>');
                    result.attr('class', 'result-' + type);
                    
                    var title = $('<h2></h2>');
                    title.text("Route: " + route);
                    
                    var subtitle = $('<h3></h3>');
                    subtitle.text("Method: " + method);
                    
                    result.append(title);
                    result.append(subtitle);
                    result.append(msg);
                    result.appendTo($('#results'));
                }
                
                var ok = function(msg, route, method)
                {
                    results(msg, route, method, 'ok');
                }
                
                var fail = function(msg, route, method)
                {
                    results(msg, route, method, 'fail');
                }
                
                var subtest = function(request, route, method, callback)
                {
                    $.ajax({
                        //first we execute the post test
                        url : baseUrl + route,
                        method : method.toUpperCase(),
                        data : request,
                        success : function(data) {
                            var dataJSON = data;
                            var failed = false;
                            
                            try {
                                data = $.parseJSON(data);
                            }
                            catch(e) {
                                //there is probably a php error
                                fail('json parse error (possibly) php error.', route, 'post');
                                failed = true;
                            }
                            
                            if(!failed)
                            {
                                if(data.status == 0)
                                    fail(dataJSON, route, method);
                                else
                                {
                                    ok(dataJSON, route, method);
                                    if(typeof callback != 'undefined')
                                        callback(data);
                                }
                            }
                        }
                    });
                }
                
                var test = function(i) {
                    var node = tests[i];
                    
                    if(!node)
                        return 0;
                    
                    subtest(node.post, node.route, 'post', function(resp){
                        node.put.id = resp.data.insert_id;
                        node.delete.id = resp.data.insert_id;
                        if(node.get)
                            node.get.id = resp.data.insert_id;
                        if(node.get_view)
                            node.get_view.id = resp.data.insert_id;
                        if(node.get_simple)
                            node.get_simple.id = resp.data.insert_id;
                           
                        subtest(node.put, node.route, 'put', function(resp){
                           
                           if(node.get)
                           {
                               var defGet = $.Deferred();
                               subtest(node.get, node.route, 'get', function(resp){
                                   defGet.resolve("");
                               });
                           }
                           if(node.get_list)
                           {
                               var defGetList = $.Deferred();
                               subtest(node.get_list, node.route + '/list', 'get', function(resp){
                                   defGetList.resolve("");
                               });
                           }
                           if(node.get_view)
                           {
                               var defGetView = $.Deferred();
                               subtest(node.get_view, node.route + '/view', 'get', function(resp){
                                   defGetView.resolve("");
                               });
                           }
                           if(node.get_simple)
                           {
                               var defGetSimple = $.Deferred();
                               subtest(node.get_simple, node.route + '/simple', 'get', function(resp){
                                   defGetSimple.resolve("");
                               });
                           }
                           
                           $.when( defGet, defGetList, defGetView, defGetSimple ).done(function ( v1, v2, v3, v4 ) {
                                subtest(node.delete, node.route, 'delete',function(resp){
                                    test(i+1);
                                });
                                
                            });
                        });
                    });
                    
                };
                
                $.ajax({
                    url : "http://localhost/dev/achieve/api/public/index.php/login",
                    method : "POST",
                    data : {
                        email : 'teodorklissarov@gmail.com',
                        password : '123qwe123'
                    },
                    success : function(data) {
                        test(0);
                    }
                });
                
            });
        </script>
    </body>
</html>
