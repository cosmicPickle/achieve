<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use App\Http\Middleware\AuthMiddleware as Auth;

class UserAchievementsController extends AbstractController {
    
    protected $modelName = 'UserAchievements';
    protected $validation = [
        "create" => [
            'users_id' => 'required',
            'achievements_id' => 'required',
            'achv_levels_id' => 'required'
        ],
        "update" => [
            'users_id' => 'required',
            'achievements_id' => 'required',
            'achv_levels_id' => 'required'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->achievement)
            $query->where('achievements_id', $request->achievement);
        if($request->level)
            $query->where('achv_levels_id', $request->level);
        
        if($request->user)
        {
            if($request->user == -1)
            {
                $all = $request->all();
                $all['user'] = Auth::user('id');
                $request->replace($all);
            }
            
            $query->where('users_id', $request->user);
        }
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'level' => function($query){
                $query->with([
                    'locale' => function($query){
                        $query->where('locale', app('translator')->getLocale());
                    }]);
            }]);
    }
}
