<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class Favourites extends Model
{
    protected $table = 'favourites';
    
    public function user() 
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id'); 
    }
    
    public function achievement() 
    {
        return $this->belongsTo('App\Http\Models\Achievements', 'achievements_id'); 
    }
    
    public function task()
    {
        return $this->belongsTo('App\Http\Models\Tasks', 'tasks_id'); 
    }
}