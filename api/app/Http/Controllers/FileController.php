<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Middleware\AuthMiddleware as Auth;

class FileController extends AbstractController
{
    
    protected $allowed = ['jpeg', 'jpg', 'png'];
    protected $uploadPath = "resources/files/images/";
    /**
     * Constructor
     * 
     * @param Request $request
     */
    public function __construct(Request $request) {

        if($request->cookie('locale'))
            app('translator')->setLocale($request->cookie('locale'));

        //Initializing the auth class
        Auth::init();
        
        //Checking if the cookie contains the JWT
        if($request->cookie('jwt'))
            Auth::setJWT($request->cookie('jwt'));
        
        if(!Auth::authenticateJWT($request->path(), $request->method()))
            $this->_unauthorized();
    }
    
    public function getUserFiles(Request $request) {
        
        $userFolder = base64_encode(Auth::user('email'));
        $uploadFolder = $this->_getUploadPath($userFolder);
        
        if(!is_dir($uploadFolder))
            $this->_success (['files' => []]);
        
        $files = [];
        foreach(scandir($uploadFolder) as $file)
            if($file == '.' || $file == '..')
                continue;
            else
                $files[] = $this->_getFileUrl ($request, $file, $userFolder);
        
        $this->_success(['files' => array_values($files)]);
    }
    
    public function upload(Request $request)
    {
        if(!$request->filename)
            $request->filename = 'file';
        
        if(!$request->hasFile($request->filename) || !$request->file($request->filename)->isValid())
            $this->_fail([trans('responses.invalid_input')]);
        
        if(!in_array($request->file($request->filename)->guessExtension(), $this->allowed))
            $this->_fail([trans('responses.invalid_file_type')]);
        
        $userFolder = base64_encode(Auth::user('email'));
        $uploadFolder = $this->_getUploadPath($userFolder);
        if(!$this->_createDir($uploadFolder))
            $this->_fail([trans('responses.upload_error')]);   
        
        $destFile = base64_encode(time()).".".$request->file($request->filename)->guessExtension();
        $uploadedFile = $request->file($request->filename)->move($uploadFolder, $destFile);
        if($uploadedFile == null)
            $this->_fail([trans('responses.upload_error')]);   
        
        $this->_success(['uploaded_file' => $this->_getFileUrl($request, $destFile, $userFolder)]);
    }
    
    protected function _getUploadPath($folder = NULL)
    {
        $path = realpath(getcwd()."../../") . DIRECTORY_SEPARATOR;
        $path .= str_replace('/', DIRECTORY_SEPARATOR, $this->uploadPath);
        $path .= ($folder ? $folder : "system") . DIRECTORY_SEPARATOR;
        
        return $path;
    }
    
    protected function _createDir($dir)
    {
        if (!is_dir($dir)) 
            return @mkdir($dir, 0777, TRUE);
        
        return TRUE;
    }
    
    protected function _getFileUrl(Request $request, $destFile, $folder = NULL)
    {
        $url = 'http://' . $request->server('HTTP_HOST') 
               . explode('public/',$request->server('PHP_SELF'))[0]
               . $this->uploadPath . ($folder ? $folder : "system")
               . '/' . $destFile;
        
        return $url;
    }
}