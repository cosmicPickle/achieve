<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class TasksLang extends Model
{
    protected $table = 'tasks_lang';
    
    public function task() 
    {
        return $this->belongsTo('App\Http\Models\Tasks', 'tasks_id'); 
    }
   
}