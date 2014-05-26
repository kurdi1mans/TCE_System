<?php

include_once 'DAO.php';
include_once 'User.php';
include_once 'Supervisor.php';
include_once 'Student.php';
include_once 'TDE.php';
include_once 'InstanceIgniter.php';
include_once 'AccountManager.php'; 
session_start();

class Action_Ajax
{ 

	public function getTemplateByID($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getTemplateByID($request);
	}
	public function resetForgottenPassword($request)
		{
			$accountManager = new AccountManager();
			$username = $request->get("username");
			error_log("We made here in resetForgottenPassword");
			echo json_encode($accountManager->resetPassword($username));
		}
		public function getServerTime()
		{
			date_default_timezone_set('Asia/Riyadh');
			$date = date('d,M,Y,H:i', time());
			echo json_encode($date);
		}
	public function RemindeSupervisor($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->RemindeSupervisor($request);
	}

	public function RemindAll($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->RemindAll($request);
	}

	public function controlOp($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->controlOp($request);
	}

	public function exportData($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->exportData($request);
	}


	public function updateTrainingType($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateTrainingType($request);
	}

	public function addTrainingType($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addTrainingType($request);
	}

	public function deleteTrainingType($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteTrainingType($request);
	}

	public function updateCollege($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateCollege($request);
	}

	public function addCollege($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addCollege($request);
	}

	public function deleteCollege($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteCollege($request);
	}

	public function updateDepartment($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateDepartment($request);
	}

	public function addDepartment($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addDepartment($request);
	}

	public function deleteDepartment($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteDepartment($request);
	}

	public function updateMajor($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateMajor($request);
	}

	public function addMajor($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addMajor($request);
	}

	public function deleteMajor($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteMajor($request);
	}

	public function updateCourse($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateCourse($request);
	}

	public function addCourse($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addCourse($request);
	}

	public function deleteCourse($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteCourse($request);
	}

	public function getStudentProfile($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getStudentProfile($request);
	}

    public function getTabs($request)
	{
		// assume user is authorized && $user holds all information 
		$user = $_SESSION["user_instance"];
		echo $user->getTabs();
	}

	public function getScriptName($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getScriptName($request);
	}

	public function getTabContent($request)
	{
		// assume user is authorized && $user holds all information 
		$user = $_SESSION["user_instance"];
		echo $user->getTabContent($request);
	}

	public function getStudentEvaluationData($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getStudentEvaluationData($request);
	}

	public function getStudentEvaluationForm($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getStudentEvaluationForm($request);
	}


	public function getInstances($request)
	{
		$user = $_SESSION["user_instance"];
		echo  $user->getInstances($request);
	}

	public function updateInstance($request)
	{
		$user = $_SESSION["user_instance"];
		echo  $user->updateInstance($request);
	}

	public function deleteInstance($request)
	{
		$user = $_SESSION["user_instance"];
		echo  $user->deleteInstance($request);
	}

	public function addInstance($request)
	{
		$user = $_SESSION["user_instance"];
		echo  $user->addInstance($request);
	}

	public function getInstanceStudentList($request)
	{
		$user = $_SESSION["user_instance"];
		echo  $user->getInstanceStudentList($request);
	}

	public function getDomainsByInstanceID($request)
	{
		$user = $_SESSION["user_instance"];
		echo  $user->getDomainsByInstanceID($request);
		
	}

	public function getTemplates($request)
 	{
 		$user = $_SESSION["user_instance"];
		echo  $user->getTemplates($request);
 	}

	public function evaluate($request)
	{

		$user = $_SESSION["user_instance"];
		echo  $user->evaluate($request);
	}

	public function changeUserPassword($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->changePassword($request);
	}

	public function deleteEvaluation($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteEvaluation($request);
	}
	public function deleteDomain($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteDomain($request);
	}

	public function updateDomain($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateDomain($request);
	}

	public function addDomain($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addDomain($request);
	}

	public function deleteTemplate($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteTemplate($request);
	}

	public function addTemplate($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addTemplate($request);
	}

	public function updateTemplate($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateTemplate($request);
	}

	public function deleteStudent($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteStudent($request);
	}
	public function updateStudent($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->updateStudent($request);
	}
	public function addStudent($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addStudent($request);
	}

	public function getStudent($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getStudent($request);
	}
	public function getSupervisors($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getSupervisors($request);
	}

	public function deleteSupervisor($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->deleteSupervisor($request);
	}

	public function addSupervisor($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->addSupervisor($request);
	}

	public function getCompanies($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getCompanies($request);
	}

	public function startDataImportingTransaction($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->startDataImportingTransaction($request);
	}

	public function insertDataImportingRow($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->insertDataImportingRow($request);
	}

	public function commitDataImportingTransaction($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->commitDataImportingTransaction($request);
	}



	public function getList($request)
	{
		$user = $_SESSION["user_instance"];
		echo $user->getList($request);
	}

}
?>