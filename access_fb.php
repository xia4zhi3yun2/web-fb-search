<?php 


//access to facebook sdk
    require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';
    date_default_timezone_set('America/Los_Angeles');
    $fb = new Facebook\Facebook([ 
        'app_id' => '1098733450235486',
        'app_secret' => 'ceb34774cbd68abc3dd1e5ff89b9067f', 
        'default_graph_version' => 'v2.8', ]);
    $token='EAAPnStEBDl4BAHnMjFcg3eSvZCH0UwsXOVEVkK0lp31AdtaM1EpSZB4uNkEcZC8mbASiAZBq7vanFsZA826s5mmd6VhKZBcaf9g9BAXz122ZAaOnUrFEtqtLZA8YOoHK6LGK85pmV7ZCnxsof3cX7cTMdKJ92Rm0iq60ZD';  
    $fb->setDefaultAccessToken($token);





//fetch detail data
if($_GET['f']=='details'){
    try {
        $url=$_GET['id'].'? fields= albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5){created_time,message}';
        $request=$fb->get($url);
        $detail_string=$request->getBody();
    
        echo $detail_string;
    } catch (Facebook\Exceptions\FacebookResponseException $e) {
    exit;
    }
    
}


    

else if($_GET['f']=='all'){
    
    //get data
    $url='search?q='.$_GET['keyword'].'&type=user&fields= id,name,picture.width(700).height(700)';
    $request=$fb->get($url);
    $user_string=$request->getBody();
    // $graphEdge=$request->getGraphEdge();

    $url='search?q='.$_GET['keyword'].'&type=page&fields= id,name,picture.width(700).height(700)';
    $request=$fb->get($url);
    $page_string=$request->getBody();

    $url='search?q='.$_GET['keyword'].'&type=event&fields= id,name,picture.width(700).height(700)';
    $request=$fb->get($url);
    $event_string=$request->getBody();

    if($_GET['latitude'] && $_GET['longtitude']){
        $url='/search?q='.$_GET['keyword'].'&type=place&center='.$_GET['latitude'].','.$_GET['longtitude'].'&distance=&fields=id,name,picture.width(700).height(700)';
    }
    else{
         $url='/search?q='.$_GET['keyword'].'&type=place&center=&distance=&fields=id,name,picture.width(700).height(700)';
    }
    $request=$fb->get($url);
    $place_string=$request->getBody();

    $url='search?q='.$_GET['keyword'].'&type=group&fields= id,name,picture.width(700).height(700)';
    $request=$fb->get($url);
    $group_string=$request->getBody();

    
   
    echo json_encode(array("user" => $user_string, "page" => $page_string, "event" => $event_string,"place" => $place_string,"group" => $group_string));
}
?>