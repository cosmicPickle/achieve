<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class Achievements extends Model
{
    protected $table = 'achievements';
    
    public function user() 
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id'); 
    }
    
    public function category() 
    {
        return $this->belongsTo('App\Http\Models\Categories', 'categories_id'); 
    }
    
    public function task()
    {
        return $this->belongsTo('App\Http\Models\Tasks', 'tasks_id');
    }
    
    public function type() 
    {
        return $this->belongsTo('App\Http\Models\AchievementTypes', 'achv_types_id'); 
    }
    
    public function achieved()
    {
        return $this->hasMany('App\Http\Models\UserAchievements');
    }
    
    public function favourited()
    {
        return $this->hasMany('App\Http\Models\Favourites');
    }
    
    
    public function levels()
    {
        return $this->hasMany('App\Http\Models\AchievementLevels');
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\AchievementsLang');
    }
}