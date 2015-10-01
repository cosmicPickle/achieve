<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use App\Http\Middleware\AuthMiddleware as Auth;

class UnlockedAchievementsController extends AbstractController {
    
    protected $modelName = 'UnlockedAchievements';
    protected $validation = [
        "create" => [
            'users_id' => 'required',
            'achievements_id' => 'required',
        ],
        "update" => [
            'users_id' => 'required',
            'achievements_id' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->achievement)
            $query->where('achievements_id', $request->achievement);

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
        
    }
}
