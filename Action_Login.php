<?php


include 'Authorizer.php';
//session_start();

class Action_Login
{

    public function login($request)
    {
		if (isset($_SESSION["authorizer"]))
        {
            $authorizer = $_SESSION["authorizer"];
        }
        else
        {
            $authorizer = new Authorizer();
            $_SESSION["authorizer"] = $authorizer;
        }

        //echo json_encode(json_encode($request->get('username')).json_encode($request->get('hashed_password')));
		$user_instance = $authorizer->authorize($request->get('username'),$request->get('hashed_password'));
        if($user_instance != null)
        {
            $_SESSION["user_instance"] = $user_instance;
            echo json_encode(true);
        }
		else
        {
            echo json_encode(false);
        }
    }
}
?>
