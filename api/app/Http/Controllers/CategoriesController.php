<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;

class CategoriesController extends AbstractController {
    
    protected $modelName = 'Categories';
    protected $validation = [
        "create" => [
            'alias' => 'required|unique:categories,alias',
            'title' => 'required|unique:categories',
            'color' => 'required',
            'bg_color' => 'required'
        ],
        "update" => [
            'alias' => 'required|unique:categories,alias',
            'title' => 'required|unique:categories',
            'color' => 'required',
            'bg_color' => 'required'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->parent)
            $query->where('parent_id', $request->parent);
        else
            $query->where('parent_id', NULL);
        
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
    
    protected function _viewWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
            },
            'childCategories' => function($query) use ($request) {
                if($request->search)
                    $query->where('title', 'LIKE', '%' . $request->search . '%');
                
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                }]);
            },
            'achievements' => function($query) use ($request) {
                if($request->search)
                    $query->where('title', 'LIKE', '%' . $request->search . '%');
                
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                }]);
            }]);
    }
    
    protected function _simpleFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $this->_viewFilter($query, $request);
    }
    
    protected function _simpleWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $query->with([
            'parentCategory' => function($query) use ($request) {
                $query->with(['locale' => function($query){
                    $query->where('locale', app('translator')->getLocale());
                }]);
            },
            'locale' => function($query){
                $query->where('locale', app('translator')->getLocale());
        }]);
    }
}
