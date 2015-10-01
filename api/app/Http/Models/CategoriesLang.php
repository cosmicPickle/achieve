<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriesLang extends Model
{
    protected $table = 'categories_lang';
    
    public function category()
    {
        return $this->belongsTo('App\Http\Models\Categories', 'categories_id');
    }
    
}