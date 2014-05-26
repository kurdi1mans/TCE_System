<?php

	class DAO
	{
		//preConditions: 	the Authorizer needs the info of a user how is trying to login
		//postConditions:	the hashed password along with the user_type are returned
		public function getUserInfo($username)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM user WHERE username = '$username'");
			$user = $result->fetch_row();
			return $user;
		}


		//preConditions:	the supervisor instance was just instantiated and for it to retrieve the student list it needs the supervisor id
		//postConditions:	the supervisor_id is returned as required
		public function getSupervisorID($username)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT supervisor_id FROM supervisor WHERE email = '$username'");
			$id = $result->fetch_row();
			return $id;
		}

		//preConditions: 	the supervisor object needs the list of the evalauated and non-evaluated student to construct its view
		//postConditions:	the list of evaluate and non-evaluated student who belong to an open evaluation instance of this supervisor is returned .. the attributes are(Student_ID,Fname,Lname,Training_Type,Major_Code,Instance_ID, Template_ID, Starting_Date, Expiration_Date, Evaluation_ID, Filling_date)
		public function getSupervisorStudentList($supervisor_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT student.Student_ID,Fname,Lname,course.Training_Type,course.Major_Code, evaluation_instance.Instance_ID, Template_ID, Starting_Date, Expiration_Date, Evaluation_ID, Filling_date from student join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester left join evaluation on evaluation.instance_id = evaluation_instance.instance_id and student.student_id = evaluation.student_id where supervisor_id='$supervisor_id' and ((CURDATE() between starting_date and expiration_date) or (CURDATE()>starting_date and evaluation.filled_by = '$supervisor_id'))");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function getSupervisorStudentListByinstance($supervisor_id,$instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT student.Student_ID,Fname,Lname,student.email,course.Training_Type,course.Major_Code, evaluation_instance.Instance_ID, Template_ID, Starting_Date, Expiration_Date from student join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester where supervisor_id='$supervisor_id' and evaluation_instance.instance_id='$instance_id' and (CURDATE() between starting_date and expiration_date)");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	a view needs the evaluation template to view existing evalaution
		//postConditions:	the evaluation template is returned
		public function getTemplateByID($Template_ID)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * from template where Template_ID = '$Template_ID'");
			$template = $result->fetch_row();
			return $template;
		}

		//preConditions: 	a view needs the evaluation template to display the evaluation form for evaluation
		//postConditions:	the evaluation template is returned
		public function getTemplateByInstanceID($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT template.Template_ID, template.Template_name, Global_Values, Evaluation_fields from template join evaluation_instance on template.template_id = evaluation_instance.template_id where evaluation_instance.instance_id = '$instance_id'");
			$template = $result->fetch_row();
			return $template;
		}

		//preConditions: 	a view needs the evalaution of defined by its id
		//postConditions:	the required unique is returned with its info
		public function getStudentEvaluation($Evaluation_ID)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * from evaluation where Evaluation_ID='$Evaluation_ID'");
			$returned = $result->fetch_row();
			$returned[5] = $this->getTemplateByInstanceID($returned[2]);
			return $returned;
		}

		//preConditions: 	an evaluation is taken from the supervisor according to a template and it is submitted to be saved
		//postConditions:	the evaluation is saved in the database and given an id
		public function submitStudentEvaluation($stuId,$instId,$serial,$supervisor_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT 1 from evaluation_instance where instance_id='$instId' and CURDATE() between starting_date and expiration_date");
			$legal = $result->fetch_row();
			$legal = $legal!=null;
			//error_log(json_encode($legal));
			if($legal)
			{
				$result = $con->query("INSERT INTO evaluation (Student_ID,Instance_ID,Evaluation_string,Filling_date,filled_by) VALUES ('$stuId','$instId','$serial',CURDATE(),'$supervisor_id')");
			}
			else return false;
			return $result;
		}


		//preConditions:  an Evaluation needs to be deleted manually since it did not satisfy some criteria
		//postConditions:	the evaluation is deleted using its id
		public function deleteEvaluation($evaluation_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM evaluation WHERE Evaluation_ID = $evaluation_id");
			return $result;
		}

		//preConditions: 	the user is requesting a password change
		//postConditions:	the password is set after it is hashed
		public function updateUserPassword($username,$hashed_password)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE user SET hashed_password='$hashed_password' WHERE username='$username'");
			return $result;
		}

		//preConditions:  a student needs to be deleted from teh database since he has dropped the course or not needed in the system for any other reason
		//postConditions:	the student is deleted using his id
		public function addStudent($student)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO student (Student_ID, Fname, Lname, Email, Supervisor_ID) VALUES ('$student[0]','$student[1]','$student[2]','$student[3]','$student[4]')");
			return $result;
		}

		//preConditions:  a student needs to be deleted from teh database since he has dropped the course or not needed in the system for any other reason
		//postConditions:	the student is deleted using his id
		public function deleteStudent($student_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM student WHERE Student_ID = '$student_id'");
			return $result;
		}

		//preConditions:  Student info needs to be updated due to some reasons including a required change of supervisor
		//postConditions: the student with the given student_id is updated with the rest of the parameters
		public function updateStudent($old_id,$student)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE student SET Student_ID= '$student[0]' , Fname='$student[1]', Lname='$student[2]', Email='$student[3]', Supervisor_ID='$student[4]' WHERE Student_ID = '$old_id'");
			return $result;
		}



		//preConditions: 	The data of students and their courses along with their supervisor and company info needs to be added to the system from a file
		//postConditions:	A transaction is opened such that it will not commit unless all students in teh file are inserted properly
		public function startDataImportingTransaction()
		{
			$this->importTrans = $this->getSpecialDBConnection();
			$this->importTrans->autocommit(false);
			$this->importTrans->begin_transaction();
		}


		//preConditions: 	A transaction to insert students to the system is opened through startDataImportingTransaction() ... now, a row for a student needs to be inserted
		//postConditions:	The row is inserted taking in account that some of teh data might previously exist .. if successful, it returns true .. also transaction will rollback under any failure and it returns false
		public function insertDataImportingRow($Student_ID,$Fname,$Lname,$Email,$Course_ID,$Semester,$Supervisor_name,$Supervisor_email,$Company_name,$Company_location)
		{
			if(!isset($this->importTrans))
			{
				error_log("\"Importing Data Transaction\" was not started or was rolled back");
				return false;
			}

			$company_id = $this->insertCompanyInfo($Company_name,$Company_location);
			if($company_id == false) return false;

			$supervisor_id = $this->insertSupervisorInfo($Supervisor_name,$Supervisor_email,$company_id);
			if($supervisor_id == false) return false;

			$result_addStudent = $this->insertStudentInfo($Student_ID,$Fname,$Lname,$Email,$supervisor_id);
			if($result_addStudent == false) return false;

			$result_addEnrollment = $this->insertCourseEnrollmentInfo($Student_ID,$Course_ID,$Semester);
			if($result_addEnrollment == false) return false;

			$result = $this->importTrans->query("SELECT distinct evaluation_instance.instance_id FROM student join course_enrollment on student.student_id = course_enrollment.student_id join course on course.course_id = course_enrollment.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id=domain.instance_id and evaluation_instance.semester = course_enrollment.semester WHERE student.student_id = '$Student_ID'");
        	while ($row = $result->fetch_row()) 
        	{
				$update_result = $this->importTrans->query("UPDATE `evaluation_instance` SET `fullyAnnounced`=0 WHERE `instance_id`='$row[0]'");
				if(!$this->transCheck($update_result != false , "evaluation_instance fullyAnnounced flag could not be updated in db ... transaction will rollback")) return false;
        	}

			return true;
		}


		//preConditions: 	the info of a company needs to be inserted such that no duplicate exist
		//postConditions:	the info is inserted and the created company_id is returned .. if it fails, the transaction will be rolled back and it will return false
		private function insertCompanyInfo($Company_name,$Company_location)
		{
			$result = $this->importTrans->query("SELECT company_ID from company where Company_name='$Company_name' and Company_location='$Company_location'");
			//error_log("1: ".json_encode($result)." -- ".$this->importTrans->error." -- ".$this->importTrans->errno);
			$company_id = $result->fetch_row();
			//error_log("2: ".json_encode($company_id)." -- ".$this->importTrans->error." -- ".$this->importTrans->errno);
			$Company_found =  $company_id != null;
			//error_log("3: ".json_encode($Company_found)." -- ".$this->importTrans->error." -- ".$this->importTrans->errno);
			if(!$Company_found)
			{
				$insert_result = $this->importTrans->query("INSERT into company VALUES(DEFAULT,'$Company_name','$Company_location')");
				//error_log("4: ".json_encode($insert_result)." -- ".$this->importTrans->error." -- ".$this->importTrans->errno);
				if(!$this->transCheck($insert_result != false , "Company info could not be inserted in db ... transaction will rollback")) return false;
				$result = $this->importTrans->query("SELECT company_ID from company where Company_name='$Company_name' and Company_location='$Company_location'");
				//error_log("5: ".json_encode($result)." -- ".$this->importTrans->error." -- ".$this->importTrans->errno);
				$company_id = $result->fetch_row();
				//error_log("6: ".json_encode($result)." -- ".$this->importTrans->error." -- ".$this->importTrans->errno);
			}
			return $company_id[0];
		}


		//preConditions: 	the info of a Supervisor needs to be inserted such that no duplicate exist
		//postConditions:	the info is inserted and the created supervisor_id is returned .. if it fails, the transaction will be rolled back and it will return false
		private function insertSupervisorInfo($Supervisor_name,$Supervisor_email,$company_id)
		{
			$result = $this->importTrans->query("SELECT supervisor_ID from supervisor where email='$Supervisor_email'");
			$supervisor_ID = $result->fetch_row();
			$supervisor_found =  $supervisor_ID != null;
			if(!$supervisor_found)
			{
				$insert_result = $this->importTrans->query("INSERT into supervisor VALUES(DEFAULT,'$Supervisor_name','$Supervisor_email','$company_id')");
				if(!$this->transCheck($insert_result != false , "Supervisor info could not be inserted in db ... transaction will rollback")) return false;
				$result = $this->importTrans->query("SELECT supervisor_ID from supervisor where email='$Supervisor_email'");
				$supervisor_ID = $result->fetch_row();
			}
			return $supervisor_ID[0];
		}


		//preConditions: 	the info of a student needs to be inserted such that no duplicate exist
		//postConditions:	the info is inserted and true is returned .. if it fails, the transaction will be rolled back and it will return false
		private function insertStudentInfo($Student_ID,$Fname,$Lname,$Email,$supervisor_id)
		{
			$result = $this->importTrans->query("SELECT student_id from student where student_id='$Student_ID'");
			$student_id = $result->fetch_row();
			$student_found =  $student_id != null;
			if(!$student_found)
			{
				$insert_result = $this->importTrans->query("INSERT into student VALUES('$Student_ID','$Fname','$Lname','$Email','$supervisor_id')");
				if(!$this->transCheck($insert_result==true , "Student info could not be inserted in db ... transaction will rollback")) return false;
				return true;
			}
			else
			{
				$update_result = $this->importTrans->query("UPDATE student set fname='$Fname', lname='$Lname', email='$Email',supervisor_id='$supervisor_id' where student_id='$Student_ID'");
				if(!$this->transCheck($update_result==true , "Student info could not be updated in db ... transaction will rollback")) return false;
				return true;
			}
		}


		//preConditions: 	the info of a course_enrollment of a student needs to be inserted such that no duplicate exist
		//postConditions:	the info is inserted and true is returned .. if it fails, the transaction will be rolled back and it will return false
		private function insertCourseEnrollmentInfo($Student_ID,$Course_ID,$Semester)
		{
			$result = $this->importTrans->query("SELECT student_id from course_enrollment where student_id='$Student_ID'");
			$student_id = $result->fetch_row();
			$enrollment_found =  $student_id != null;
			if(!$enrollment_found)
			{
				$insert_result = $this->importTrans->query("INSERT into course_enrollment VALUES('$Student_ID','$Course_ID','$Semester')");
				if(!$this->transCheck($insert_result==true , "Course Enrollment info could not be inserted in db ... transaction will rollback")) return false;
				return true;
			}
			else
			{
				$update_result = $this->importTrans->query("UPDATE course_enrollment set semester='$Semester', course_id='$Course_ID' where student_id='$Student_ID'");
				if(!$this->transCheck($update_result==true , "Course Enrollment info could not be updated in db ... transaction will rollback")) return false;
				return true;
			}
		}


		//preConditions: 	after all rows of the input file are inserted using insertDataImportingRow($,$,$,$,$,$,$,$,$,$), transaction has to be committed to the database
		//postConditions:	transaction is committed to database
		public function commitDataImportingTransaction()
		{
			error_log("we are commiting");
			$this->importTrans->commit();
			$this->importTrans = null;
			error_log("Commiting DONE");
		}


		//preConditions: 	a test has to be conducted somewhere in the processing of the transaction such that if the test fails, the transaction is rolled back and message is sent to error_log
		//postConditions:	if test fails, transaction is rolled back and the function returns false after sending the message to the log
		private function transCheck($test , $message)
		{
			if(!$test)
			{
				error_log($message);
				$this->importTrans->rollback();
				$this->importTrans = null;
				return false;
			}
			return true;
		}



		//preConditions: 	The data of students and their courses along with their supervisor and company info needs to be added to the system from a file
		//postConditions:	A transaction is opened such that it will not commit unless all students in teh file are inserted properly
		public function EditStudent($old_id,$Student_ID,$Fname,$Lname,$Email,$Course_ID,$Semester,$Supervisor_name,$Supervisor_email,$Company_name,$Company_location)
		{
			$editTrans = $this->getSpecialDBConnection();
			$editTrans->autocommit(false);
			$editTrans->begin_transaction();

			//-------------------- company insertion if does not exist ---------------------------
			$result = $editTrans->query("SELECT company_ID from company where Company_name='$Company_name' and Company_location='$Company_location'");
			$company_id = $result->fetch_row();
			$Company_found =  $company_id != null;
			if(!$Company_found)
			{
				$insert_result = $editTrans->query("INSERT into company VALUES(DEFAULT,'$Company_name','$Company_location')");
				if(!$this->editCheck($insert_result != false , "Company info could not be inserted in db ... transaction will rollback",$editTrans)) return false;
				$result = $editTrans->query("SELECT company_ID from company where Company_name='$Company_name' and Company_location='$Company_location'");
				$company_id = $result->fetch_row();
			}
			else
			{
				$update_result = $editTrans->query("UPDATE company SET company_name='$Company_name', company_location='$Company_location' where company_id='$company_id[0]'");
				if(!$this->editCheck($update_result != false , "Company info could not be updated in db ... transaction will rollback",$editTrans)) return false;
			}
			//--------------------- company inserted ---------------------------


			//------------------- supervisor insertion if hes does not exit ..... update his company if he exists --------
			//use this to debug: error_log("8".json_encode($result)."--".json_encode($result)."--".json_encode($editTrans->error)."--".json_encode($editTrans->errno));
			$result = $editTrans->query("SELECT supervisor_ID from supervisor where email='$Supervisor_email'");
			$supervisor_ID = $result->fetch_row();
			$supervisor_found =  $supervisor_ID != null;
			if(!$supervisor_found)
			{
				$insert_result = $editTrans->query("INSERT into supervisor VALUES(DEFAULT,'$Supervisor_name','$Supervisor_email','$company_id[0]')");
				if(!$this->editCheck($insert_result != false , "Supervisor info could not be inserted in db ... transaction will rollback",$editTrans)) return false;
				$result = $editTrans->query("SELECT supervisor_ID from supervisor where email='$Supervisor_email'");
				$supervisor_ID = $result->fetch_row();
			}
			else
			{
				$update_result = $editTrans->query("UPDATE supervisor SET name='$Supervisor_name', company_id='$company_id[0]' where supervisor_id='$supervisor_ID[0]'");
				if(!$this->editCheck($update_result != false , "Supervisor info could not be inserted in db ... transaction will rollback",$editTrans)) return false;
			}
			
			$update_result = $editTrans->query("UPDATE course_enrollment SET course_id='$Course_ID', semester='$Semester' WHERE Student_ID = '$old_id'");
			if(!$this->editCheck($update_result==true, "Course Enrollment info could not be updated in db ... transaction will rollback",$editTrans)) return false;

			$update_result = $editTrans->query("UPDATE student SET Student_ID= '$Student_ID' , Fname='$Fname', Lname='$Lname', Email='$Email', Supervisor_ID='$supervisor_ID[0]' WHERE Student_ID = '$old_id'");
			
			if(!$this->editCheck($update_result==true, "student info could not be updated in db ... transaction will rollback",$editTrans)) return false;

			$result = $editTrans->query("SELECT distinct evaluation_instance.instance_id FROM student join course_enrollment on student.student_id = course_enrollment.student_id join course on course.course_id = course_enrollment.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id=domain.instance_id and evaluation_instance.semester = course_enrollment.semester WHERE student.student_id = '$Student_ID'");
        	while ($row = $result->fetch_row()) 
        	{
				$update_result = $editTrans->query("UPDATE `evaluation_instance` SET `fullyAnnounced`=0 WHERE `instance_id`='$row[0]'");
				if(!$this->editCheck($update_result==true, "evaluation_instance fullyAnnounced flag could not be updated in db ... transaction will rollback",$editTrans)) return false;
        	}

			error_log("we are committing the editing transaction");
			$editTrans->commit();
			error_log("editing transaction Committing DONE");
			return true;
		}

		private function editCheck($test, $message,$trans)
		{
			if(!$test)
			{
				error_log($message);
				$trans->rollback();
				$trans = null;
				return false;
			}
			return true;
		}


//--------------------------------------------------------------------

		//preConditions: 	
		//postConditions:	
		public function getSupervisors()
		{	
			$con = $this->getDBConnection();
			$result = $con->query("SELECT `Supervisor_ID`, `Name` FROM `supervisor`");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:	
		public function getAllStudents()
		{	
			$con = $this->getDBConnection();
			$result = $con->query("SELECT student.Student_ID, Fname, Lname, student.Email from student");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:	
		public function getInstances()
		{	
			$con = $this->getDBConnection();
			$result = $con->query("SELECT  evaluation_instance.instance_id,template_id,semester,starting_date,expiration_date,count(evaluation_id),fullyAnnounced from evaluation_instance left join evaluation on evaluation.instance_id = evaluation_instance.instance_id group by evaluation_instance.instance_id");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		public function getNonAnnouncedStartedInstances()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT  evaluation_instance.instance_id from evaluation_instance where fullyAnnounced = 0 and CURDATE() between starting_date and expiration_date");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:	
		public function deleteInstance($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM evaluation_instance WHERE instance_id = '$instance_id'");
			return $result;
		}



		//preConditions: 	
		//postConditions:	
		public function addInstance($template_id,$semester,$starting_date,$expiration_date)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO evaluation_instance VALUES (DEFAULT,'$template_id','$semester','$starting_date','$expiration_date',DEFAULT)");
			return $result;
		}


		//preConditions: 	
		//postConditions:	
		public function modifyInstance($instance_id,$template_id,$semester,$starting_date,$expiration_date)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct evaluation_instance.instance_id FROM `evaluation_instance` right join evaluation on evaluation_instance.instance_id = evaluation.instance_id where evaluation_instance.instance_id = '$instance_id'");
			$row = $result->fetch_row();
			//error_log("---".json_encode($row)."---");
			if($row != "")
			{
				error_log("instance already have evaluation ... cannot be modified ... you can only delete");
				return false;
			}
			$result = $con->query("update evaluation_instance set  template_id='$template_id', semester='$semester', starting_date='$starting_date',expiration_date='$expiration_date' where instance_id='$instance_id'");
			return $result;
		}


		//preConditions: 	
		//postConditions:	
		public function addDomain($instance_id,$training_type,$major_code,$department_code,$college_code,$all)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct evaluation_instance.instance_id FROM `evaluation_instance` right join evaluation on evaluation_instance.instance_id = evaluation.instance_id where evaluation_instance.instance_id = '$instance_id'");
			$row = $result->fetch_row();
			//error_log("---".json_encode($row)."---");
			if($row != "")
			{
				error_log("instance already have evaluation ... domains are locked");
				return false;
			}
			$result = $con->query("INSERT INTO `domain` VALUES (DEFAULT,'$instance_id','$training_type','$major_code','$department_code','$college_code','$all')");
			return $result;
		}


		//preConditions: 	
		//postConditions:	
		public function deleteDomain($domain_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("Select distinct domain_id from evaluation_instance join evaluation on evaluation_instance.instance_id = evaluation.instance_id join domain on evaluation_instance.instance_id=domain.instance_id where domain_id = '$domain_id'");
			$row = $result->fetch_row();
			error_log("---".json_encode($row)."---");
			if($row != "")
			{
				error_log("instance already have evaluations ... domains are locked");
				return false;
			}

			$result = $con->query("DELETE FROM domain WHERE domain_id = '$domain_id'");
			return $result;
		}


		//preConditions: 	
		//postConditions:	
		public function modifyDomain($domain_id,$instance_id,$training_type,$major_code,$department_code,$college_code,$all)
		{
			$con = $this->getDBConnection();
			$result = $con->query("Select distinct domain_id from evaluation_instance join evaluation on evaluation_instance.instance_id = evaluation.instance_id join domain on evaluation_instance.instance_id=domain.instance_id where domain_id = '$domain_id'");
			$row = $result->fetch_row();
			//error_log("---".json_encode($row)."---");
			if($row != "")
			{
				//error_log("instance already have evaluations ... its domains are locked");
				return false;
			}

			$result = $con->query("SELECT distinct evaluation_instance.instance_id FROM `evaluation_instance` right join evaluation on evaluation_instance.instance_id = evaluation.instance_id where evaluation_instance.instance_id = '$instance_id'");
			$row = $result->fetch_row();
			//error_log("---".json_encode($row)."---");
			if($row != "")
			{
				//error_log("instance already have evaluation ... cannot be modified ... you can only delete");
				return false;
			}

			$result = $con->query("UPDATE domain set instance_id='$instance_id', training_type='$training_type', major_code='$major_code', department_code='$department_code', college_code='$college_code', domain.all='$all' where domain_id='$domain_id'");
			//error_log(json_encode($con->error));
			return $result;
		}


		//preConditions: 	
		//postConditions:	
		public function getDomainsByInstanceID($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM `domain` where instance_id='$instance_id'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:	
		public function getInstanceStudentList($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT  student.Student_ID, Fname, Lname, student.Email, supervisor.supervisor_ID, supervisor.name, supervisor.email, company.company_id,company.company_name, company.company_location, course_enrollment.Course_ID, course_enrollment.Semester, course.Training_Type, course.Major_Code, course.Department_Code, course.College_Code, evaluation_instance.Instance_ID, Starting_Date, Expiration_Date, Evaluation_ID, Filling_date, filled_by  from student join supervisor on student.supervisor_ID = supervisor.supervisor_ID join company on supervisor.company_id = company.company_ID join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester left join evaluation on evaluation.instance_id = evaluation_instance.instance_id and student.student_id = evaluation.student_id where evaluation_instance.instance_id='$instance_id'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:	
		public function getCourses()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM `course`");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:	
		public function addCompany($Company_name,$Company_location)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO `company` VALUES (DEFAULT,'$Company_name','$Company_location')");
			return $result;
		}



		//preConditions: 	
		//postConditions:	
		public function addSupervisor($name,$email,$company_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO `supervisor` VALUES (DEFAULT,'$name','$email','$company_id')");
			return $result;
		}


		//preConditions: 	
		//postConditions:
		public function addUser($username,$hashed_password,$user_group)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO user VALUES ('$username','$hashed_password','$user_group')");
			return $result;
		}


		//preConditions: 	
		//postConditions:	
		public function getTemplates()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM `template`");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}


		//preConditions: 	
		//postConditions:
		public function addTemplate($template_name,$global_values,$evaluation_fields)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO template VALUES (DEFAULT,'$template_name','$global_values','$evaluation_fields')");
			return $result;
		}


		//preConditions: 	
		//postConditions:
		public function modifyTemplate($template_id,$template_name,$global_values,$evaluation_fields)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct template.template_id FROM `template` right join evaluation_instance on evaluation_instance.template_id = template.template_id where template.template_id = '$template_id'");
			$row = $result->fetch_row();
			//error_log("---".$row."---");
			if($row != "")
			{
				//error_log("template is used by an instance ... cannot be modified or deleted ... you can only copy");
				return false;
			}
			$result = $con->query("UPDATE `template` SET `template_name`='$template_name' ,`global_values`='$global_values' ,`evaluation_fields`='$evaluation_fields' WHERE `Template_ID`='$template_id'");
			//error_log(json_encode($con->error));
			return $result;
		}


		//preConditions:
		//postConditions:
		public function correctTemplate($template_id,$template_name,$global_values,$evaluation_fields)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `template` SET `template_name`='$template_name' ,`global_values`='$global_values' ,`evaluation_fields`='$evaluation_fields' WHERE `Template_ID`='$template_id'");
			return $result;
		}


		//preConditions: 	
		//postConditions:
		public function deleteTemplate($template_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM template WHERE template_id = '$template_id'");
			return $result;
		}





		//preConditions: 	
		//postConditions:
		public function getStudentInfo($student_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM student WHERE student_id = '$student_id'");
			$returned = $result->fetch_row();
			return $returned;
		}

		//preConditions: 	
		//postConditions:
		public function getStudentEvaluations($student_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM evaluation WHERE student_id = '$student_id'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$row[5] = $this->getTemplateByInstanceID($row[2]);
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function getSupervisorInfo($supervisor_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM supervisor WHERE supervisor_id = '$supervisor_id'");
			$returned = $result->fetch_row();
			return $returned;
		}

		//preConditions: 	
		//postConditions:
		public function getTrainingTypes()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM training_type");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function addTrainingType($training_type)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO training_type VALUES ('$training_type')");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function deleteTrainingType($training_type)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM training_type WHERE training_type = '$training_type'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function modifyTrainingType($training_type_old,$training_type_new)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `training_type` SET `training_type`='$training_type_new' WHERE `training_type`='$training_type_old'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function getCoursesByMajor($major_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM course where major_code='$major_code'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function addCourse($course_id,$training_type,$major_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct major.department_code,college_code from major join department on major.department_code = department.department_code where major_code = '$major_code'");
			$row = $result->fetch_row();
			//error_log(json_encode($row));
			if($row == null) return false;
			//error_log(json_encode($row));
			$result = $con->query("INSERT INTO course VALUES ('$course_id','$training_type','$major_code','$row[0]','$row[1]')");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function deleteCourse($course_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM course WHERE course_id = '$course_id'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function modifyCourse($course_id_old,$course_id,$training_type,$major_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct major.department_code,college_code from major join department on major.department_code = department.department_code where major_code = '$major_code'");
			$row = $result->fetch_row();
			if($row == null) return false;
			$result = $con->query("UPDATE `course` SET `course_id`='$course_id',`training_type`='$training_type',`major_code`='$major_code',`department_code`='$row[0]',`college_code`='$row[1]' WHERE `course_id`='$course_id_old'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function getMajors()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM major");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function getMajorsByDepartment($department_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM major where department_code='$department_code'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row()) 
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function addMajor($major_code,$department_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO major VALUES ('$major_code','$department_code')");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function deleteMajor($major_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM major WHERE major_code = '$major_code'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function modifyMajor($major_code_old,$major_code,$department_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `major` SET `major_code`='$major_code',`department_code`='$department_code' WHERE `major_code`='$major_code_old'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function getDepartments()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM department");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function getDepartmentsByCollege($college_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM department where college_code='$college_code'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function addDepartment($department_code,$college_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO department VALUES ('$department_code','$college_code')");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function deleteDepartment($department_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM department WHERE department_code = '$department_code'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function modifyDepartment($department_code_old,$department_code,$college_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `department` SET `department_code`='$department_code',`college_code`='$college_code' WHERE `department_code`='$department_code_old'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function getColleges()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM college");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		//preConditions: 	
		//postConditions:
		public function addCollege($college_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT INTO college VALUES ('$college_code')");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function deleteCollege($college_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("DELETE FROM college WHERE college_code = '$college_code'");
			return $result;
		}

		//preConditions: 	
		//postConditions:
		public function modifyCollege($college_code_old,$college_code)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `college` SET `college_code`='$college_code' WHERE `college_code`='$college_code_old'");
			return $result;
		}

		public function getStudentProfile($student_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct `student`.`Student_ID`,`student`.`Fname`,`student`.`Lname`,`student`.`Email`,`supervisor`.`Name`,`supervisor`.`Email`,`company`.`Company_name`,`company`.`Company_location` FROM student LEFT JOIN `tcedb`.`supervisor` ON `student`.`Supervisor_ID` = `supervisor`.`Supervisor_ID` LEFT JOIN `tcedb`.`company` ON `supervisor`.`Company_ID` = `company`.`Company_ID` where `student`.`Student_ID` = '$student_id'");
        	$student_data = $result->fetch_row();
        	$student_evaluations = $this->getStudentEvaluations($student_id);
        	$profile = array();
        	$profile[0] = $student_data;
        	$profile[1] = $student_evaluations;

        	return $profile;
		}

		public function getStudentDataBySemester($semester,$all,$college,$department,$major,$training_type)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct student.Student_ID, student.Fname, student.Lname, student.Email, supervisor.Supervisor_ID, supervisor.Name, supervisor.Email, company.Company_ID, company.Company_name, company.Company_location, course_enrollment.Semester, course.Course_ID, course.Training_Type, course.Major_Code, course.Department_Code, course.College_Code, evaluation_instance.Instance_ID, evaluation_instance.Template_ID, evaluation_instance.Starting_Date, evaluation_instance.Expiration_Date, evaluation.Evaluation_ID, evaluation.Filling_date, evaluation.filled_by, evaluation.Evaluation_string from student join supervisor on student.supervisor_id = supervisor.supervisor_id join company on supervisor.company_id=company.company_id join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id left join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) left join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester left join evaluation on evaluation.instance_id = evaluation_instance.instance_id and student.student_id = evaluation.student_id where course_enrollment.semester = '$semester' and (course.major_code = '$major' or course.department_code = '$department' or course.college_code = '$college' or 1='$all') and (course.training_type='$training_type' or 'all'='$training_type') ORDER BY evaluation_instance.Template_ID,evaluation_instance.instance_id,student.student_id");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function getStudentDataByInstance($instance_id,$all,$college,$department,$major,$training_type)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT distinct student.Student_ID, student.Fname, student.Lname, student.Email, supervisor.Supervisor_ID, supervisor.Name, supervisor.Email, company.Company_ID, company.Company_name, company.Company_location, course_enrollment.Semester, course.Course_ID, course.Training_Type, course.Major_Code, course.Department_Code, course.College_Code, evaluation_instance.Instance_ID, evaluation_instance.Template_ID, evaluation_instance.Starting_Date, evaluation_instance.Expiration_Date, evaluation.Evaluation_ID, evaluation.Filling_date, evaluation.filled_by, evaluation.Evaluation_string from student join supervisor on student.supervisor_id = supervisor.supervisor_id join company on supervisor.company_id=company.company_id join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id left join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) left join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester left join evaluation on evaluation.instance_id = evaluation_instance.instance_id and student.student_id = evaluation.student_id where evaluation_instance.instance_id = '$instance_id' and (course.major_code = '$major' or course.department_code = '$department' or course.college_code = '$college' or 1='$all') and (course.training_type='$training_type' or 'all'='$training_type') ORDER BY course.course_id,student.student_id");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function getSemesterInstances($semester)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM `evaluation_instance` WHERE semester = '$semester'");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function getSemesters()
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT DISTINCT semester FROM evaluation_instance order by semester");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function getCompanyDataBySemester($semester,$training_type)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT company.company_id,company.company_name,company.company_location,course.major_code, count(1) from company join supervisor on company.company_id=supervisor.company_id join student on supervisor.supervisor_id=student.supervisor_id join course_enrollment on student.student_id=course_enrollment.student_id join course on course_enrollment.course_id = course.course_id where semester = '$semester' and training_type='$training_type' group by company.company_id,course.major_code order by company.company_id,course.major_code");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function getInstanceSupervisors($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT DISTINCT supervisor.Supervisor_ID, supervisor.Name, supervisor.Email, supervisor.Company_ID, evaluation_instance.Starting_Date, evaluation_instance.Expiration_Date from supervisor join student on supervisor.supervisor_id=student.supervisor_id join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester where evaluation_instance.instance_id = '$instance_id' order by supervisor.supervisor_id");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function setInstanceFullyAnnounced($instance_id,$fullyAnnounced)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `evaluation_instance` SET `fullyAnnounced`='$fullyAnnounced' WHERE `instance_id`='$instance_id'");
			return $result;
		}

		public function transferAnnouncementListEntries($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT IGNORE INTO announcement_list SELECT DISTINCT evaluation_instance.instance_id,supervisor.Supervisor_ID,'DEFAULT' from supervisor join student on supervisor.supervisor_id=student.supervisor_id join course_enrollment on student.student_id = course_enrollment.student_id join course on course_enrollment.course_id = course.course_id join domain on domain.training_type = course.training_type and (domain.Major_code = course.Major_code or domain.College_code = course.College_code or domain.Department_code = course.Department_code or domain.All = 1) join evaluation_instance on evaluation_instance.instance_id = domain.instance_id and evaluation_instance.semester = course_enrollment.semester where evaluation_instance.instance_id = '$instance_id' order by supervisor.supervisor_id");
        	return $result;
		}

		public function getNonProcessedInAnnouncementList($instance_id)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM `announcement_list` WHERE instance_id='$instance_id' and processed=0");
			$lst = array();
			$i = 0;
        	while ($row = $result->fetch_row())
        	{
        		$lst[$i] = array();
            	$lst[$i] = $row;
            	$i++;
        	}
        	return $lst;
		}

		public function setProcessedInAnnouncementList($instance_id,$supervisor_id,$processed)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `announcement_list` SET `processed`='$processed' WHERE `instance_id`='$instance_id' and `supervisor_id`='$supervisor_id'");
			return $result;
		}

		public function getItemFromAccountCreationList($email)
		{
			$con = $this->getDBConnection();
			$result = $con->query("SELECT * FROM `account_creation_list` WHERE email='$email'");
        	$returned = $result->fetch_row();
        	return $returned;
		}
		public function addItemToAccountCreationList($email)
		{
			$con = $this->getDBConnection();
			$result = $con->query("INSERT IGNORE INTO `account_creation_list` VALUES ('$email',0)");
        	return $result;
		}

		public function setProcessedInAccountCreationList($email,$processed)
		{
			$con = $this->getDBConnection();
			$result = $con->query("UPDATE `account_creation_list` SET `processed`='$processed' WHERE `email`='$email'");
			return $result;
		}

		public function getStudent($studentId)
		{
			error_log($studentId);
			$con = $this->getDBConnection();

			$result = $con->query("SELECT `student`.`Student_ID`,`student`.`Fname`,`student`.`Lname`,`student`.`Email`,`course_enrollment`.`Course_ID`,`course_enrollment`.`Semester`,`supervisor`.`Name`,`supervisor`.`Email`,`company`.`Company_name`,`company`.`Company_location` FROM student 
								LEFT JOIN `tcedb`.`supervisor` ON `student`.`Supervisor_ID` = `supervisor`.`Supervisor_ID` 
								LEFT JOIN `tcedb`.`course_enrollment` ON `student`.`Student_ID` = `course_enrollment`.`Student_ID` 
								LEFT JOIN `tcedb`.`company` ON `supervisor`.`Company_ID` = `company`.`Company_ID` WHERE `student`.`Student_ID` = '$studentId' ");
			error_log(json_encode($result));
			$returned = $result->fetch_row();
			return $returned;
		}

//---------------------------------------------------------------------------------------------------------------

		private function getDBConnection()
		{
			if (!isset($_mysqli))
			{
				$_mysqli = new mysqli("localhost", "root", "", "tcedb");
				if ($_mysqli->errno)
				{
					printf("Unable to connect: %s", $_mysqli->error);
					exit();
				}
			}
			return $_mysqli;
		}

		private function getSpecialDBConnection()
		{
			$specialConnection = new mysqli("localhost", "root", "", "tcedb");
			if ($specialConnection->errno)
			{
				printf("Unable to connect: %s", $specialConnection->error);
				exit();
			}
			
			return $specialConnection;
		}
	}

?>