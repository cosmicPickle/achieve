<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    public $timestamps = FALSE;
    
    protected $table = 'history';
    protected $dates = ['date'];
    
    public function user() 
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id'); 
    }
    
    public function task() 
    {
        return $this->belongsTo('App\Http\Models\Tasks', 'tasks_id'); 
    }
}