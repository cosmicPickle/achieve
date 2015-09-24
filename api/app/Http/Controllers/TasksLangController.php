<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class TasksLangController extends AbstractController {
    
    protected $modelName = 'TasksLang';
    protected $validation = [
        "create" => [
            'title' => 'required',
            'tasks_id' => 'required',
            'locale' => 'required',
        ],
        "update" => [
            'title' => 'required',
            'tasks_id' => 'required',
            'locale' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->task)
            $query->where('tasks_id', $request->task);
        if($request->locale)
            $query->where('locale', $request->locale);
    }
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->alias)
            $query->where('alias', $request->alias);
        else if($request->id)
            $query->where('id', $request->id);
        else
            $query->where('id', NULL);
    }
    
    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['task']);
    }
}
