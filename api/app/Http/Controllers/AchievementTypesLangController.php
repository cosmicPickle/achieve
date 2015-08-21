<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class AchievementTypesLangController extends AbstractController {
    
    protected $modelName = 'AchievementTypesLang';
    protected $validation = [
        "create" => [
            'title' => 'required|unique:achv_types_lang',
            'achv_types_id' => 'required',
            'locale' => 'required',
        ],
        "update" => [
            'title' => 'required|unique:achv_types_lang',
            'achv_types_id' => 'required',
            'locale' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->type)
            $query->where('achv_types_id', $request->type);
        if($request->locale)
            $query->where('locale', $request->locale);
    }
    
    
    protected function _viewFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->id)
            $query->where('id', $request->id);
        else
            $query->where('id', NULL);
    }

    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with(['type']);
    }
}
