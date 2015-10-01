<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class UserAchievements extends Model
{
    protected $table = 'user_achievements';
    
    public function user()
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id');
    }
    
    public function achievement() 
    {
        return $this->belongsTo('App\Http\Models\Achievements', 'achievements_id'); 
    }
    
    public function level() 
    {
        return $this->belongsTo('App\Http\Models\AchievementLevels', 'achv_levels_id'); 
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\AchievementTypesLang');
    }
}