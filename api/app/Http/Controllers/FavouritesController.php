<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;


class FavouritesController extends AbstractController {
    protected $ipp = 10;
    protected $modelName = 'Favourites';
    protected $validation = [
        "create" => [
            'users_id' => 'required',
            'tasks_id' => 'required_without:achievements_id',
            'achievements_id' => 'required_without:tasks_id'
        ],
        "update" => [
            'user_id' => 'required',
            'tasks_id' => 'required_without:achievements_id',
            'achievements_id' => 'required_without:tasks_id'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    protected $allowUserCreation = 1;


    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->task)
            $query->where('achievements_id', NULL);
        else if($request->achievement)
            $query->where('tasks_id', NULL);
        
        if($request->task_id)
            $query->where('tasks_id', $request->task_id);
        else if($request->achievement_id)
            $query->where('achievements_id', $request->achievement_id);
        
        $query->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->extended)
        {
            if($request->task)
                $query->with([ 
                    'task' => function($query){
                        $query->with(['locale' => function($query){
                            $query->where('locale', app('translator')->getLocale());
                        },'category']);
                }]);
            if($request->achievement)
                $query->with([   
                    'achievement' => function($query){
                        $query->with(['locale' => function($query){
                            $query->where('locale', app('translator')->getLocale());
                        },'category']);
                }]);
        }
    }
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->id)
            $query->where('id', $request->id);
        else
            $query->where('id', NULL);
        
        $query->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
    }
    
    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'achievement' => function($query){
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                },'category']);
            }, 
            'task' => function($query){
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                },'category']);
        }]);
    }
}
