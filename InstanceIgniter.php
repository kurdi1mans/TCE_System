<?php

	include_once 'DAO.php';
	include_once 'Mailer.php';
	include_once 'AccountManager.php';

	class InstanceIgniter
	{
		
		public function announceAllStarted()
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

			ini_set('max_execution_time', 0);

			$nonAnnouncedList = $dao->getNonAnnouncedStartedInstances();
			foreach ($nonAnnouncedList as $instance)
			{
				$this->announceInstance($instance[0]);
			}
			ini_set('max_execution_time', 30);
			return sizeof($dao->getNonAnnouncedStartedInstances())==0;
		}
		public function announceInstance($instance_id)
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

			if (isset($_SESSION["acctManager"]))
			{
				$acctManager = $_SESSION["acctManager"];
			}
			else
			{
				$acctManager = new AccountManager();
				$_SESSION["acctManager"] = $acctManager;
			}

			// generate announcement entries
			$dao->transferAnnouncementListEntries($instance_id);
			// check if there is someone who is not processed
			$list = $dao->getNonProcessedInAnnouncementList($instance_id);
			
			foreach ($list as $item)
			{
				//error_log("is going to be processed".json_encode($item));
				// create account if there is no one
				$supervisor = $dao->getSupervisorInfo($item[1]);
				$addResult = $acctManager->createAccount($supervisor[2],"supervisor");
				error_log("Account creation result".$addResult);
				if($addResult)
				{
					$sendResult = Mailer::sendEmail($supervisor[2],"Trainee Evaluation Required","Dear Mr.".$supervisor[1].",\nWe would like to kindly ask you to evaluate the trainees whom you are supervising.\nThis evaluation is required by KFUPM Training Department.\nRegards");
					if($sendResult) $sendResult = $this->informStudents($supervisor[0],$supervisor[1],$instance_id);
					if($sendResult) $dao->setProcessedInAnnouncementList($instance_id,$supervisor[0],1);
				}
			}
			//return sizeof($dao->getNonProcessedList($instance_id))==0;
			if(sizeof($dao->getNonProcessedInAnnouncementList($instance_id))==0)
			{
				$dao->setInstanceFullyAnnounced($instance_id,1);
				return true;
			}
			else
			{
				return False;
			}
		}

		private function informStudents($supervisor_id,$supervisor_name,$instance_id)
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
			$students = $dao->getSupervisorStudentListByinstance($supervisor_id,$instance_id);
			$success = true;
			foreach ($students as $student)
			{
				$email_sent_successfully = Mailer::sendEmail($student[3],"Supervisor Evaluation Required","Dear Mr.".$student[2].",\nWe would like to inform you that an account is made for you supervisor\"".$supervisor_name."\" in KFUPM's TCE System (Trainee Company Evaluation System).\nPlease, check with your supervisor to make sure the evaluation is filled before the expiration date.\nIf there are any issues, make sure you contact your training coordinator in KFUPM.\n Regards.");
				$success = $success && $email_sent_successfully;
			}
			return $success;
		}
	}

?>