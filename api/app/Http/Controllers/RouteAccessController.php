<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use App\Http\Middleware\AuthMiddleware as Auth;

class RouteAccessController extends AbstractController {
    
    protected $modelName = 'RouteAccess';
    protected $validation = [
        "create" => [
            'route' => 'required',
            'method' => 'required',
            'user_groups_id' => 'required'
        ],
        "read" => [
            "view" => [
                'id' => 'required'
            ]
        ],
        "update" => [
            'route' => 'required',
            'method' => 'required',
            'user_groups_id' => 'required'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->method)
            $query->where('method', $request->method);
        if($request->route)
            $query->where('route', $request->route);
        if($request->group)
        {
            if($request->user_groups_id == -1)
            {
                $all = $request->all();
                $all['user_groups_id'] = Auth::user('user_groups_id');
                $request->replace($all);
            }
            
            $query->where('user_groups_id', $request->user_groups_id);
        }
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['group']);
    }
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->id)
            $query->where('id', $request->id);
    }
    
     protected function _viewtWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['group']);
    }
}
