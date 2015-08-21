<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class AchievementLevelsController extends AbstractController {
    
    protected $modelName = 'AchievementLevels';
    protected $validation = [
        "create" => [
            'alias' => 'required|unique:achv_levels',
            'title' => 'required|unique:achv_levels',
            'achievements_id' => 'required',
            'repetition' => 'required',
            'timeframe' => 'required'
        ],
        "read" => [
            "list" => [
                'achievement' => 'required'
            ]
        ],
        "update" => [
            'alias' => 'required|unique:achv_levels',
            'title' => 'required|unique:achv_levels',
            'achievements_id' => 'required',
            'repetition' => 'required',
            'timeframe' => 'required'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->achievement)
            $query->where('achievements_id', $request->achievement);
        if($request->search)
            $query->where('title', "LIKE", '%' . $request->search . '%');
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['locale' => function($query){
            $query->where('locale', app('translator')->getLocale());
        }]);
    }
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->alias)
            $query->where('alias', $request->alias);
        else if($request->id)
            $query->where('id', $request->id);
        else
            $query->where('alias', NULL);
    }
    
    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
            },
            'achievement.task' => function($query) {
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                }]);
            },
            'achieved' => function($query) {
                $query->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
            }]);
    }
    
    protected function _simpleFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $this->_viewWith($query, $request);
    }
    
    protected function _simpleWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
        }]);
    }
}
