<?php
class User 
{
	public $username;
	public $privileges;

	public function set($given_username,$given_privileges)
	{
		$this->username = $given_username;
		$this->privileges = $given_privileges;
	}
	
	public function getTabs()
 	{
 		
 	}

 	public function getUsername()
 	{
 		return $this->username;
 	}

 	public function changePassword($request)
	{
		$dao = new DAO();
		$user = $dao->getUserInfo($this->username); // retrrive user infor from database for comparison 
		//error_log("username : $user[0]");
		$originalPass = $request->get("original_password");
		$newPass = $request->get("new_password");
		

		date_default_timezone_set('Asia/Riyadh');
		$date = date('d,M,Y,H:i', time());
		$hashed_password_stamped = md5($user[1].$date);
		
		error_log("pass : $originalPass");
		error_log("newpass : $newPass");
		error_log("db : $hashed_password_stamped");

		if($originalPass==$hashed_password_stamped)
		{
			$updated = $dao->updateUserPassword($user[0],$newPass);
			return json_encode($updated);
		}
		else return json_encode(false);

	}

	public  function getDAO()
		{
			if (isset($_SESSION["dao"]))
			{
				$dao = $_SESSION["dao"];
				return $dao;
			}
			else
			{
				$dao = new DAO();
				$_SESSION["dao"] = $dao;
				return $dao;
			}
		}
}

?>