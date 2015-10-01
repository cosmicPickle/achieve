<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class AchievementLevels extends Model
{
    protected $table = 'achv_levels';
    
    public function achievement() 
    {
        return $this->belongsTo('App\Http\Models\Achievements', 'achievements_id'); 
    }
    
    public function achieved()
    {
        return $this->hasMany('App\Http\Models\UserAchievements', 'achv_levels_id');
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\AchievementLevelsLang', 'achv_levels_id');
    }
}