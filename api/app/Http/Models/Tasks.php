<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class Tasks extends Model
{
    protected $table = 'tasks';
    
    public function user() 
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id'); 
    }
    
    public function category() 
    {
        return $this->belongsTo('App\Http\Models\Categories', 'categories_id'); 
    }
    
    public function history()
    {
        return $this->hasMany('App\Http\Models\History');
    }
    
    public function favourited()
    {
        return $this->hasMany('App\Http\Models\Favourites');
    }
    
    public function achievements()
    {
        return $this->hasMany('App\Http\Models\Achievements');
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\TasksLang');
    }
}