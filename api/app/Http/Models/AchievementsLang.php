<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class AchievementsLang extends Model
{
    protected $table = 'achievements_lang';
    
    public function achievement() 
    {
        return $this->belongsTo('App\Http\Models\Achievements', 'achievements_id'); 
    }
}