<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;


class LangController extends AbstractController
{

    //This is the translator
    protected $translator = NULL;
    
    //This is an array containing all available locales
    protected $locales = [
        'en' => [
            'code' => 'en',
            'active' => 0,
            'lable' => 'English'
        ],
        'bg' => [
            'code' => 'bg',
            'active' => 0,
            'lable' => 'Български'
        ],
    ];
    
    /**
     * Constructor
     * 
     * @param Request $request
     */
    public function __construct(Request $request) {
        
        $this->translator =  app('translator');
        
        //We are not using the parent constructor so we must set the locale manually
        if($request->cookie('locale'))
            app('translator')->setLocale($request->cookie('locale'));
        
        //We set the current locale to be active in the locales list
        $this->locales[$this->translator->getLocale()]['active'] = 1;
    }
    
    /**
     * This returns a list of the available locales
     * 
     * @param Request $request
     */
    public function getLocaleCurrent(Request $request) 
    {
        $this->_success(['locale' => $this->translator->getLocale()]);
    }
    
    /**
     * This returns the current locale
     * 
     * @param Request $request
     */
    public function getLocaleList(Request $request) 
    {
        $this->_success(['locales' => $this->locales]);
    }
    
    
    /**
     * Sets the locale to the one in the request
     * 
     * @param Request $request
     * @return Response
     */
    public function setLocale(Request $request)
    {
        if(!$request->locale)
            $this->_fail([trans('responses.invalid_input')]);
        
        $response = new Response("");
        $response->withCookie(cookie()->forever('locale', $request->locale));
        
        return $response;
    }
    
    /**
     * Fetches translations for a specific page
     * 
     * @param Request $request
     */
    public function getPageTranslation(Request $request)
    {
        
    }
}