<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use App\Http\Middleware\AuthMiddleware as Auth;

class UsersController extends AbstractController {
    
    protected $modelName = 'Users';
    protected $validation = [
        "create" => [
            'user_groups_id' => 'required',
            'email' => 'required|unique:users',
            'name' => 'required',
            'password' => 'required|same:re_password',
            're_password' => 'required',
        ],
        "update" => [
            'user_groups_id' => 'required',
            'email' => 'required|unique:users',
            'name' => 'required',
            'password' => 'required|same:re_password',
            're_password' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _prepCreateData(Request $request)
    {
        $all = $request->all();
        if($all['password'])
            $all['password'] = \App\Http\Middleware\AuthMiddleware::hash ($all['password']);
        
        if($all['re_password'])
            $all['re_password'] = \App\Http\Middleware\AuthMiddleware::hash ($all['re_password']);
        
        $request->replace($all);
    }
    
    protected function _prepUpdateData(Request $request) 
    {
        $this->_prepCreateData($request);
    }


    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->search)
            $query->where('email', "LIKE", '%' . $request->search . '%');
    }
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->user)
        {
            if($request->user == -1)
            {
                $all = $request->all();
                $all['user'] = Auth::user('id');
                $request->replace($all);
            }
            
            $query->where('id', $request->user);
        }
        else
            $query->where('id', NULL);
    }
    
    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'achieved' => function($query) {
                $query->with([
                    'achievement' => function($query){
                        $query->with([
                            'locale' => function($query){
                                $query->where('locale', app('translator')->getLocale());
                            },
                            'levels' => function($query){
                                $query->with([
                                    'locale' => function($query){
                                        $query->where('locale', app('translator')->getLocale());
                                    }]);
                            }]);
                }]);
            }]);
    }
    
    protected function _simpleFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $this->_viewFilter($query, $request);
    }
    
}
