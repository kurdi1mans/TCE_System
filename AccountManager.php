<?php

	include_once 'DAO.php';
	include_once 'Mailer.php';
	
	class AccountManager
	{

		// pre-conditions:	the evaluation is announced and an account is needed for the user
		// post-conditions:	the account is made and password is sent to the user. returns true on success
		public function createAccount($email,$user_group)
		{
			if (isset($_SESSION["dao"]))
			{
				$dao = $_SESSION["dao"];
			}
			else
			{
				$dao = new DAO();
				$_SESSION["dao"] = $dao;
			}


			$password = $this->getRandomPassword();
			$addResult = $dao->addUser($email,md5($password),$user_group);
			if($addResult)
			{
				return $this->informUser($email,"create",$password);
			}
			else
			{
				error_log("reset will be called instead");
				return $this->resetPassword($email);
			}
		}

		public function resetPassword($email)
		{
			if (isset($_SESSION["dao"]))
			{
				$dao = $_SESSION["dao"];
			}
			else
			{
				$dao = new DAO();
				$_SESSION["dao"] = $dao;
			}
			$password = $this->getRandomPassword();
			$user_data = $dao->getUserInfo($email);
			if($user_data == null) return false;
			$updateResult = $dao->updateUserPassword($email,md5($password));
			if($updateResult) return $this->informUser($email,"reset",$password);
			else return false;
		}

		private function informUser($email,$message_type,$password)
		{
			if($message_type == "create")
			{
				$sendResult = Mailer::sendEmail($email,"TCE Account Created","Dear user,\nAn account has be created for you in KFUPM's TCE System (Trainee Company Evaluation System).\nUsername = \"$email\"\nPassword is \"$password\"\nRegards");
				return $sendResult;
			}
			else if($message_type == "reset")
			{
				$sendResult = Mailer::sendEmail($email,"TCE User Password Reset","Dear user,\nThe password of the account for \"$email\" in KFUPM's TCE System (Trainee Company Evaluation System) has been reset\nBelow are the new credintials.\nUsername is \"$email\"\nPassword is \"$password\"\nRegards");
				return $sendResult;
			}
			else
			{
				error_log("Error at AcccountManager::informUser: the supplied message_type is not supported");
			}
		}

		public function getRandomPassword()
		{
			$charactersSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
		    $password = '';
		    for($i = 0; $i < 10; $i++) $password .= $charactersSet[rand(0, 61)];
		    return $password;
		}

	}

?>