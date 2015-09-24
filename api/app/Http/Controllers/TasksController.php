<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;


class TasksController extends AbstractController {
    
    protected $modelName = 'Tasks';
    protected $allowUserCreation = 1;
    protected $validation = [
        'create' => [
            'alias' => 'required|unique:tasks',
            'title' => 'required',
        ],
        'update' => [
            'categories_id' => 'required',
            'alias' => 'required|unique:tasks',
            'title' => 'required',
        ],
        'delete' => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->category)
            $query->where('categories_id', $request->category);
        if($request->search)
            $query->where('title', "LIKE", '%'. $request->search . '%');
        
        if($request->onlymy)
            $query->where('user_defined', 1)
                  ->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
        elseif($request->notmy)
            $query->where('user_defined', 0);
        else
            $query->where(function($query){
                $query->where(function($query){
                    $query->where('user_defined', 1)
                          ->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
                })->orWhere('user_defined', 0);
            });
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['locale' => function($query){
            $query->where('locale', app('translator')->getLocale());
        }]);
        
        if($request->withcategory)
            $query->with(['category']);
    }
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->alias)
            $query->where('alias', $request->alias);
        else if($request->id)
            $query->where('id', $request->id);
        else
            $query->where('alias', NULL);
        
        $query->where(function($query){
            $query->where(function($query){
                $query->where('user_defined', 1)
                      ->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
            })->orWhere('user_defined', 0);
        });
    }
    
    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
        'category' => function($query) {
            $query->with(['locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
            }]);
        },
        'user',
        'achievements'  => function($query){
            $query->with(['locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
            }]);
        },
        'favourited' => function($query){
           $query->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
        },
        'locale' => function($query){
            $query->where('locale', app('translator')->getLocale());
        }]);
    }
    
    protected function _simpleFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $this->_viewFilter($query, $request);
    }
    
    protected function _simpleWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'category' => function($query) {
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                }]);
            },
            'locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
        }]);
    }
}
