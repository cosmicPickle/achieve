<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class CategoriesLangController extends AbstractController {
    
    protected $modelName = 'CategoriesLang';
    protected $validation = [
        "create" => [
            'title' => 'required|unique:categories_lang',
            'categories_id' => 'required',
            'locale' => 'required',
        ],
        "update" => [
            'title' => 'required|unique:achievements_lang',
            'categories_id' => 'required',
            'locale' => 'required',
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->category)
            $query->where('categories_id', $request->category);
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
        $query->with(['category']);
    }
}
