<?php

namespace App\Http\Models;

use Illuminate\Database\Eloquent\Model;

class RouteAccess extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'route_access';
    
    public function group() 
    {
        return $this->belongsTo('App\Http\Models\UserGroups', 'user_groups_id'); 
    }
}