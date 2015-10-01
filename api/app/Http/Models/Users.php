<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class Users extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'users';
    
    public function group()
    {
        return $this->belongsTo('App\Http\Models\UserGroups', 'user_groups_id');
    }

    public function history()
    {
        return $this->hasMany('App\Http\Models\History');
    }
    
    public function favourites()
    {
        return $this->hasMany('App\Http\Models\Favourites');
    }
    
    public function definedCategories()
    {
        return $this->hasMany('App\Http\Models\Categories');
    }
    
    public function definedTasks()
    {
        return $this->hasMany('App\Http\Models\Tasks');
    }
    
    public function definedAchievements()
    {
        return $this->hasMany('App\Http\Models\Achievements');
    }
    
    public function achieved()
    {
        return $this->hasMany('App\Http\Models\UserAchievements');
    }
    
    public function unlocked()
    {
        return $this->belongsToMany('App\Http\Models\Achievements', 'unlocked_achievements');
    }
}