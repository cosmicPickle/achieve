<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class AchievementTypes extends Model
{
    protected $table = 'achv_types';
    
    public function achievements() 
    {
        return $this->hasMany('App\Http\Models\Achievements'); 
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\AchievementTypesLang', 'achv_types_id');
    }
}