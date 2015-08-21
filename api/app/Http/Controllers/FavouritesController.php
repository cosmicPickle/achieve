<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;


class FavouritesController extends AbstractController {
    
    protected $modelName = 'Favourites';
    protected $validation = [
        "create" => [
            'users_id' => 'required',
            'tasks_id' => 'required_without:achievements_id',
            'achievements_id' => 'required_without:tasks_id'
        ],
        "read" => [
            "list" => [
                'task' => 'required_without:achievement',
                'achievement' => 'required_without:task'
            ]
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
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->task)
            $query->where('tasks_id', $request->task);
        else if($request->achievement)
            $query->where('achievements_id', $request->achievement);
        
        $query->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
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
                }]);
            }, 
            'task' => function($query){
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                }]);
        }]);
    }
}
