<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class Categories extends Model
{
    protected $table = 'categories';
    
    public function user() 
    {
        return $this->belongsTo('App\Http\Models\Users', 'users_id'); 
    }
    
    public function task()
    {
        return $this->hasMany('App\Http\Models\Tasks');
    }
    
    public function achievements()
    {
        return $this->hasMany('App\Http\Models\Achievements');
    }
    
    public function parentCategory()
    {
        return $this->belongsTo('App\Http\Models\Categories', 'parent_id', 'id');
    }
    
    public function childCategories()
    {
        return $this->hasMany('App\Http\Models\Categories', 'parent_id', 'id');
    }
    
    public function locale()
    {
        return $this->hasMany('App\Http\Models\CategoriesLang');
    }
}