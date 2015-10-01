<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class UnlockedAchievements extends Model
{
    protected $table = 'unlocked_achievements';
    
    public function user()
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id');
    }
    
    public function achievement() 
    {
        return $this->belongsTo('App\Http\Models\Achievements', 'achievements_id'); 
    }
}