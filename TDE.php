<?php
include_once 'User.php';
include_once 'DataExporter.php';
include_once 'InstanceIgniter.php';
include_once 'Reminder.php';
include_once 'GarbageCollector.php';

class TDE extends User
{
	public $coordinators;
	public $supervisors;
	public $courses;

	public function getTemplateByID($request)
	{
		$tid = $request->get("templateId");
		$dao = $this->getDAO();
		$result = $dao->getTemplateByID($tid);
		return json_encode( array($result[0],$result[1],unserialize($result[2]),unserialize($result[3])));
	}
	public function getReminder()
	{
		if (isset($_SESSION["reminder"]))
			{
				$rem = $_SESSION["reminder"];
				return $rem;
			}
			else
			{
				$rem = new Reminder();
				$_SESSION["reminder"] = $rem;
				return $rem;
			}
	}

	public function RemindeSupervisor($request)
	{
		$supervisor_id = $request->get("supervisor_id");
		$reminder = $this->getReminder();
		$result = $reminder->RemindeSupervisor($supervisor_id);
		error_log("one ".$result);
		return json_encode($result);
	}

	public function RemindAll($request)
	{
		$instanceId = $request->get("instance_id");
		$reminder = $this->getReminder();
		$result = $reminder->RemindAll($instanceId);
		error_log("All ".$result);
		return json_encode($result);
	}

	public function controlOp($request)
	{
		$op = $request->get("op");
		error_log($op);
		if($op == "checkUnAnnounced")
		{
			$dao = $this->getDAO();
			$unAnn = $dao->getNonAnnouncedStartedInstances();
			return json_encode(sizeof($unAnn)<=0);
		}
		else if($op == "Announce")
		{
			$igniter = new InstanceIgniter();

			$result = $igniter->announceAllStarted();

			if($result == true)
			{
				return json_encode($result);
			}
			else 
			{
				$dao = $this->getDAO();
				$unAnn = $dao->getNonAnnouncedStartedInstances();
				return json_encode($unAnn);
			}
			
		}
		else if($op == "dexp")
		{
			
			$gc = new GarbageCollector();
			$gc->deleteOldDownloadFiles();
			return json_encode(true);

		}
	}

	public function exportData($request)
	{
		error_log("the serialized export  form is : ".json_encode($request->getArray()));
		$link = "";
		$export_option = $request->get("export_option");
		if($export_option == "Student Data")
		{
			$by = $request->get("export_by");
			$byValue = intval( $request->get("byValue"));
			$domainType = $request->get("domainType");
			$training = $request->get("training");
			error_log("data is $by -- $byValue -- $domainType -- $training");
			$dao = new DataExporter();
			$funct = "getStudentDataBy".$by;
			if($domainType == "All")
			{
				$all = intval($request->get("all"));
				$link = $dao->$funct($byValue,$all,null,null,null,$training);
			}
			else if($domainType == "College")
			{
				$college = $request->get("college");
				error_log("col $college");
				$link = $dao->$funct($byValue,0,$college,null,null,$training);
			}
			else if($domainType == "Department")
			{
				$dept = $request->get("department");
				error_log("dept $dept");
				$link = $dao->$funct($byValue,0,null,$dept,null,$training); 
			}
			else if($domainType == "Major")
			{
				$major = $request->get("major");
				error_log("maj $major");
				$link = $dao->$funct($byValue,0,null,null,$major,$training);
			}
		}
		else if($export_option == "Company Data")
		{
			$training = $request->get("training");
			$semester = $request->get("semester");
			error_log("$training ----- $semester");
			$dao = new DataExporter();
			$link = $dao->getCompanyDataBySemester(132,'coop');
		}
		
		return json_encode($link);
	}

	public function addTrainingType($request)
	{
		$type = $request->get("training");
		$dao = $this->getDAO();
		$result = $dao->addTrainingType($type);
		return json_encode($result);
	}

	public function deleteTrainingType($request)
	{
		$type = $request->get("training");
		$dao = $this->getDAO();
		$result = $dao->deleteTrainingType($type);
		return json_encode($result);
	}

	public function updateTrainingType($request)
	{
		$old = $request->get("old_training");
		$type = $request->get("training");
		error_log("old is $old and new is $type");
		$dao = $this->getDAO();
		$result = $dao->modifyTrainingType($old,$type);
		return json_encode($result);
	}

	public function deleteCollege($request)
	{
		$code = $request->get("college");
		$dao = $this->getDAO();
		$result = $dao->deleteCollege($code);
		return json_encode($result);
	}

	public function updateCollege($request)
	{
		$old = $request->get("old_college");
		$code = $request->get("college");
		$dao = $this->getDAO();
		$result = $dao->modifyCollege($old,$code);
		return json_encode($result);
	}

	public function addCollege($request)
	{
		$code = $request->get("college");
		$dao = $this->getDAO();
		$result = $dao->addCollege($code);
		return json_encode($result);
	}

	public function deleteDepartment($request)
	{
		$code = $request->get("dept_code");
		$dao = $this->getDAO();
		$result = $dao->deleteDepartment($code);
		return json_encode($result);
	}

	public function addDepartment($request)
	{
		$code = $request->get("dept_code");
		$college = $request->get("college");
		$dao = $this->getDAO();
		$result = $dao->addDepartment($code,$college);
		return json_encode($result);
	}

	public function updateDepartment($request)
	{
		$old = $request->get("old_dept");
		$code = $request->get("dept_code");
		$college = $request->get("college");
		$dao = $this->getDAO();
		$result = $dao->modifyDepartment($old,$code,$college);
		return json_encode($result);
	}

	public function deleteMajor($request)
	{
		$code = $request->get("major_code");
		$dao = $this->getDAO();
		$result = $dao->deleteMajor($code);
		return json_encode($result);
	}

	public function addMajor($request)
	{
		$major_code = $request->get("major_code");
		$dept_code = $request->get("department");
		$dao = $this->getDAO();
		$result = $dao->addMajor($major_code,$dept_code);
		return json_encode($result);
	}

	public function updateMajor($request)
	{
		$old_major = $request->get("old_major");
		$dept_code = $request->get("department");
		$new_major = $request->get("major_code");
		error_log("DEPT CODE IS = $dept_code");
		$dao = $this->getDAO();
		$result = $dao->modifyMajor($old_major,$new_major,$dept_code);
		return json_encode($result);
	}

	public function updateCourse($request)
	{
		$old_id = $request->get("old_id");
		$new_id = $request->get("courseId");
		$training_type = $request->get("training_type");
		$major = $request->get("major");
		$dao = $this->getDAO();
		$result = $dao->modifyCourse($old_id,$new_id,$training_type,$major);
		return json_encode($result);
	}

	public function deleteCourse($request)
	{
		$course_id = $request->get("courseId");
		$dao = $this->getDAO();
		$result = $dao->deleteCourse($course_id);
		return json_encode($result);
	}

	public function addCourse($request)
	{
		$course_id = $request->get("courseId");
		$training_type = $request->get("training_type");
		$major = $request->get("major");
		error_log("data : $course_id --- $training_type --- $major");
		$dao = $this->getDAO();
		$result = $dao->addCourse($course_id,$training_type,$major);
		return json_encode($result);
	}

	private function getCoursesTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$courses = $dao->getCourses();
 		return json_encode($courses);
 	}

 	private function getTrainingTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$types = $dao->getTrainingTypes();
 		return json_encode($types);
 	}

 	private function getDepartmentsTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$depts = $dao->getDepartments();
 		return json_encode($depts);
 	}

	public function getList($request)
	{
		$type = $request->get("type");
		$dao = $this->getDAO();
		if($type == "colleges")
		{
			$colleges = $dao->getColleges();
			return json_encode($colleges);
		}
		else if($type == "departments")
		{
			$depts = $dao->getDepartments();
			return json_encode($depts);
		}
		else if($type == "majors")
		{
			$majs = $dao->getMajors();
			return json_encode($majs);
		}
		else if($type == "training_types")
		{
			$tts = $dao->getTrainingTypes();
			return json_encode($tts);
		}
		else if($type == "Instance")
		{
			$insts = $dao->getInstances();
			$data = array();
			foreach ($insts as $key => $value) {
				$data[] = $value[0];
			}
			return json_encode($data);
		}
		else if($type == "Semester")
		{
			$semes = $dao->getSemesters();
			error_log(json_encode($semes));
			return json_encode($semes);
		}

	}

	public function getStudentProfile($request)
	{
		$id = $request->get("studentId");
		error_log("the id is $id");
		$dao = $this->getDAO();
		$profile = $dao->getStudentProfile($id);
		error_log(json_encode($profile));
		for ($i=0; $i < count($profile[1]); $i++) { 
			$profile[1][$i][3] = unserialize($profile[1][$i][3]);
		}
		return json_encode($profile);
	}

	public function getScriptName()
	{
		return json_encode("tde.js");
	}
 	public function getTabs() // generate the view for this user [Tabs]
	{		
		$tabs = array("Students","Evaluation Instances","Evaluation Templates","Import Data","Export Data","Control Panel","Courses","Majors","Departments","Colleges","Training Types","Settings");	
		return json_encode($tabs);
	}

	public function getTabContent($request)
 	{
 		$tabName = $request->get("tabName");
 		$cmd = 'get'.$tabName.'TabContent';
 		error_log("the call is to $cmd");
 		return $this->$cmd($request);
 	}
 	
 	private function getSettingsTabContent($request)
 	{
 		$data = array("original_password","new_password","confirm_new_password");
 		return json_encode($data);
 	}
 	private function getTemplatesTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$temps = $dao->getTemplates();
		$lst = array();
        foreach ($temps as $key => $value)
        { 
        	$lst[] = array($value[0],$value[1],unserialize($value[2]),unserialize($value[3]));
        }
 		return json_encode($lst);
 	}

 	private function getInstancesTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$insts = $dao->getInstances();
 		return json_encode($insts);
 	}

 	private function getCollegesTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$colgs = $dao->getColleges();
 		return json_encode($colgs);
 	}

 	private function getMajorsTabContent($request)
 	{	
 		$dao = $this->getDAO();
 		$majors = $dao->getMajors();
 		return json_encode($majors);
 	}


 	public function updateInstance($request)
 	{
 		$dao = $this->getDAO();
 		$instanceId = $request->get("instanceId");
 		$templateId = $request->get("template");
 		$semester = $request->get("semester");
 		$start_date = $request->get("sdate");
 		$exp_date = $request->get("edate");
 		$result = $dao->modifyInstance($instanceId,$templateId,$semester,$start_date,$exp_date);;
 		return json_encode($result);
 	}

 	public function deleteInstance($request)
	{
		$dao = $this->getDAO();
 		$instanceId = $request->get("instanceId");
 		$result = $dao->deleteInstance($instanceId);
 		return json_encode($result);
	}

	public function addInstance($request)
	{
		$dao = $this->getDAO();
 		$templateId = $request->get("template");
 		$semester = $request->get("semester");
 		$start_date = date('Y-m-d',strtotime($request->get("sdate")));
 		$exp_date = date('Y-m-d',strtotime($request->get("edate")));
 		$result = $dao->addInstance($templateId,$semester,$start_date,$exp_date);
 		return json_encode($result);
	}

	public function getInstanceStudentList($request)
	{
		$dao = $this->getDAO();
		$instanceId = $request->get("instanceId");
		$result = $dao->getInstanceStudentList($instanceId);
		return json_encode($result);
	}

	public function deleteTemplate($request)
	{
		$templateId = $request->get("templateId");
		$dao = $this->getDAO();
		$result = $dao->deleteTemplate($templateId);
		return json_encode($result);
	}

 	public function getTemplates($request)
 	{
 		$dao = $this->getDAO();
 		$temps = $dao->getTemplates();
 		return json_encode($temps);
 	}

 	public function addTemplate($request)
	{
		// efnameX , efXvalY
		// gfX, gfnvX
		$name = $request->get("name");
		$glob = array();
		$fields = array();
		$rowCount = $request->get("rowCount");
		$colCount = $request->get("colCount");
		error_log("row count : $rowCount");
		// serialize global_values into $glob
		for ($i=0; $i <$colCount ; $i++) { 
			$glob[$i][0] = $request->get("gf".$i);
			$glob[$i][1] = $request->get("gfnv".$i);
		}

		// serialize fields into field array
		for ($i=0; $i <$rowCount ; $i++) {
		 	$temp = array();
		 	$temp[0] = $i;
		 	$temp[] = $request->get("eftype".$i);
		 	$temp[] = $request->get("efname".$i);
			for ($j=0; $j <$colCount ; $j++) {  
				$x = $request->get("ef".$i."val".$j);
				if($x!="")$temp[] = $x;
			}
			$fields[$i] = $temp;
		}

		error_log("glob is : ".json_encode($glob));
		error_log("fields is : ".json_encode($fields));
		// serialize [vals] and [cri]

		$dao = $this->getDAO();
 		
 		$result = $dao->addTemplate($name,serialize($glob),serialize($fields));

 		return json_encode($result);
	}

	public function updateTemplate($request)
	{
		// efnameX , efXvalY
		// gfX, gfnvX
		$id = $request->get("id");
		$name = $request->get("name");
		$glob = array();
		$fields = array();
		$rowCount = $request->get("rowCount");
		$colCount = $request->get("colCount");
		
		error_log("cols :$colCount rows: $rowCount");
		// serialize global_values into $glob
		for ($i=0; $i <$colCount ; $i++) { 
			$glob[$i][0] = $request->get("gf".$i);
			$glob[$i][1] = $request->get("gfnv".$i);
		}

		// serialize fields into field array
		for ($i=0; $i <$rowCount ; $i++) {
		 	$temp = array();
		 	$temp[0] = $i;
		 	$temp[] = $request->get("eftype".$i);
		 	$temp[] = $request->get("efname".$i);
			for ($j=0; $j <$colCount ; $j++) {  
				$x = $request->get("ef".$i."val".$j);
				if($x!="")$temp[] = $x;
			}
			$fields[$i] = $temp;
		}

		error_log("glob is : ".json_encode($glob));
		error_log("fields is : ".json_encode($fields));
		// serialize [vals] and [cri]

		$dao = $this->getDAO();
 		$code = $request->get("code");
 		//$funct =$code.Template($id,$name,serialize($glob),serialize($fields)); 
 		$funct = $code."Template";
 		$result = $dao->$funct($id,$name,serialize($glob),serialize($fields));
 		//$result = $dao->$funct();
 		error_log("$result");
 		return json_encode($result);
	}

 	private function getStudentsTabContent($request)
 	{	
 		$id = $request->get("studentId");
 		if($id != "")
 		{
 			$dao = $this->getDAO();
 			$stu = $dao->getStudentInfo($id);
 			error_log("this is the student : ". json_encode($stu));
 			$arr = array($stu,null);
 			return json_encode($arr);
 		}
 	}

 	public function deleteDomain($request)
	{
		$domainId = $request->get("domainId");
		$dao = $this->getDAO();
		$result = $dao->deleteDomain($domainId);
		return json_encode($result);
	}

	public function updateDomain($request)
	{
		$domain_id = $request->get("domainId");
		$instance_id = $request->get("instanceId");
		$training_type = $request->get("training");
		$major_code = $request->get("major");
		$department_code = $request->get("department");
		$college_code = $request->get("college");
		$all = $request->get("all");
		if(!isset($all))$all=0;
		if(!isset($training_type))$training_type="";
		if(!isset($major_code))$major_code="";
		if(!isset($department_code))$department_code="";
		if(!isset($college_code))$college_code="";
		error_log("domain is : $domain_id");
		error_log("instance is : $instance_id");
		$dao = $this->getDAO();
		$result = $dao->modifyDomain($domain_id,$instance_id,$training_type,$major_code,$department_code,$college_code,$all);
		return json_encode($result);
	}

	public function addDomain($request)
	{
		//$domain_id = $request->get("domainId");
		$instance_id = $request->get("instanceId");
		$training_type = $request->get("training");
		$major_code = $request->get("major");
		$department_code = $request->get("department");
		$college_code = $request->get("college");
		$all = $request->get("all");
		if(!isset($all))$all=0;
		if(!isset($training_type))$training_type="";
		if(!isset($major_code))$major_code="";
		if(!isset($department_code))$department_code="";
		if(!isset($college_code))$college_code="";
		error_log("istance id is $instance_id");
		error_log("all is $all");
		$dao = $this->getDAO();
		$result = $dao->addDomain($instance_id,$training_type."",$major_code."",$department_code."",$college_code."",$all);
		return json_encode($result);
	}

 	private function getSupervisorsTabContent()
 	{	
 			$dao = $this->getDAO();
 			$this->supervisors = $dao->getSupervisorsWithCompanyInfo();
 			return json_encode($this->supervisors);
 	}

 	public function deleteSupervisor($request)
	{
		$supervisor_id = $request->get("supervisorId");
 		if($supervisor_id !=null)
 		{
 				$dao = $this->getDAO();
 				$status = $dao->deleteSupervisor($supervisor_id);
 				return json_encode($status);
 		}
 		return json_encode("you are not authorized to delete this supervisor");	
	}

	public function addSupervisor($request)
	{
		$name = $request->get("name");
		$email = $request->get("email");
		$company = $request->get("company");
		$dao = $this->getDAO();
		$status =$dao->addSupervisor($name,$email,$company);
		return json_encode($status);
	}

	public function getCompanies($request)
	{
		$dao = $this->getDAO();
		$companies = $dao->getCompanies();
		return json_encode($companies);
	}

	private function getImportTabContent()
 	{	
 		return json_encode("IMPORTING");	
 	}

 	public function deleteEvaluation($request)
 	{
 		$eval_id = $request->get("evaluation_id");
 		if($eval_id != null)
 		{
 			$dao = $this->getDAO();
 			$status = $dao->deleteEvaluation($eval_id);
 			return json_encode($status);
 		}
 		return json_encode("This student doesn't have an evaluation");
 	}

	public function deleteStudent($request)
	{
		$student_id = $request->get("studentId");
 		if($student_id !=null)
 		{
 				$dao = $this->getDAO();
 				$status = $dao->deleteStudent($student_id);
 				return json_encode($status);
 		}
 		return json_encode("you are not authorized to delete this student");
	}

	public function updateStudent($request)
	{
		$stduent = array();
		$student[0] = $request->get("studentId");
		$student[1] = $request->get("student_fname");
		$student[2] = $request->get("student_lname");
		$student[3] = $request->get("student_email");
		$student[4] = $request->get("courseId");
		$student[5] = $request->get("semester");
		$student[6] = $request->get("supervisor_name");
		$student[7] = $request->get("supervisor_email");
		$student[8] = $request->get("company_name");
		$student[9] = $request->get("company_location");
		$student[10] = $request->get("old_studentId");
		error_log("UPDATE STUDENT DATA IS HERE :--------------------------- ");
		foreach ($student as $key => $value) {
			error_log("$key => $value ");
		}
 		if($student !=null)
 		{
 				$dao = $this->getDAO();

 				$status = $dao->EditStudent($student[10],$student[0],$student[1],$student[2],$student[3],$student[4],$student[5],$student[6],$student[7],$student[8],$student[9]);
 				return json_encode($status);
 		}
 		return json_encode("you are not authorized to update this student");
	}
	
	public function getDomainsByInstanceID($request)
	{
		$instanceId = $request->get("instanceId");
		$dao = $this->getDAO();
		$doms = $dao->getDomainsByInstanceID($instanceId);
		return json_encode($doms);
	}
	
	//$Student_ID,$Fname,$Lname,$Email,$Course_ID,$Semester,$Supervisor_name,$Supervisor_email,$Company_name,$Company_location
	public function addStudent($request)
	{ 
		$stduent = array();
		$student[0] = $request->get("studentId");
		$student[1] = $request->get("student_fname");
		$student[2] = $request->get("student_lname");
		$student[3] = $request->get("student_email");
		$student[4] = $request->get("courseId");
		$student[5] = $request->get("semester");
		$student[6] = $request->get("supervisor_name");
		$student[7] = $request->get("supervisor_email");
		$student[8] = $request->get("company_name");
		$student[9] = $request->get("company_location");

		foreach ($student as $key => $value) {
			error_log("$key => $value");
		}

		$dao = $this->getDAO();
		$dao->startDataImportingTransaction();
		$status =$dao->insertDataImportingRow($student[0],$student[1],$student[2],$student[3],$student[4],$student[5],$student[6],$student[7],$student[8],$student[9]);
		$dao->commitDataImportingTransaction();
		error_log($status);
		return json_encode($status);
	}

	public function modifyStudent($request)
	{
		$stduent = array();
		$student[0] = $request->get("studentId");
		$student[1] = $request->get("fname");
		$student[2] = $request->get("lname");
		$student[3] = $request->get("email");
		$student[4] = $request->get("supervisor");
		error_log("student id is : $student[0]");
		error_log("student supervisor is : $student[3]");
		$dao = $this->getDAO();
		$status = $dao->updateStudent($student[0],$student[1],$student[2],$student[3],$student[4]);
		error_log($status);
		return json_encode($status);
	}

	public function getStudent($request)
	{
		$studentId = $request->get("studentId");
		$dao = $this->getDAO();
		$student = $dao->getStudent($studentId);
		return json_encode($student);

	}

	public function getSupervisors($request)
	{
		$dao = $this->getDAO();
 		$supers = $dao->getSupervisors();
 		return json_encode($supers);
	}

	public function startDataImportingTransaction($request)
	{
		$data = $request->get("data");
		$lines = explode("\n", $data);
		$dao = $this->getDAO();
 		$dao->startDataImportingTransaction();
 		$cont = true;

		for ($i=0; $i < count($lines) && $cont; $i++) { 
			$row = explode(";", $lines[$i]);
			error_log("before $cont and $i");
			if(count($row) == 10)
			{
				$cont = $dao->insertDataImportingRow($row[0] ,$row[1] ,$row[2] ,$row[3] ,$row[4] ,$row[5] ,$row[6] ,$row[7] ,$row[8] ,$row[9]);
				error_log(!$cont." and $i");
				if(!$cont) // inserting a certain line failed
				{
					return json_encode("Couldn't insert line # ".($i+1).", importing operation canceled");
				}
			}
			else 
			{
				return json_encode("Couldn't insert line # ".($i+1).", importing operation canceled");
			}
		}
		
		if($cont)$dao->commitDataImportingTransaction();
 		error_log("Students imported successfully");
 		return json_encode($cont);
	}
	
	public function getStudentEvaluationData($request) // will take the student information and fetch the appropriate form for evaluation that student
	{
		$evaluation_id = $request->get("evaluation_id");

		$dao = $this->getDAO();
		$eval="";
		$eval =$dao->getStudentEvaluation($evaluation_id);
		error_log(json_encode($evaluation_id));
		$evaluationArray = unserialize($eval[3]);
		$template = $eval[5];
		$globalVals = unserialize($template[2]);
		$fields = unserialize($template[3]);

		$data = array($evaluationArray,$globalVals,$fields);
		return json_encode($data);
	}
	
}

?>