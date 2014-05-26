<?php

include_once 'DAO.php';
include_once 'User.php';
include_once 'TDE.php';
include_once 'Supervisor.php';


session_start();

class Authorizer
{
	
	public $dao_username;
	public $dao_password;
	public $dao_usergroup;
	
	
	public function authorize($username,$password)
	{
		error_log("authorize is called");
		
		$this->getUserData($username);

		date_default_timezone_set('Asia/Riyadh');
		$date = date('d,M,Y,H:i', time());
		$hashed_password_stamped = md5($this->dao_password.$date);

		if($password == $hashed_password_stamped)
		{
			if($this->dao_usergroup == "supervisor")
			{
				error_log("USERNAME FROM AUTHORIZER IS : ".$username);
				$super = new Supervisor();
				$super->set($username,"");
				return $super;
			}
			else if($this->dao_usergroup == "tde")
			{
				//error_log("Creating TDE  : $this->dao_username");
				$tde = new TDE();
				$tde->set($username,"");
				return $tde;
			}
			else if($this->dao_usergroup == "coord")
			{

			}
			else if($this->dao_usergroup == "advisor")
			{

			}
			else if($this->dao_usergroup == "admin")
			{

			}
			else
			{
				//return error ... user is legal but usergroup is bugged
			}
		}
		else
		{
			return null;//login fails ... redirect to loginpage
		}		
	}


	public function getUserData($username)
	{
		$dao = new DAO();
		$userinfo = $dao->getUserInfo($username);
		$this->dao_username = $userinfo[0];
		$this->dao_password = $userinfo[1];
		$this->dao_usergroup = $userinfo[2];
	}
}


?>
