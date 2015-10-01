<?php

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use App\Http\Middleware\AuthMiddleware as Auth;

class HistoryController extends AbstractController {
    
    protected $modelName = 'History';
    protected $validation = [
        "create" => [
            'users_id' => 'required',
            'achievements_id' => 'required',
        ],
        "read" => [
            "list" => [
                'user' => 'required'
            ] 
        ],
        "update" => [
            'users_id' => 'required',
            'achievements_id' => 'required',
            'date' => 'required'
        ],
        "delete" => [
            'id' => 'required'
        ]
    ];
    
    protected function _prepCreateData(Request $request)
    {
        //Lets check if there are any shenanigans
        $userUnlocked = array_map(function($val){
                return $val['id'];
            },Auth::user('unlocked', FALSE));
            
        if(!in_array($request->achievements_id, $userUnlocked))
        {
            //Someone's trying to achieve something they haven't unlocked yet
            //Well... ambiguous error for you
            
            $this->_fail([trans('responses.invalid_input')]);
        }
        if($request->date)
            return;
        
        $all = $request->all();
        $all['date'] = time();
        $request->replace($all);
    }
    
    /**
     * This user checks after a history item is inserted, to see if the user is
     * achieving any new levels and if so adds the new achievement levels, to 
     * the user.
     *  
     * Note: It is a bit messy. Should be rewriten
     * 
     * @param Request $request
     * @param type $insert_id
     */
    protected function _afterCreate(Request $request, $insert_id)
    {
        //Fetches the achievements with a id equal to the one of the history item
        //that was currently inserted
        $a = \App\Http\Models\Achievements
                ::where('id', $request->achievements_id)
                ->with(['levels' => function($query){
                    $query->orderBy('level_num', 'asc');
                },
                'achieved' => function($query){
                    $query->where('users_id', Auth::user('id'));
                }])
                ->get()[0];
        
        //The levels of the achievement
        $levels = $a->levels;
        //The levels achieved by the user
        $achieved = $a->achieved->toArray();
        //This takes only the achv_levels_ids from the achieved array and forms a reduced array
        $achievedReduced = array_pluck($achieved, 'achv_levels_id');

        //The current and next levels of the user
        $current = null;
        $next = null;
        foreach($levels as $l)
            //We itterate until we find a level that is not achieved
            if(in_array($l->id, $achievedReduced))
                //The last achieved is the current
                $current = $l;
            else
            {
                //The first not achieved is the next level
                $next = $l;
                break;
            }
        //Current time ... duh
        $time = time();
        //It is either the time minus the timeframe of the next level or 0 if this is 
        //a repetative or one time achievement
        $fromDate = $time - ($next->timeframe) ? $next->timeframe*24*60*60 : $time;
        //We find the level which has the same id as the current level and reindex the array
        $lastAchievedDate = array_values(
            array_where($achieved, function($i, $val) use ($current) {
                return $val['achv_levels_id'] == $current->id;
        }));
        if($lastAchievedDate)
            //We create a timestamp out of the date string
            $lastAchievedDate = strtotime($lastAchievedDate[0]['created_at']);
        
        //If the last level was achieved sooner than the timeframe, we take that as a limit
        if($lastAchievedDate && $lastAchievedDate > $fromDate)
            $fromDate = $lastAchievedDate;

        //Finally... getting the history count
        $historyCount = \App\Http\Models\History
                        ::whereBetween('date', [date('c', $fromDate), date('c', $time)])
                        ->where('users_id', $request->users_id)
                        ->where('achievements_id', $a->id)
                        ->count();

        //The user needs to be rewarded with a abit energy in a minute
        $userEnergyReward = 0; 
        //If the current historyCount is more then the required repetition, we need to increase the level
        if($historyCount >= $next->repetition)
        {
            $insert = new \App\Http\Models\UserAchievements();
            $insert->achv_levels_id = $next->id;
            $insert->achievements_id = $a->id;
            $insert->users_id = $request->users_id;
            $insert->save();
            
            //Saving energy reward for later
            $userEnergyReward += $next->energy_reward;
        }
        
        //Now that we got the levels out of the way, we need to give energy to the user for
        //completing the task
        $userEnergyReward += $a->energy_reward;
        
        //We update the user
        $user = \App\Http\Models\Users::find(Auth::user('id'));
        $user->energy += $userEnergyReward;
        $user->save();
    }
    
    protected function _listFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
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
        
        if($request->achievement)
            $query->where('achievements_id', $request->achievement);
        
        //We will have two way to limit the history. One will employ soft and 
        //hard limits. It will be used to fetch history nessecery to determine
        //the progress for an achievement. The other way will employ startDate 
        //and endDates for operations that do not require precision like the profile
        //calendar
        $limit = 0;
        $time = time();
        //The softLimit is a timeframe of the current level in seconds
        if($request->softLimit)
            $limit = $time - $request->softLimit;
        //The hard limit is a date string of the last achieved level. We do this in order to prevent
        //timestamp calculations on the frontend, which may cause time differences due to timezones
        if($request->hardLimit && $limit < $hardLimit = strtotime($request->hardLimit))
            $limit = $hardLimit;
        
        if($limit)
            $query->whereBetween('date', [date('c', $limit), date('c', $time)]);
        elseif($request->startDate || $request->endDate)
        {
            if($request->startDate)
                $query->where('date', '>', date('c', $request->startDate));
            if($request->endDate)
                $query->where('date', '<', date('c', $request->endDate));
        }
        else
            $query->where('date', '<', date('c', $time));
    }
    
    protected function _listWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        if($request->extended)
            $query->with([
                'achievement'  => function($query){
                    $query->with(['locale' => function($query){
                        $query->where('locale', app('translator')->getLocale());
                    }]);
                    $query->with(['category']);
                }]);
    }
}
