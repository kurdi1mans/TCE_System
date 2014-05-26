<?php

	include_once 'DAO.php';
	include_once 'Mailer.php';

	class Reminder
	{
		public function RemindAll($instance_id)
		{
			$dao = self::setDAO();
			ini_set('max_execution_time', 0);

			$supervisors = $dao->getInstanceSupervisors($instance_id);

			$successfullyRemindedAll = true;
			foreach($supervisors as $supervisor)
			{
				$success = self::sendReminderEmail($supervisor);
				$successfullyRemindedAll = $successfullyRemindedAll && $success;
			}
			ini_set('max_execution_time', 30);
			return $successfullyRemindedAll;
		}

		public function RemindeSupervisor($supervisor_id)
		{
			$dao = self::setDAO();
			$supervisor = $dao->getSupervisorInfo($supervisor_id);
			return self::sendReminderEmail($supervisor);
		}

		private function sendReminderEmail($supervisor)
		{
			return Mailer::sendEmail($supervisor[2],"Trainee Evaluation Required","Dear Mr.".$supervisor[1].",\nWe would like to kindly ask you to evaluate the trainees whom you are supervising.\nThis evaluation is required by KFUPM Training Department.\nAn Account has been already made for you in the system.\nIf you forgot your password, you can reset it in the login page.\nRegards");
		}

		private function setDAO()
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