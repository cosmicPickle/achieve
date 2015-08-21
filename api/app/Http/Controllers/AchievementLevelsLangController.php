<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class AchievementLevelsLangController extends AbstractController {
    
    protected $modelName = 'AchievementLevelsLang';
    protected $validation = [
        "create" => [
            'title' => 'required|unique:achv_levels_lang',
            'achv_levels_id' => 'required',
            'locale' => 'required',
        ],
        "update" => [
            'title' => 'required|unique:achv_levels_lang',
            'achv_levels_id' => 'required',
            'locale' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->level)
            $query->where('achv_levels_id', $request->level);
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
        $query->with(['level']);
    }
}
