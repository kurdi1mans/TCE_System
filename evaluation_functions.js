

function getStudentEvaluationData(studentId,previousViewInfo) // View a specific evaluation of the student.
{
	console.log("in get evaluation table");
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=getStudentEvaluationData&studentId="+studentId, 
		dataType: "json",
		success: function(msg)
		{ 
			console.log("success");
			generateTable("Student Evaluation Table",msg,previousViewInfo);
			
		}
		
		});
}


function deleteEvaluation(evaluation_id,previousViewInfo) // used by TDE 
{
	bootbox.confirm("Are you sure you want to delete this evaluation?", 
		function(result)
		{
  			if(result == true)
  			{
				$.ajax({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteEvaluation&evaluation_id="+evaluation_id, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{
							alertWarning("Evaluation deleted successfully");
							generateProfile(previousViewInfo[0],previousViewInfo[1],previousViewInfo[2]);
						}
						else
						{
							alertWarning(""+msg);
						}
						
					}
					
					});
			}
		});
}



function getStudentEvaluationForm(studentId) // request the evaluation template for a student from the server.
{
	$.ajax({

		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=getStudentEvaluationForm&studentId="+studentId, 
		dataType: "json",
		success: function(msg){ 
				generateForm("Student Evaluation Form",msg);	
				//$('#formDiv').html(table);
			}
		
		});
}



function submitEvaluation()  // submit an evaluation
{
	studentList = null;
	var url = "index.php"; // the script where you handle the form input.
	console.log($('#studentEvaluationForm').serialize());
    $.ajax({
           type: "POST",
           url: url,
           data: $('#studentEvaluationForm').serialize()+"&grp=Ajax&cmd=evaluate",
           dataType:"json", // serializes the form's elements.
           success: function(data)
           {
               if(data==true)
               {
               		alertWarning("evaluation submitted successfully"); // show response from the php script.
               		getTabContent(currentTab);
               }
               else 
               {
               		alertWarning("Couldn't submit evaluation: "+data);
               }
           }
         });
    //getTabContent(currentTab); // will generate the tab that was previously opened before the evaluation
    return false; // avoid to execute the actual submit of the form.
}


function requestEvaluationReset()
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=requestEvaluationReset&studentId="+studentId, 
		dataType: "json",
		success: function(msg)
		{ 
			alertWarning(msg+""); // just to see if the data made it to the right place on the server
		}
		
		});
}
