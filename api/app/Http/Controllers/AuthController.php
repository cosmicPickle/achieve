<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use App\Http\Middleware\AuthMiddleware as Auth;

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
     * Used to log in users
     * 
     * @param Request $request
     * @return Response
     */
    public function login(Request $request)
    {
        if($request->ajax())
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
        
        $this->_success([]);
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