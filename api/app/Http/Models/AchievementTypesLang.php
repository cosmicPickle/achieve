<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class AchievementTypesLang extends Model
{
    protected $table = 'achv_types_lang';
    
    public function type() 
    {
        return $this->belongsTo('App\Http\Models\AchievementTypes','achv_types_id'); 
    }
}