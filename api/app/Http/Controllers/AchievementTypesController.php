<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class AchievementTypesController extends AbstractController {
    
    protected $modelName = 'AchievementTypes';
    protected $validation = [
        "create" => [
            'alias' => 'required|unique:achv_types',
            'title' => 'required|unique:achv_types',
        ],
        "update" => [
            'alias' => 'required|unique:achv_types',
            'title' => 'required|unique:achv_types',
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
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['locale' => function($query){
            $query->where('locale', app('translator')->getLocale());
        }]);
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
