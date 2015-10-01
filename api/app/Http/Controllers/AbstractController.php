<?php
/**
 * AbstractController
 * 
 * @author Teodor Klissarov
 * 
 * This class will serve as a base class to all controllers that handle requests.
 * It provides basic CRUD functionality as well as good extensibility. To create 
 * a new route:
 * 
 * 1. Create a controller with the appropriate name that extends this one
 * 2. Once that controller is created it already provides CRUD functions so you 
 * can route to it (ex. CustomController@create)
 * 3. You can define the following functions to extend functionality
 *      - For Create :
 *          _addCreateValidation - you can provide additional validation in this
 *          function and _fail the request should the need arise
 *          _prepCreateData - you can modify the data of the request here. Please
 *          note that it is intended for functions like hashing passwords and it 
 *          will run AFTER the validation
 *          _afterCreate - you can add this function if you have other actions that
 *          need to be performed after the node is successfully created
 *      - For Read :
 *         You can define multiple read routes on one node (ex. categories/list,
 *         categories/view)
 *         _{subrouteName/route}Filter - these functions will be called on the 
 *         appropriate route or sub route to filter the data that will be fetched
 *         _{subrouteName/route}With - these functions will be called on the 
 *         appropriate route or sub route to set which relations of the main
 *         model should be fetched
 *      - For Update : 
 *          _addUpdateValidation - you can provide additional validation in this
 *          function and _fail the request should the need arise
 *          _prepUpdateData - you can modify the data of the request here. Please
 *          note that it is intended for functions like hashing passwords and it 
 *          will run AFTER the validation
 *          _afterUpdate - you can add this function if you have other actions that
 *          need to be performed after the node is successfully created
 *          
 */

namespace App\Http\Controllers;

//Base dependencies
use Illuminate\Http\Request;
use Laravel\Lumen\Routing\Controller as BaseController;
use App\Http\Middleware\AuthMiddleware as Auth;

class AbstractController extends BaseController
{
    /*
     * System Variables
     */
    
    /*
     * General Settings
     */
    
    //The models namespace
    protected $modelNamespace = 'App\Http\Models';
    
    //The name of the main model we are going to work with
    protected $modelName = NULL;
    
    //The model object
    protected $model = NULL;
    
    //This is the validation array
    protected $validation = [
        "create" => [],
        "read" => [],
        "update" => [],
        "delete" => []
    ];
    
    /*
     * Read Settings
     */
    
    //Contains the names of the columns that the read method is allowed to fetch
    protected $readable = [];
    
    //Shows whether entities of this model can be created by a regular user. 
    //Effects whether the model can use "onlymy", "notmy" filters. It assumes
    //that if this option is enebled the table contains the following fields:
    //user_defined, users_id
    protected $allowUserCreation = 0;
    
    //The ordering of the returned list. The default is ['id', 'asc']
    protected $order = ['id', 'asc'];
    
    //Does the method allow pagination
    protected $paginate = true;
    
    //What is the current page
    protected $page = 1;
    
    //How many items per page should the method return
    protected $ipp = 10;
    
    /**
     * Delete Settings
     */
    
    //By which field to delete
    protected $allowDelete = TRUE;
    
    /**
     * Update Settings
     * 
     */
    
    //Shows which fields can be modified through the API. Defaults to all.
    protected $editable = [];
    
    /**
     * Create Settings
     * 
     */
    
    //Shows to which fields the API can write when creating a new entry. 
    //Defaults to all
    protected $writable = [];
    
    protected $debug = 1;
    
    //This is the debug data if debug mode is enabled
    protected $debugData = [];
    
    /**
     * Constructor
     * 
     * @return NULL
     */
    public function __construct(Request $request)
    {        
        //Debug mode is enabled
        if($this->debug){
            $this->debugData['database'] = [];
            
            //We are gonna log all queries
            \Event::listen('illuminate.query', function($query, $bindings)
            {
                $this->debugData['database'][] = [
                    'query' => $query,
                    'bindings' => $bindings
                ];
            });
        }

        //Let's first set the locale
        if($request->cookie('locale'))
            app('translator')->setLocale($request->cookie('locale'));
        
        //Nothing is going to work withouth a model name
        if(!$this->modelName)
            $this->_fail([trans('responses.invalid_configuration')]);
        
        //Initializing the auth class
        Auth::init();
        
        //Checking if the cookie contains the JWT
        if($request->cookie('jwt'))
            Auth::setJWT($request->cookie('jwt'));
        
        if($this->debug)
        {
            //We are also gonna add the current user
            $this->debugData['user'] = Auth::user();
        }
        
        if(!Auth::authenticateJWT($request->path(), $request->method()))
            $this->_unauthorized();
            
        //We get the full model name with namespace and all
        $model = implode('\\', array(
            $this->modelNamespace,
            $this->modelName
        ));
        
        //And we are ready
        $this->model = new $model();
        
    }
    
    public function create(Request $request)
    {
        //Ok. Let's start with some validation
        $validator = \Validator::make($request->all(), $this->validation[__FUNCTION__]);
        $errors = $validator->errors()->all();

        if($errors)
            $this->_fail($errors);
        
        //We might need aditional validation a user function can be called to
        //implement it
        $func = "_add".ucfirst(__FUNCTION__)."Validation";
        if(method_exists($this, $func))
            $this->{$func}($request);
            
        //We need to prep the data for use
        $this->_prepData($request, __FUNCTION__);
        
        //If the editable array is empty we populate it with all the columns of 
        //the table
        if(!$this->writable)
            $this->writable = \Schema::getColumnListing($this->model->getTable());
        
        foreach($request->all() as $key => $value)
            //Id is never writable
            if(in_array($key, $this->writable) && $key != 'id')
            {
                if($value === "")
                    $value = NULL;
                
                $this->model->{$key} = $value;
            }
            
        //Let's see how saving the model worked out
        try 
        {
            $this->model->save();
        } 
        catch (\Exception $e)
        {
            //Not so well I guess...
            $errors = [$e->getMessage()];
            $this->_fail($errors);
        }
        
        //Ok we got this
        if($this->model->id)
        {
            //Finally we might need to do some finish up work after we are done with 
            //the creation
            $func = "_after".ucfirst(__FUNCTION__);
            if(method_exists($this, $func))
                $this->{$func}($request, $this->model->id);
            
            $this->_success([
               'insert_id' => $this->model->id
            ]);
        }
    }
    
    public function read(Request $request)
    {
        //There might be multiple "read" routes. So there might be multiple "read "
        //validation scopes. We need to check the $this->validation[__FUNCTION__] 
        //if it is a global route and the $this->validation[__FUNCTION__][{scope}]
        //if it there are multiple routes
        
        //First we get the last part of the route to function as our validation
        //scope
        $routeParts = explode("/", $request->path());
        $route = last($routeParts);
        //We need to check if the validation contains arrays. If it does it means
        //that there are subscopes of the validation
        $scoped = FALSE;
        if(isset($this->validation[__FUNCTION__]))
            foreach($this->validation[__FUNCTION__] as $val)
                if(is_array($val))
                   $scoped = TRUE;
            
        if(isset($this->validation[__FUNCTION__][$route]))
        {
            //We have multiple routes
            $validator = \Validator::make($request->all(), $this->validation[__FUNCTION__][$route]);
            $errors = $validator->errors()->all();

            if($errors)
                $this->_fail($errors);
        }
        else if(isset($this->validation[__FUNCTION__]) && !$scoped)
        {
            //We have one route or global "read" validation
            $validator = \Validator::make($request->all(), $this->validation[__FUNCTION__]);
            $errors = $validator->errors()->all();

            if($errors)
                $this->_fail($errors);
        }
        
        
        //If the readable array is empty we populate it with all the columns of 
        //the table
        if(!$this->readable)
            $this->readable = \Schema::getColumnListing($this->model->getTable());
        
        //Let's start building the query by selecting the appropriate columns
        $query = $this->model->select($this->readable);
        
        //Then we go to the controller-specific filters function
        $this->_readFilter($query, $request);
        
        //We add the "onlymy" and "notmy" filters if the model can be user defined
        if($this->allowUserCreation)
            if($request->onlymy)
                $query->where('user_defined', 1)
                      ->where('users_id', Auth::user('id'));
            elseif($request->notmy)
                $query->where('user_defined', 0);
            else
                $query->where(function($query){
                    $query->where(function($query){
                        $query->where('user_defined', 1)
                              ->where('users_id', Auth::user('id'));
                    })->orWhere('user_defined', 0);
                });
        
        //Then we add the ordering
        //Validating the order array
        if(is_array($request->order) && count($request->order) == 2 
           && in_array($request->order[0], $this->readable)
           && in_array(strtolower($request->order[1]), ['asc', 'desc']))
           //Phew...
                $this->order = $request->order;
        
        //Ordering
        $query->orderBy($this->order[0], $this->order[1]);
        
        //Let's see if we have pagination
        if(array_key_exists('paginate', $request->all()))
            $this->paginate = (int)$request->paginate;
        if($this->paginate)
        {
            if($request->page && (int)$request->page > 0 && (int)$request->page)
                $this->page = (int)$request->page;
            
            $skip = ($this->page - 1)*$this->ipp;
            $query->skip($skip)->take($this->ipp);
        }
        
        //Let's settle on relations we want to eager load
        $this->_readWith($query, $request);
        
        try {
            $data = $query->get();
        } 
        catch (\Exception $e) {
            
            //Hmmmmm...
            $errors = [$e->getMessage()];
            $this->_fail($errors);
        }
        
        $this->_success([
            $this->modelName => $data->toArray(),
            'ItemsNum' => $data->count(),
            'itemsPerPage' => $this->ipp,
            'isLast' => $data->count() < $this->ipp,
        ]);
        
    }
    
    public function update(Request $request)
    {
        //We validate the input with the validation array
        $this->_prepValidation($request, __FUNCTION__);
        $validator = \Validator::make($request->all(), $this->validation[__FUNCTION__]);
        $errors = $validator->errors()->all();
        
        if($errors)
            $this->_fail($errors);
        
        //We might need additional validation a user function can be called to
        //implement it
        $func = "_add".ucfirst(__FUNCTION__)."Validation";
        if(method_exists($this, $func))
            $this->{$func}($request);
            
        //We need to prep the data for use
        $this->_prepData($request, __FUNCTION__);
        
        if($this->allowUserCreation > 0)
        {
            //This model allows user creation. We need to be careful not to allow
            //users mess with other users' stuff...
            if($this->model->find($request->id)->users_id != Auth::user('id') && !Auth::isAdmin())
            //... unless this is an administrator
                $this->_fail([trans('responses.unauthorized')]);
        }
        else if($this->allowUserCreation == 0)
            //We are gonna have no user creation here
            if(!Auth::isAdmin())
                $this->_fail([trans('responses.unauthorized')]);
        //Note that if $this->allowUserCreation is < 0 - the user creation will not be sanitized here
        //This is made for special models like the Users model
            
            
        //If the editable array is empty we populate it with all the columns of 
        //the table
        if(!$this->editable)
            $this->editable = \Schema::getColumnListing($this->model->getTable());
        
        //The data array
        $data = [];
        
        foreach($request->all() as $key => $value)
            if(in_array($key, $this->editable) && $key != 'id')
            {
                if($value === "")
                    $value = NULL;
                
                $data[$key] = $value;
            }
        
        //Let's try to update the database
        try 
        {
            $result = $this->model->where('id', $request->id)
                                  ->update($data);
        } 
        catch (\Exception $e) 
        {
            //Well f$#@ ....
            $errors = [$e->getMessage()];
            $this->_fail($errors);
        }
        
        //Ok we got this
        if($result)
        {
            //Finally we might need to do some finish up work after we are done with 
            //the creation
            $func = "_after".ucfirst(__FUNCTION__);
            if(method_exists($this, $func))
                $this->{$func}($request, $request->id);
                
            $this->_success([
               'update_id' => $request->id
            ]);
        }
        else
            //Or maybe not...
            $this->_fail ([trans('responses.invalid_input')]);
    }
    
    public function delete(Request $request)
    {
        if(isset($this->validation[__FUNCTION__]))
        {
            $validator = \Validator::make($request->all(), $this->validation[__FUNCTION__]);
            $errors = $validator->errors()->all();

            if($errors)
                $this->_fail($errors);
        }
        //First, we have to check if the id is set
        if(!$request->id)
            $this->_fail([trans('responses.invalid_input')]);
        
        $model = $this->model->find($request->id);
        if($this->allowUserCreation)
        {
            if($model->users_id != Auth::user('id') && !Auth::isAdmin())
                $this->_fail([trans('responses.unauthorized')]);
                
        }
        else
            //We are gonna have no user delete stuff here
            if(!Auth::isAdmin())
                $this->_fail([trans('responses.unauthorized')]);
        if($request->force)
        {
            try 
            {
                if($model)
                    $model->forceDelete();
            } 
            catch (\Exception $e) 
            {
                $errors = [$e->getMessage()];
                $this->_fail($errors);
            }
        }
        else
        {
            try
            {
                $this->model->destroy($request->id);
            } 
            catch (\Exception $e) 
            {
                $errors = [$e->getMessage()];
                $this->_fail($errors);
            }
        }
        
        $this->_success([
            'deleted_id' => $request->id
        ]);
        
    }
    
    /**
     * This function sends a success response to the client side
     * 
     */
    protected function _success($data, $return = FALSE)
    {
        return $this->_respond(1, $data, NULL, $return);
    }
    
    /**
     * This function sends an error response to the client side
     * 
     */
    protected function _fail($errors, $return = FALSE)
    {
        return $this->_respond(0, NULL, $errors, $return);
    }
    
    /**
     * This function sends an unauthorized error to  the client side
     * 
     */
    
    protected function _unauthorized($return = FALSE)
    {
        return $this->_respond(-1, NULL, [trans('responses.unauthorized')], $return);
    }
    
    /**
     * This function creates the actual response 
     * 
     */
    protected function _respond($status, $data, $errors, $return = FALSE)
    {
        $resp = [
            'status' => $status,
            'data' => $data,
            'errors' => $errors
        ];
        
        if($this->debug);
        {
            $resp['debug'] = $this->debugData;
        }
        if(!in_array($status, [0,1]))
           $resp['status'] = -1;
        
        if(!$return)
        {
            echo json_encode($resp);
            exit(1);
        }
        else
            return json_encode($resp);
    }
    
    
    /**
     * This function adds some additions to the validation array for the update function
     * 
     */
    
    protected function _prepValidation(Request $request, $func)
    {    
        //First if there is 'unique' rule, we must add in the current id as exception
        foreach($this->validation[$func] as $column => $ruleset)
        {
            //We only want to apply validation to fields that are set. For example we
            //do not want to require a title if it is not set. This is an update not
            //an insert. So we will unset the rules for fields that aren't set.

            //PHP does not provide a viable method to distinguish if a property is set
            //to NULL or simply does not exist. So we will do it by array keys.
            if(!array_key_exists($column, $request->all()))
            {
                //No matching request attribute
                unset($this->validation[$func][$column]);
                continue;
            }
            
            preg_match('#(\|?unique:)(([a-zA-Z0-9_]+)(,[a-zA-Z0-9_]+)*)\|?$#', $ruleset, $matches);
            
            if(!$matches)
                continue;
            
            $ruleParts = explode(',', $matches[2]);
            
            //If we only have table set
            if(count($ruleParts) == 1)
                $ruleParts[1] = $column;
            //If we have both the table and the column se
            if(count($ruleParts) == 2)
                $ruleParts[2] = $request->input('id');
            
            //We have a custom unique rule set up. No touchy.
            $ruleParts = implode(',', $ruleParts);
            
            //Getting the whole rule
            $rule = $matches[1] . $ruleParts;
            
            //Replacing the original rule
            $this->validation[$func][$column] = str_replace($matches[0], $rule, $ruleset);
        }
        
        //We also need to add the id as a required field for validation
        $this->validation[$func]['id'] = 'required';
    }
    
    /**
     * This function prepares the data for the create and update methods.
     * It also calls user functions named _prepCreateDate and _prepUpdateData
     * accordingly
     * 
     */
    
    protected function _prepData(Request $request, $func)
    {
        $all = $request->all();
        //If there is a users_id input flagged "current" we need to substitute it
        //with the current user
        if($request->users_id && $request->users_id == -1)
        {
            $all['users_id'] = Auth::user('id');
        }
        
        if($request->user_groups_id && $request->user_groups_id == -1)
        {
            $all['user_groups_id'] = Auth::user('user_groups_id');
        }
        
        if($this->allowUserCreation && !Auth::isAdmin()) 
        {
            //This model allows user creation and this is not an admin, let's put 
            //that users_id
            $all['user_defined'] = 1;
            $all['users_id'] = Auth::user('id');
        }
        
        $request->replace($all);
        //Calling the user function
        $method = "_prep".ucfirst($func)."Data";
        if(method_exists($this, $method))
            $this->{$method}($request);
    }
    
    /**
     * Multiple GET routes can be defined to a single controller to accomodate
     * the need for different filters and eager loading requests. This function
     * runs the class defined filter named: _{subroute_name}Filter()
     * 
     * ex. categories/view will try to run _viewFilter in the Categories 
     * controller
     * 
     * @param Illuminate\Database\Eloquent\Builder
     * @param Request
     */
    
    protected function _readFilter(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $pathParts = explode('/',$request->path());
        $method = "_" . $pathParts[count($pathParts) - 1] . "Filter";
        if(method_exists($this, $method))
            $this->$method($query, $request);
    }
    
    /**
     * Multiple GET routes can be defined to a single controller to accomodate
     * the need for different filters and eager loading requests. This function
     * runs the class defined eager loading request named: 
     * _{subroute_name}With()
     * 
     * ex. categories/view will try to run _viewWith in the Categories 
     * controller
     * 
     * @param Illuminate\Database\Eloquent\Builder
     * @param Request
     */
    
    protected function _readWith(\Illuminate\Database\Eloquent\Builder $query, Request $request)
    {
        $pathParts = explode('/',$request->path());
        $method = "_" . $pathParts[count($pathParts) - 1] . "With";
        if(method_exists($this, $method))
            $this->$method($query, $request);
    }
}

