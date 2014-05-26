<?php

	include_once 'DAO.php';
	
	class DataExporter
	{
		public function getStudentDataBySemester($semester,$all,$college,$department,$major,$training_type)
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

			// get instances of the semester
			$instances = $dao->getSemesterInstances($semester);

			// get links for instances
			$links = array();
			foreach ($instances as $instance)
			{
				$links[sizeof($links)] = $this->getStudentDataByInstance($instance[0],$all,$college,$department,$major,$training_type);
			}

			do
			{
				$file = "Exported_Data_File_".rand(1000,10000).".zip";
			}
			while(file_exists($file));

			$zip = new ZipArchive();
			$zip->open("$file", ZipArchive::CREATE);

			foreach ($links as $link)
			{
				$link = $this->getFileName($link);
				$zip->addFile("$link", "$link");
			}
			$zip->close();
			return "<a href=\"$file\" download=\"Exported_Data_File_For_Semester.zip\">Download</a>";

			/*
			$outfile = fopen($file,"w");
			foreach ($links as $link)
			{
				$tmp_file_name = $this->getFileName($link);
				$file_tmp = file_get_contents($tmp_file_name);
				fwrite($outfile, $file_tmp);
				unlink($tmp_file_name);
			}
			fclose($outfile);
			return "<a href=\"$file\" download=\"Exported_Data_File.txt\">Download</a>";
			*/
		}
		private function getFileName($link)
		{
			$filename = substr($link,strpos($link,"href=")+6,strpos($link,"download=")-11);
			return $filename;
		}
		public function getStudentDataByInstance($instance_id,$all,$college,$department,$major,$training_type)
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
			$table = $dao->getStudentDataByInstance($instance_id,$all,$college,$department,$major,$training_type);

			$template = $dao->getTemplateByInstanceID($instance_id);
			// after we get the data ... we get the templates ... then construct a table with the questions weights and score out of total
			$global_values = unserialize($template[2]);
			$fields = unserialize($template[3]);

			$table2 = $this->constructEvaluationArrays($table,$fields,$global_values);
			//error_log(json_encode($table2));
			// then we construct a file
			$link = $this->outputDataFile($table2,$fields);
			return $link;
			// then we return something to the ajax to allow for downloading the file
		}
		private function constructEvaluationArrays($table,$fields,$global_values)
		{
			for ($i=0; $i < sizeof($table); $i++)
			{
				$evaluation = $this->getEvaluationArray($table[$i][23],$fields,$global_values);
				$table[$i][23] = $evaluation;
			}
			return $table;
		}
		private function getEvaluationArray($evaluation_string,$fields,$global_values)
		{
			if($evaluation_string == null)
			{
				return null;
			}
			else
			{
				$evaluation = unserialize($evaluation_string);//unserialize the evaluation string
				$returned = array();
				for ($i=0; $i < sizeof($evaluation); $i++)
				{
					if($fields[$i][1] == "rubric")
					{
						$returned[$i] = $global_values[$evaluation[$i]];
					}
					else
					{
						$returned[$i] = $evaluation[$i];
					}
				}
				return $returned;
			}
		}

		private function outputDataFile($table,$fields)
		{
			do
			{
				$file = "Exported_Data_File_".rand(1000,10000).".txt";
			}
			while(file_exists($file));
			$outfile = fopen($file,"w");
			$this->outputFileTableHeader($outfile,$fields);
			foreach ($table as $student)
			{
				$this->outputStudent($outfile,$student);
			}
			fclose($outfile);
			return "<a href=\"$file\" download=\"Exported_Data_File.txt\">Download</a>";
		}
		private function outputFileTableHeader($outfile,$fields)
		{
			fwrite($outfile,"Student id");
			fwrite($outfile,";");
			fwrite($outfile,"Student Fname");
			fwrite($outfile,";");
			fwrite($outfile,"Student Lname");
			fwrite($outfile,";");
			fwrite($outfile,"Student email");
			fwrite($outfile,";");
			fwrite($outfile,"Supervisor id");
			fwrite($outfile,";");
			fwrite($outfile,"Supervisor name");
			fwrite($outfile,";");
			fwrite($outfile,"Supervisor email");
			fwrite($outfile,";");
			fwrite($outfile,"Company id");
			fwrite($outfile,";");
			fwrite($outfile,"Company name");
			fwrite($outfile,";");
			fwrite($outfile,"Company location");
			fwrite($outfile,";");
			fwrite($outfile,"Semester");
			fwrite($outfile,";");
			fwrite($outfile,"Course id");
			fwrite($outfile,";");
			fwrite($outfile,"Training type");
			fwrite($outfile,";");
			fwrite($outfile,"Student major");
			fwrite($outfile,";");
			fwrite($outfile,"Department");
			fwrite($outfile,";");
			fwrite($outfile,"College");
			fwrite($outfile,";");
			fwrite($outfile,"Evaluation instance id");
			fwrite($outfile,";");
			fwrite($outfile,"Evaluation template id");
			fwrite($outfile,";");
			fwrite($outfile,"Evaluation instance starting date");
			fwrite($outfile,";");
			fwrite($outfile,"Evaluation instance expiration date");
			fwrite($outfile,";");
			fwrite($outfile,"Evaluation id");
			fwrite($outfile,";");
			fwrite($outfile,"Evaluation filling date");
			fwrite($outfile,";");
			fwrite($outfile,"filled by");
			fwrite($outfile,";");
			for ($i=0; $i < sizeof($fields) ; $i++)
			{ 
				fwrite($outfile,$fields[$i][2]);
				fwrite($outfile,";");
			}
			fwrite($outfile,"\n");
		}
		private function outputStudent($outfile,$student)
		{
			//error_log(json_encode($student));
			$this->outputFirstLine($outfile,$student);
			//$this->outputSecondLine($outfile,$student);
		}
		private function outputFirstLine($outfile,$student)
		{
			for($i=0; $i < 23; $i++)
			{
				fwrite($outfile,$student[$i]);
				fwrite($outfile,";");
			}
			for($i=0; $i < sizeof($student[23]); $i++)
			{
				if(is_array($student[23][$i]))
				{
					fwrite($outfile,$student[23][$i][1]);
					fwrite($outfile,";");
				}
				else
				{
					fwrite($outfile,$student[23][$i]);
					fwrite($outfile,";");
				}
			}
			fwrite($outfile,"\n");
		}
		/*private function outputSecondLine($outfile,$student)
		{
			for($i=0; $i < 23; $i++)
			{
				fwrite($outfile,";");
			}
			for($i=0; $i < sizeof($student[23]); $i++)
			{
				if(is_array($student[23][$i]))
				{
					fwrite($outfile,$student[23][$i][1]);
					fwrite($outfile,";");
				}
				else
				{
					fwrite($outfile,";");
				}
			}
			fwrite($outfile,"\n");
		}*/




		public function getCompanyDataBySemester($semester,$training_type)
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
			$table = $dao->getCompanyDataBySemester($semester,$training_type);
			error_log(json_encode($table));
			$table2 = $this->constructComapnyDataTable($table);
			error_log(json_encode($table2));
			return $this->outputCompanyDataFile($table2);
		}

		private function outputCompanyDataFile($table)
		{
			do
			{
				$file = "Exported_Company_Data_File_".rand(1000,10000).".txt";
			}
			while(file_exists($file));
			$outfile = fopen($file,"w");
			foreach ($table as $row)
			{
				foreach ($row as $cell)
				{
					fwrite($outfile,$cell);
					fwrite($outfile,";");
				}
				fwrite($outfile,"\n");
			}
			fclose($outfile);
			return "<a href=\"$file\" download=\"Exported_Company_Data_File.txt\">Download</a>";
		}

		private function constructComapnyDataTable($table)
		{
			$table2 = array();
			$table2[0][0] = "Company id";
			$table2[0][1] = "Company name";
			$table2[0][2] = "Company location";
			$currentCompany = null;
			foreach ($table as $row)
			{
				error_log("given row ".json_encode($row));
				if($row[0] == $currentCompany)
				{
					$i = sizeof($table2)-1;
				}
				else
				{
					$i = sizeof($table2);
					$currentCompany = $row[0];
					$table2[$i][0] = $row[0];
					$table2[$i][1] = $row[1];
					$table2[$i][2] = $row[2];
					for ($k=3; $k < sizeof($table2[0]); $k++)
					{ 
						$table2[$i][$k] = 0;
					}
				}				
				
				if(array_search($row[3],$table2[0])==false)
				{
					$j = sizeof($table2[0]);
					$table2[0][$j] = $row[3];
					
					for ($k=1; $k < sizeof($table2); $k++)
					{ 
						$table2[$k][$j] = '0';
					}
				}

				$table2[$i][array_search($row[3],$table2[0])] = $row[4];
				error_log("created row ".json_encode($table2[$i]));
			}
			return $table2;
		}
	}
?>