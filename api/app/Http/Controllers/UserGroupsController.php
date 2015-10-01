<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class UserGroupsController extends AbstractController {
    
    protected $modelName = 'UserGroups';
    protected $validation = [
        "create" => [
            'alias' => 'required|unique:user_groups',
            'title' => 'required|unique:user_groups',
        ],
        "update" => [
            'alias' => 'required|unique:user_groups',
            'title' => 'required|unique:user_groups',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->search)
            $query->where('title', "LIKE", '%' . $request->search . '%');
    }

    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->alias)
            $query->where('alias', $request->alias);
        else if($request->id)
            $query->where('id', $request->id);
        else
            $query->where('alias', NULL);
    }
    
}
