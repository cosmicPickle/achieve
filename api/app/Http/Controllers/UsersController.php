<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use App\Http\Middleware\AuthMiddleware as Auth;

class UsersController extends AbstractController {
    
    //This turns off the limitations for creating entities of this node by non-admministrators
    //This is dne to allow users to register themselves
    protected $allowUserCreation = -1;
    protected $modelName = 'Users';
    protected $validation = [
        "create" => [
            'user_groups_id' => 'required',
            'email' => 'required|unique:users',
            'name' => 'required',
            'password' => 'required|same:re_password',
            're_password' => 'required|required_with:password',
        ],
        "update" => [
            'email' => 'required_with:register|unique:users',
            'password' => 'required_with:register|same:re_password',
            're_password' => 'required_with:password',
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
        $all = $request->all();
        
        if(!Auth::isAdmin() || !isset($all['id']) || $all['id'] == -1)
            $all['id'] = Auth::user('id');
        
        if(isset($all['password']))
            $all['password'] = \App\Http\Middleware\AuthMiddleware::hash ($all['password']);
        
        if(isset($all['re_password']))
            $all['re_password'] = \App\Http\Middleware\AuthMiddleware::hash ($all['re_password']);
        
        $request->replace($all);
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
            },
            'unlocked' => function($query){
                $query->with([
                            'locale' => function($query){
                                $query->where('locale', app('translator')->getLocale());
                            }]);
            }]);
    }
    
    protected function _simpleFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $this->_viewFilter($query, $request);
    }
    
}
