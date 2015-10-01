<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Middleware\AuthMiddleware as Auth;

class StatisticsController extends AbstractController
{

    protected $historyModel;
    protected $userAchievementsModel;
    
    /**
     * Constructor
     * 
     * @param Request $request
     */
    public function __construct(Request $request) {
        //\Event::listen('illuminate.query', function($query, $bindings)
        //{
        //    var_dump($query, $bindings);
        //});
        //Let's first set the locale
        if($request->cookie('locale'))
            app('translator')->setLocale($request->cookie('locale'));

        //Initializing the auth class
        Auth::init();
        
        //Checking if the cookie contains the JWT
        if($request->cookie('jwt'))
            Auth::setJWT($request->cookie('jwt'));
        
        if(!Auth::authenticateJWT($request->path(), $request->method()))
            $this->_unauthorized();
        
        $this->historyModel = new \App\Http\Models\History();
        $this->userAchievementsModel = new \App\Http\Models\UserAchievements();
    }
    
    public function mostAchievements(Request $request)
    {
        $table = $this->userAchievementsModel->getTable();
        $query = $this->userAchievementsModel
                      ->select(\DB::raw($table.'.users_id, ' . $table . '.achievements_id, count(' . $table . '.id) as achieved_levels, achv_levels.num_levels'))
                      ->groupBy('achievements_id')
                      ->orderBy('achieved_levels', 'desc')
                      ->join(\DB::raw(
                               '(SELECT `achievements_id`, 
                                count(id) as `num_levels` 
                                FROM `' . (new \App\Http\Models\AchievementLevels())->getTable() . '`
                                GROUP BY `achievements_id`) as `achv_levels`'),
                            'achv_levels.achievements_id', '=', $table.'.achievements_id')
                      ->take(3)
                      ->with([
                            'achievement' => function($query){
                                $query->with([
                                    'locale' => function($query){
                                        $query->where('locale', app('translator')->getLocale());
                                    }, 'category']);
                            }]);
        
        if($request->user)
        {
            if($request->user == -1)
            {
                $all = $request->all();
                $all['user'] = Auth::user('id');
                $request->replace($all);
            }
            
            $query->where('users_id', $request->user);
        }
        else
            $query->where('users_id', Auth::user('id'));
        
        $achievedLevels = $query->get();
        $this->_success(['achievedLevels' => $achievedLevels]);
    }
    
    public function mostCategories(Request $request)
    {
        $table = $this->userAchievementsModel->getTable();
        $achvTable = (new \App\Http\Models\Achievements())->getTable();
        $achvLvlsTable = (new \App\Http\Models\AchievementLevels())->getTable();
        $query = $this->userAchievementsModel
                      ->select(\DB::raw($table . '.users_id, ' . $table . '.achievements_id, count(' . $table . '.id) as achieved_levels, achv_levels.num_levels'))
                      ->join($achvTable, $achvTable . '.id', '=', $table . ".achievements_id")
                      ->join(\DB::raw(
                               '(SELECT `' . $achvTable . '`.`categories_id`, 
                                count(`achv_levels`.`id`) as `num_levels` 
                                FROM `' . $achvLvlsTable . '`
                                JOIN `' . $achvTable . '` 
                                ON `' . $achvLvlsTable . '`.achievements_id = `' . $achvTable . '`.id 
                                GROUP BY `' . $achvTable . '`.`categories_id`) as `achv_levels`'),
                            'achv_levels.categories_id', '=', $achvTable.'.categories_id')
                      ->groupBy($achvTable . '.categories_id')
                      ->orderBy('achieved_levels', 'desc')
                      ->take(3)
                      ->with([
                            'achievement' => function($query){
                                $query->with([
                                    'category' => function($query) {
                                        $query->with([
                                            'locale' => function($query){
                                                $query->where('locale', app('translator')->getLocale());
                                        }]);
                                    }
                                ]);
                            }]);
                            
        if($request->user)
        {
            if($request->user == -1)
            {
                $all = $request->all();
                $all['user'] = Auth::user('id');
                $request->replace($all);
            }
            
            $query->where($table.'.users_id', $request->user);
        }
        else
            $query->where($table.'.users_id', Auth::user('id'));
        
        $achievedLevels = $query->get();
        $this->_success(['achievedLevels' => $achievedLevels]);
    }
    
    public function mostAchievementsCount(Request $request)
    {
        $query = $this->historyModel
                      ->select(\DB::raw('users_id, achievements_id, count(id) as history_num'))
                      ->groupBy('achievements_id')
                      ->whereRaw('`date` < DATE_ADD(curdate(), INTERVAL 1 DAY) AND `date` > DATE_ADD(DATE_SUB(curdate(), INTERVAL 1 MONTH), INTERVAL 1 DAY)')
                      ->orderBy('history_num', 'desc')
                      ->take(3)
                      ->with([
                            'achievement' => function($query){
                                $query->with([
                                    'locale' => function($query){
                                        $query->where('locale', app('translator')->getLocale());
                                    },'category']);
                            }]);
        
        if($request->user)
        {
            if($request->user == -1)
            {
                $all = $request->all();
                $all['user'] = Auth::user('id');
                $request->replace($all);
            }
            
            $query->where('users_id', $request->user);
        }
        else
            $query->where('users_id', Auth::user('id'));
        
        $achievementCount = $query->get();
        $this->_success(['achievementCount' => $achievementCount]);
    }
}