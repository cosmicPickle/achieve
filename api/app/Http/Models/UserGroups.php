<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class UserGroups extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_groups';
    
    public function users() 
    {
        return $this->hasMany('App\Http\Models\Users'); 
    }
    
    public function routeAccess() 
    {
        return $this->hasMany('App\Http\Models\RouteAccess'); 
    }
}