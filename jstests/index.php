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
    </head>
    <body>
        <div style="width:25%;float:left;">
            <h3>General</h3>
            <input type="text" id="method" value="GET" placeholder="method"><br />
            <input type="text" id="url" value="" placeholder="url"><br />
            <h3>GET</h3>
            <input type="text" id="order" value="" placeholder="order"><br />
            <input type="text" id="page" value="" placeholder="page"><br />
            <h4>filters</h4>
            <textarea id="filters" cols="50" rows="10"></textarea><br />
            <h4>with</h4>
            <textarea id="with" cols="50" rows="10"></textarea><br />
            <h3>POST/PUT</h3>
            <input type="text" id="update_id" value="" placeholder="id"><br />
            <h4>data</h4>
            <textarea id="data" cols="50" rows="10"></textarea><br />
            <h3>DELETE</h3>
            <input type="text" id="delete_id" value="" placeholder="id"><br />
            <input type="text" id="force" value="" placeholder="force"><br />
            <button id="request">Request</button>
        </div>
        
        <div id='result-cont' style="width:35%;float:left;overflow-x:scroll">
            <h2>Response</h2>
            <ul id="result">
            </ul>
        </div>
        
        <div id='debug-cont' style='width:40%;float:left;overflow-x:scroll'>
            <h2>Debug</h2>
            <div id='debug'>
            </div>
        </div>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script type="text/javascript">
            var obj2html = function(container, obj) {
                $.each(obj, function(i, v){
                    var li = $('<li></li>');
                    
                    if((typeof v === 'object' || typeof v === 'array') && v !== null)
                    {
                        li.html(i + " : ");
                        var ul = $('<ul></ul>');
                        ul.appendTo(li);
                        obj2html(ul, v);
                    }
                    else
                    {
                        li.html(i + ' : ' + v);
                    }
                    
                    li.appendTo(container);
                })
            }
            
            $.ajax({
                url : "http://localhost/dev/achieve/api/public/index.php/login",
                method : "POST",
                data : {
                    email : 'teodorklissarov@gmail.com',
                    password : '123qwe123'
                },
                success : function(data) {
                    data = $.parseJSON(data);
                    var jwt = data.data.jwt;
                    $('#request').on('click', function(){
                        var method = $('#method').val();
                        var url = "http://localhost/dev/achieve/api/public/index.php/" + $('#url').val();

                        var data = {};

                        if(method == 'GET')
                        {
                            data.order = ($('#order').val()) ? $.parseJSON($('#order').val()) : [];
                            data.page = $('#page').val();

                            var filters;
                            try 
                            { 
                                filters = $.parseJSON($('#filters').val());
                            }
                            catch(e)
                            {
                                console.log("No Filters")
                            }

                            if(filters)
                                $.each(filters, function(i, v) {
                                    data[i] = v;
                                });
                        }
                        if(method == 'POST' || method == 'PUT')
                        {
                            try {
                                data = $.parseJSON($('#data').val());
                            }
                            catch(e)
                            {
                                data = {};
                            }
                        }
                        if(method == 'PUT')
                        {
                            data.id = $('#update_id').val();
                        }
                        if(method == 'DELETE')
                        {
                            data.id = $('#delete_id').val();
                            data.force = $('#force').val();
                        }

                        $.ajax({
                            url : url,
                            method : method,
                            data : data,
                            success : function(data) {
                                $('#result').html('');
                                if(data)
                                {
                                    try {
                                        obj2html($('#result'), $.parseJSON(data));
                                    }
                                    catch(e)
                                    {
                                        $('#debug').html(data);
                                    }
                                }


                            }
                         });
                    });
                    }
            })
            
        </script>
    </body>
</html>
