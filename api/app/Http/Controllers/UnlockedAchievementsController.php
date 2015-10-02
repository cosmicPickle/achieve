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
    
    protected function _addCreateValidation(Request $request)
    {
        $this->userEnergy = Auth::user('energy', FALSE);
        $this->unlockEnergy = (new \App\Http\Models\Achievements)->select('unlock_energy')->where('id', $request->achievements_id)->first()->unlock_energy;
        
        if($this->userEnergy < $this->unlockEnergy)
            $this->_fail ([trans('responses.not_enough_energy')]);
    }
    
    protected function _afterCreate(Request $request, $insert_id)
    {
        if($request->user == -1 || !$request->user)
        {
            $all = $request->all();
            $all['user'] = Auth::user('id');
            $request->replace($all);
        }
        
        
        $user = new \App\Http\Models\Users;
        $user->where('id', $request->user)
             ->update([
                'energy' => $this->userEnergy - $this->unlockEnergy
             ]);
    }
    
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
