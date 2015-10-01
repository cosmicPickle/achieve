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
            'achievements_id' => 'required'
        ],
        "update" => [
            'user_id' => 'required',
            'achievements_id' => 'required'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    protected $allowUserCreation = 1;


    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {

        if($request->achievement_id)
            $query->where('achievements_id', $request->achievement_id);
        
        $query->where('users_id', \App\Http\Middleware\AuthMiddleware::user('id'));
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->extended)
        {
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
            }]);
    }
}
