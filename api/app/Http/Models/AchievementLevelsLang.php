<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class AchievementLevelsLang extends Model
{
    protected $table = 'achv_levels_lang';
    
    public function level() 
    {
        return $this->belongsTo('App\Http\Models\AchievementLevels', 'achv_levels_id'); 
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\AchievementTypesLang');
    }
}