
function getStudentInfo(studentId)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#studentAddForm').serialize() + "&grp=Ajax&cmd=addStudent", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("student added successfully");
				//getTabContent(currentTab);
			}
			else 
			{
				alertWarning("Couldn't add student");
			}
		}
		
		});
	return false;
}

function addStudent(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#studentAddForm').serialize() + "&grp=Ajax&cmd=addStudent", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("student added successfully");
				if(previousViewInfo.length >0)
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],null,"studentId="+ $('#studentId').val());
				}
				else 
				{
					generateTable("Students","","");
				}
				//getTabContent(currentTab);
			}
			else 
			{
				//callback(1,msg);
				//alertWarning();
				alertWarning("Couldn't add student : " + msg);
				//getTabContent(currentTab);
			}
			
		}
		});
	return false;

}
function updateStudent(previousViewInfo)
{
	// request student data from the server and construct student modification view 

	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#studentUpdateForm').serialize() + "&grp=Ajax&cmd=updateStudent", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				//alertWarning();
				var id = $("#studentId").val();
				console.log( "id is good "+id);
				alertWarning("student information updated successfully");
				if(previousViewInfo.length >0)
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"","studentId="+id);
				}
				else 
				{
					generateTable("Students","","","studentId="+id);
				}
				//getTabContent(currentTab);
			}
			else 
			{
				//alertWarning();
				alertWarning("Couldn't update student information");
				//getTabContent(currentTab);
			}

			

		}
		
		});
	return false;
}

function deleteStudent(studentId,previousViewInfo)
{
	// request student data from the server and construct student modification view 
	bootbox.confirm("Are you sure you want to delete this student?", 
		function(result) 
		{
  			if(result == true)
  			{
				$.ajax({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteStudent&studentId="+studentId, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{
							//alertWarning();
							//getTabContent(currentTab);
							alertWarning("Student deleted successfully");
							if(previousViewInfo.length >0)
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								getTabContent("Students");
							}
						}
						else
						{
							//alertWarning();
							alertWarning(""+msg);
						}
						
					}
					
					});
			}
		});
	
}




function importStudents(element)
{
	//var loading = $(" <img src='assets/loading.gif' />").insertAfter(element);
		$("#loading").html("<img src='assets/loading.gif' />");
			if(element.files && element.files[0]){
				var reader = new FileReader();
				reader.onload = function (e) {  
					var output=e.target.result;
				
					//process text to show only lines with "@":				
					// start the transaction 

					$.ajax({
						type: "POST",
						url: "index.php", 
						data: "grp=Ajax&cmd=startDataImportingTransaction&data="+output, 
						dataType: "json",
						success: function(msg)
						{ 
							if(msg==true)
							{
								//callback(0,msg);

								alertWarning("students were imported successfully");
							}
							else
							{
								alertWarning("Error : " + msg );
								//callback(1,msg);
							}
							$("#loading").html("");
							console.log("trannsaction result : "+msg);
							//loading.remove();

						},
						error:function(msg)
						{
							$("#loading").html("");
							alertWarning("Error : " + msg );
							
						}
					}); 

					//document.getElementById('main').innerHTML= lines[0];
				};//end onload()
				reader.readAsText(element.files[0]);
			}//end if html5 filelist support
} 