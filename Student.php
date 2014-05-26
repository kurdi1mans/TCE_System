<?php 

include_once 'Evaluation.php';
class Student
{
	public $id;
	public $fname;
	public $lname;
	public $training_type;
	public $major;
	public $has_evaluation;
	public $evaluation;


	public function getId(){return $id;}
	public function getLname(){return $lname;}
	public function getFname(){return $fname;}
	public function getTraining(){return $training_type;}
	public function getMajor(){return $major;}


	public function setId($new_val){$this->id = $new_val;}
	public function setLname($new_val){$this->lname= $new_val;}
	public function setFname($new_val){$this->fname= $new_val;}
	public function setTraining($new_val){$this->training_type= $new_val;}
	public function setMajor($new_val){$this->major= $new_val;}
	
	public function setHasEvaluation($new_val)
	{
		$this->has_evaluation= $new_val;
	}
	public function getHasEvaluation(){
		return $this->has_evaluation;
	}
	public function setEvaluation($new_val)
	{
		$this->evaluation= $new_val;
	}
	public function getEvaluation(){
		return $this->evaluation;
	}
	public function getRowView()
	{	
		// will return html representation of the student information in the form of a table row
		$html = "<tr>
					<td class='tg-hgcj'>$this->id</td>
					<td class='tg-9ewa'>$this->lname, $this->fname</td>
					<td class='tg-hgcj'>$this->training_type</td>
					<td class='tg-9ewa'>$this->major</td>
				";
		if($this->has_evaluation == true) // we would like to return a [view] button if the student was evaluated, otherwise we return [evaluate] button.
		{
			$html .="<td class='tg-hgcj'><a href='#' onClick='getStudentEvaluationData(".$this->id.");' >View</a> </td></tr>";
		}
		else 
		{
			$html .="<td class='tg-hgcj'><a href='#' onClick='getStudentEvaluationForm(".$this->id.");'>Evaluate</a></td></tr>";
		}
		return $html;
	}



}

?>