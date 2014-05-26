<?php

include_once 'User.php';
class Supervisor extends User
{
	public $students;
	

	public function getScriptName($request)
	{
		return json_encode("supervisor.js");
	}
	public function getTabs() // generate the view for this user [Tabs]
	{

		$tabs = array("Students","Settings");
		return json_encode($tabs);		
	}

	public function getTabContent($request)
 	{
 		$tabName = $request->get("tabName");
 		$cmd = 'get'.$tabName.'TabContent';
 		return $this->$cmd();
 	}
 	private function getStudentsTabContent()
 	{
 		$dao = new DAO();
 		$supervisorID = $dao->getSupervisorID($this->username);
 		error_log("supervisor id is : ".$supervisorID[0]);
		$this->students = $dao->getSupervisorStudentList($supervisorID[0]);
		error_log("Students are here ".json_encode($this->students));
        return json_encode($this->students);
 	}

 	private function getSettingsTabContent()
 	{
 		$data = array("original_password","new_password","confirm_new_password");
 		return json_encode($data);
 	}


	//Student_ID,Fname,Lname,Training_Type,Major_Code,Instance_ID, Template_ID, Starting_Date, Expiration_Date, Evaluation_ID, Filling_date
	public function getStudentEvaluationData($request) // will take the student information and fetch the appropriate form for evaluation that student
	{
		$studentID = $request->get("studentId");
		error_log("this is the eval id = $studentID");
		$dao = new DAO();
		$eval="";
		foreach ($this->students as $row) {
			if($row[0]==$studentID)
			{
				$eval =$dao->getStudentEvaluation($row[9]);
				break;
			}
		}

		$evaluationArray = unserialize($eval[3]);
		$template = $eval[5];
		$globalVals = unserialize($template[2]);
		$fields = unserialize($template[3]);
		$data = array($evaluationArray,$globalVals,$fields);
		return json_encode($data);
		/*
		$evalString = unserialize($eval[3]);
		$criteria = array();
		$vals = array();
		foreach ($evalString as $key => $value) {
			$criteria[] = $key;
			$vals[] = $value;
		}
		$comb = array($criteria,$vals);
		*/


	}

	public function getStudentEvaluationForm($request)
	{

		$studentID = $request->get("studentId");
		error_log("student Id from getEvalForm : $studentID");
		$dao = new DAO();
		$template = "";
		foreach ($this->students as $key=>$row) 
		{
			if($row[0]==$studentID)
			{
				$template = $dao->getTemplateByID($row[6]);
				break;
			}
		}
		$arr = array(unserialize($template[2]),unserialize($template[3]),$studentID);
		return  json_encode($arr);

	}





	
	public function evaluate($request) // take evaluation data and store evalauation in the database 
	{
		
		$evaluationData = array(); // will hold only evaluation data. It is used to create an instance of evaluation.
		$studentID = $request->get("studentId");

		foreach ($request->getArray() as $key => $value) 
		{ // remove the [grp] and [cmd]  and [studentId] from request data array to obtain the serial 
			
			if($key == 'grp' || $key == 'cmd' || $key == 'studentId');
			else $evaluationData[] = $value;
		}

		error_log("eval array is : ".json_encode($evaluationData));

		$student = $this->getStudent($studentID); // try to get the student information from the $students array

		if($student != null) // if the student is found in the students array
		{
			// submit evaluation
			// eval Data
			$stuId = $student[0];
			$instId = $student[5];
			$serial = serialize($evaluationData);
			error_log(json_encode($evaluationData));
			//$date = date("Y-m-d H:i:s");
			$dao = new DAO();
			$supervisorID = $dao->getSupervisorID($this->username);
			
			$evaluationId = $dao->submitStudentEvaluation($stuId,$instId,$serial,$supervisorID[0]);
			return json_encode(true);
		}
		return json_encode("Student could not be evaluated");

	}



	private function getStudent($stuId) // returns null if student is not found
	{
		foreach ($this->students as $key=>$row) 
		{

			if($row[0]==$stuId)
			{
				return $row;
			}
		}
	}
	
}

?>




