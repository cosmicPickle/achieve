<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use App\Http\Models\Users;
use App\Http\Models\RouteAccess;

class AuthMiddleware
{
    /**
     * We are going to use the middleware a bit differently than expected
     * 
     */
    
    //The secure key set in the config
    protected static $secureKey;
    //The user model
    protected static $user;
    //The user's data is stored here once they are authenticated
    protected static $userData;
    //The JWT
    protected static $jwt;
    
    /**
     * The constructor 
     * 
     * @param mixed
     */
    public static function init($jwt = NULL) 
    {
        //Getting the secure key from the configuration
        \App::configure('auth');
        self::$secureKey = base64_decode(config('auth.jwtkey'));
        
        //Creating the user model
        self::$user = new Users();
        
        //We have a JWT set
        if($jwt)
            self::$jwt = $jwt;
    }
    /**
     *  Calls the inner _hash function 
     */
    public static function hash($str) {
        return self::_hash($str);
    }
    
    /**
     * This function gets the user data if such is present
     * 
     * @param string
     */
    public static function user($key = NULL, $fromToken = TRUE)
    {
        //Check if the token is valid
        $token = self::checkJWT();
        
        if($fromToken && !$token)
            //We have invalid token
            return NULL;
        
        if($fromToken)
            $data = $token->data->user;
        else
            $data = (object)(new Users())->where('id', $token->data->user->id)
                                         ->with(['group', 'unlocked'])
                                         ->get()[0]->toArray();
        
        if(!$key)
            return $data;

        return isset($data->{$key}) 
               ? $data->{$key} : NULL;
    }
    
    /**
     * Determines whether a user is developer
     * 
     * @return boolean
     */
    public static function isDeveloper()
    {
        //Check if the token is valid
        $token = self::checkJWT();

        if(!$token)
            //We have invalid token
            return FALSE;
        
        return $token->data->user->group->developer;
    }
    
    /**
     * Determines whether a user is administrator
     * 
     * @return boolean
     */
    public static function isAdmin()
    {
        //Check if the token is valid
        $token = self::checkJWT();

        if(!$token)
            //We have invalid token
            return FALSE;
        return $token->data->user->group->administrator;
    }
    
    /**
     * Check's user token to see if it's valid
     * 
     * @param string $route
     * @param GET/POST/PUT/DELETE $method
     * @return boolean
     */
    public static function authenticateJWT($route, $method)
    {
        //Check if the token is valid
        $token = self::checkJWT();

        if(!$token)
            //Nope
            return FALSE;
        
        //We have a developer
        if(self::isDeveloper())
            return TRUE;
        
        //Check if the user's group has access to this route
        $grpCheck = RouteAccess::where('user_groups_id', $token->data->user->user_groups_id)
                               ->where('route', $route)
                               ->where('method', $method)
                               ->get()->count();
        
        return $grpCheck;      
    }

    /**
     * Builds a JWT for a user if his credentials check out or returns false
     * 
     * @param string $email
     * @param string $password
     * @param int $ttl - time to live
     * @return boolean
     */
    public static function buildJWT($email, $password, $ttl = 0)
    {
        //Does the user exist?
        if(!self::_authenticateUser($email, $password))
            return FALSE;
        
        $time = time();
        $payload = [
            'iat'  => $time, //Issued 
            'jti'  => base64_encode(mcrypt_create_iv(32)), //Token id                 
            'data' => [                  
                'user' => self::$userData //The user data (generated in _authenticateUser)
            ]
        ];

        //If we have ttl = 0 create infinitely valid key
        if($ttl != 0)
            $payload['exp'] = $time + $ttl;
        
        //Create the token
        self::$jwt = JWT::encode($payload, self::$secureKey, 'HS512');
        return TRUE;
    }
    
    public static function checkJWT()
    {
        //Ahm.. we don't seem to have a JWT
        if(!self::$jwt)
            return FALSE;
        
        try 
        {
            //Success or invalid credentials ... or expired
            $token = JWT::decode(self::$jwt, self::$secureKey, ['HS512']);
        } 
        catch (\Exception $e) 
        {
            return FALSE;
        }
        
        return $token;
    }
    
    /**
     * Setter
     * 
     * @param type $jwt
     */
    public static function setJWT($jwt)
    {
        self::$jwt = $jwt;
    }
    
    /**
     * Getter
     * 
     * @return type
     */
    public static function getJWT()
    {
        return self::$jwt;
    }
    
    /**
     * Used to authenticate the user
     * 
     * @param type $email
     * @param type $password
     * @return boolean
     */
    protected static function _authenticateUser($email, $password)
    {
        //Pretty standart
        $check = self::$user->where('email', $email)
                            ->where('password', self::_hash($password))
                            ->with(['group', 'unlocked'])
                            ->get();
        
        if($check->count())
        {
            //We have a valid user
            self::$userData = $check->first()->toArray();
            return TRUE;
        }
        
        //Nope.
        return FALSE;
    }
    
    /**
     * Password hashing function with salt.
     * 
     * @param type $str
     * @return type
     */
    protected static function _hash($str)
    {
        return md5($str.self::$secureKey);
    }
}
