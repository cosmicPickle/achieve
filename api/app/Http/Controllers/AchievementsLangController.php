<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class AchievementsLangController extends AbstractController {
    
    protected $modelName = 'AchievementsLang';
    protected $validation = [
        "create" => [
            'title' => 'required|unique:achievements_lang',
            'achievements_id' => 'required',
            'locale' => 'required',
        ],
        "update" => [
            'title' => 'required|unique:achievements_lang',
            'achievements_id' => 'required',
            'locale' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->achievement)
            $query->where('achievements_id', $request->achievement);
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
        $query->with(['achievement']);
    }
}
