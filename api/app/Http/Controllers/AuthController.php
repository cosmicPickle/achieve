<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use App\Http\Middleware\AuthMiddleware as Auth;
use App\Http\Models\Users as Users;
use App\Http\Models\UserGroups as Groups;

class AuthController extends AbstractController
{

    /**
     * Constructor
     * 
     * @param Request $request
     */
    public function __construct(Request $request) {
        Auth::init();
        
        //We are not using the parent constructor so we must set the locale manually
        if($request->cookie('locale'))
            app('translator')->setLocale($request->cookie('locale'));
    }
    
    /**
     * Used to create a temporary guest user and log the user as it
     * 
     * 
     */
    public function guestCreate() {

        //Creating the guest user
        $tmpEmail = "user_". time() . rand(1000, 9999);
        $tmpPass =  substr(str_shuffle("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"), 0, 10);
        $tmpGroup = (new Groups)->where('alias', 'achiever')->get()[0];
        
        $tmpUser = new Users();
        $tmpUser->email = $tmpEmail;
        $tmpUser->energy = 10;
        $tmpUser->password = Auth::hash($tmpPass);
        $tmpUser->temporary = 1;
        $tmpUser->last_login =  date('c', time());
        
        $tmpGroup->users()->save($tmpUser);
        
        if(!Auth::buildJWT($tmpEmail, $tmpPass))
            //Failed to build => something got wrong in insert
            $this->_unauthorized();
        
        //Let's set the JWT in a cookie ... FOREVER (... well 5 years according
        //to Lumen's documentation)
        $response = new Response($this->_success([], TRUE));
        $response->withCookie(cookie()->forever('jwt', Auth::getJWT()));

        return $response;
    }
    
    /**
     * Used to log in users
     * 
     * @param Request $request
     * @return Response
     */
    public function login(Request $request)
    {
        if($request->ajax() || $request->isAjax)
            return $this->_loginAjax($request);
        else
            return $this->_loginHttp($request);
    }
    
    /**
     * Guess what it's used for ... That's right - dancing
     * 
     * @param Request $request
     * @return Response
     */
    public function logout(Request $request)
    {
        if(!cookie('jwt'))
            $this->_unauthorized();
        
        //Let's NULL the JWT in that 4 years and 268 days old cookie
        $response = new Response($this->_success([], TRUE));
        $response->withCookie(cookie('jwt', ''));
        
        return $response;
    }
    
    /**
     * This function checks if the user has a valid token in their cookie
     * 
     * @param Request $request
     */
    public function token(Request $request)
    {
        Auth::setJWT($request->cookie('jwt'));
        
        if(!Auth::checkJWT())
            $this->_unauthorized();
        
        $user = Auth::user(NULL, FALSE);
        $this->_success([
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'unlocked' => $user->unlocked,
                'energy' => $user->energy,
                'temporary' => $user->temporary,
                'completed_tutorial' => $user->completed_tutorial
            ]
        ]);
    }
    
    /**
     * This function will attempt to login Ajax requests. Mainly used for testing 
     * 
     * @param Request $request
     * @return Response
     */
    protected function _loginAjax(Request $request)
    {
        if(!$request->email || !$request->password)
            //Wrong request
            $this->_unauthorized();
        
        if(!Auth::buildJWT($request->email, $request->password))
            //Failed to build => wrong credentials
            $this->_unauthorized();
        
        //Let's set the JWT in a cookie ... FOREVER (... well 5 years according
        //to Lumen's documentation)
        $response = new Response($this->_success([], TRUE));
        $response->withCookie(cookie()->forever('jwt', Auth::getJWT()));
        
        return $response;
    }
    
    protected function _loginHttp(Request $request) {
        
        $referer = explode('client/', $request->server('HTTP_REFERER'))[0];

        if(!$request->email || !$request->password)
            //Wrong request
            return redirect($referer . 'client/login.html#empty');
        
        if(!Auth::buildJWT($request->email, $request->password))
            //Failed to build => wrong credentials
            return redirect($referer . 'client/login.html#invalid');
        
        //Let's set the JWT in a cookie ... FOREVER (... well 5 years according
        //to Lumen's documentation)
        $response = new Response("<script type='text/javascript'>window.location = '" . $referer . "client/index.html#/category/achievements/top' </script>");
        $response->withCookie(cookie()->forever('jwt', Auth::getJWT()));

        return $response;
    }
}