<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->put('/locale', 'LangController@setLocale');
$app->get('/slocale', 'LangController@setLocale');
$app->get('/locale/view', 'LangController@getLocaleCurrent');
$app->get('/locale/list', 'LangController@getLocaleList');

$app->get('/translate/view', 'LangController@getPageTranslation');

$app->post('/login', 'AuthController@login');
$app->get('/logout', 'AuthController@logout');
$app->get('/token/view', 'AuthController@token');

$app->post('/categories', 'CategoriesController@create');
$app->get('/categories/list', 'CategoriesController@read');
$app->get('/categories/view', 'CategoriesController@read');
$app->get('/categories/simple', 'CategoriesController@read');
$app->put('/categories', 'CategoriesController@update');
$app->delete('/categories', 'CategoriesController@delete');

$app->post('/categories/lang', 'CategoriesLangController@create');
$app->get('/categories/lang/list', 'CategoriesLangController@read');
$app->get('/categories/lang/view', 'CategoriesLangController@read');
$app->put('/categories/lang', 'CategoriesLangController@update');
$app->delete('/categories/lang', 'CategoriesLangController@delete');

$app->post('/achievements', 'AchievementsController@create');
$app->get('/achievements/list', 'AchievementsController@read');
$app->get('/achievements/view', 'AchievementsController@read');
$app->get('/achievements/simple', 'AchievementsController@read');
$app->put('/achievements', 'AchievementsController@update');
$app->delete('/achievements', 'AchievementsController@delete');

$app->post('/achievements/lang', 'AchievementsLangController@create');
$app->get('/achievements/lang/list', 'AchievementsLangController@read');
$app->get('/achievements/lang/view', 'AchievementsLangController@read');
$app->put('/achievements/lang', 'AchievementsLangController@update');
$app->delete('/achievements/lang', 'AchievementsLangController@delete');

$app->post('/achievements/levels', 'AchievementLevelsController@create');
$app->get('/achievements/levels/list', 'AchievementLevelsController@read');
$app->get('/achievements/levels/view', 'AchievementLevelsController@read');
$app->get('/achievements/levels/simple', 'AchievementLevelsController@read');
$app->put('/achievements/levels', 'AchievementLevelsController@update');
$app->delete('/achievements/levels', 'AchievementLevelsController@delete');

$app->post('/achievements/levels/lang', 'AchievementLevelsLangController@create');
$app->get('/achievements/levels/lang/list', 'AchievementLevelsLangController@read');
$app->get('/achievements/levels/lang/view', 'AchievementLevelsLangController@read');
$app->put('/achievements/levels/lang', 'AchievementLevelsLangController@update');
$app->delete('/achievements/levels/lang', 'AchievementLevelsLangController@delete');

$app->post('/achievements/types', 'AchievementTypesController@create');
$app->get('/achievements/types/list', 'AchievementTypesController@read');
$app->get('/achievements/types/view', 'AchievementTypesController@read');
$app->put('/achievements/types', 'AchievementTypesController@update');
$app->delete('/achievements/types', 'AchievementTypesController@delete');

$app->post('/achievements/types/lang', 'AchievementTypesLangController@create');
$app->get('/achievements/types/lang/list', 'AchievementTypesLangController@read');
$app->get('/achievements/types/lang/view', 'AchievementTypesLangController@read');
$app->put('/achievements/types/lang', 'AchievementTypesLangController@update');
$app->delete('/achievements/types/lang', 'AchievementTypesLangController@delete');

$app->post('/favourites', 'FavouritesController@create');
$app->get('/favourites/list', 'FavouritesController@read');
$app->get('/favourites/view', 'FavouritesController@read');
$app->put('/favourites', 'FavouritesController@update');
$app->delete('/favourites', 'FavouritesController@delete');

$app->post('/history', 'HistoryController@create');
$app->get('/history/list', 'HistoryController@read');
$app->put('/history', 'HistoryController@update');
$app->delete('/history', 'HistoryController@delete');

$app->post('/route/access', 'RouteAccessController@create');
$app->get('/route/access/list', 'RouteAccessController@read');
$app->get('/route/access/view', 'RouteAccessController@read');
$app->put('/route/access', 'RouteAccessController@update');
$app->delete('/route/access', 'RouteAccessController@delete');

$app->post('/tasks', 'TasksController@create');
$app->get('/tasks/list', 'TasksController@read');
$app->get('/tasks/view', 'TasksController@read');
$app->get('/tasks/simple', 'TasksController@read');
$app->put('/tasks', 'TasksController@update');
$app->delete('/tasks', 'TasksController@delete');

$app->post('/tasks/lang', 'TasksLangController@create');
$app->get('/tasks/lang/list', 'TasksLangController@read');
$app->get('/tasks/lang/view', 'TasksLangController@read');
$app->put('/tasks/lang', 'TasksLangController@update');
$app->delete('/tasks/lang', 'TasksLangController@delete');

$app->post('/user/achievements', 'UserAchievementsController@create');
$app->get('/user/achievements/list', 'UserAchievementsController@read');
$app->put('/user/achievements', 'UserAchievementsController@update');
$app->delete('/user/achievements', 'UserAchievementsController@delete');

$app->post('/user/groups', 'UserGroupsController@create');
$app->get('/user/groups/list', 'UserGroupsController@read');
$app->get('/user/groups/view', 'UserGroupsController@read');
$app->put('/user/groups', 'UserGroupsController@update');
$app->delete('/user/groups', 'UserGroupsController@delete');

$app->post('/users', 'UsersController@create');
$app->get('/users/list', 'UsersController@read');
$app->get('/users/view', 'UsersController@read');
$app->get('/users/simple', 'UsersController@read');
$app->put('/users/', 'UsersController@update');
$app->delete('/users/', 'UsersController@delete');

$app->get('/stats/most/achievements', 'StatisticsController@mostAchievements');
$app->get('/stats/most/tasks', 'StatisticsController@mostTasks');
$app->get('/stats/most/categories', 'StatisticsController@mostCategories');