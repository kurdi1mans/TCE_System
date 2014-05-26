
var time_string="";
var currentTab = "";

function getTabContent(tabName)  // if a user clicks on a tab the content for that tab is generated.
{
	currentTab = tabName;
	if(tabName=="Settings")
	{
		// if data is null display error message
		generateForm("Settings","");
		//$('#formDiv').html(form);
	}
	else if (tabName == "Students")
	{
		generateTable("Students","");
		//$('#formDiv').html(table);
		// if data is null display error message
		
	}

}


function addClassRules()
{
	// length rules
	var lengths = [2,3,4,5,6,7,8,9,10];
	for (var i = 0; i < lengths.length; i++) {
		jQuery.validator.addClassRules('min-len-'+lengths[i], {
	        required: true,
	        minlength: lengths[i]
	    });
	
		jQuery.validator.addClassRules('max-len-'+lengths[i], {
	        required: true,
	        maxlength: lengths[i]
	    });
	};

    jQuery.validator.addClassRules('number', {
	        required: true,
	        number: true
	});

    // date validator
    jQuery.validator.addMethod("greaterThan", 
	function(value, element, params) {

    if (!/Invalid|NaN/.test(new Date(value))) {
        return new Date(value) > new Date($(params).val());
    }

    return isNaN(value) && isNaN($(params).val()) 
        || (Number(value) > Number($(params).val())); 
},'Must be greater than Starting Date.');
     


}

function generateForm(formName,data)
{
	//alert(formName);
	$("#tabName").text(formName+"");
	if(formName == "Settings")
	{
		
		$.ajax({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getTabContent&tabName=Settings", 
			dataType:"json",
			success: function(msg)
			{ 
				var settings="";
				settings += "<div id='passwordResetContainer' style='width:30%;'>";
				settings += "<form role='form' action='index.php' id='userPasswordChangeForm'>";
				settings += "<div class='form-group'>";
				settings += "<label for='"+msg[0]+"'>Current Password</label>";
				settings += "<input type='password' class='form-control' id='"+msg[0]+"' name='"+msg[0]+"' placeholder='Current password'>";
				settings += "  </div>";
				settings += "  <div class='form-group'>";
				settings += "    <label for='"+msg[1]+"'>New Password</label>";
				settings += "    <input type='password' class='form-control' id='"+msg[1]+"' name='"+msg[1]+"' placeholder='New password'>";
				settings += "  </div>";
				settings += "      <div class='form-group'>";
				settings += "    <label for='"+msg[2]+"'>Confirm New Password</label>";
				settings += "    <input type='password' class='form-control' id='"+msg[2]+"' name='"+msg[2]+"' placeholder='Confirm new password'>";
				settings += "  </div>";
				settings += "  <button type='submit' class='btn btn-primary btn-lg btn-block'>Change Password</button>";
				settings += "</form>";
				settings += "</div>";
				$('#formDiv').html(settings);
				$('#userPasswordChangeForm').submit(changeUserPassword);
			}

		});

	}
	else if(formName == "Student Evaluation Form")
	{
		/*
		var cols = data[1];
		var rows = data[0];
		var studentId = data[2];
		var table = "<form id='studentEvaluationForm' method='post' action='index.php'><table class='table table-striped'><tr>";
		table += "<input type='hidden' id='studentId' name='studentId' value='"+studentId + "' />";
		table+="<th >Criteria/Grade</th>";
		for (var i = 0; i < cols.length; i++) // construct the header of the table 
		{
			table+="<th >"+ cols[i]+"</th>";
		};
		table += "</tr>";

		for (var i = 0; i < rows.length; i++) // construct the rest of the table
		{
			table += "<tr>";
			table+="<td >"+rows[i]+"</td>";
			for (var j = 0; j < cols.length; j++) 
			{
				table+="<td ><input type='radio' name='"+rows[i]+"' value='"+cols[j]+"' id='"+rows[i]+"' /> </td>";
			}
			table += "</tr>";
		}
		table += "</table>";
		table += "<input type='submit' id='submit' style='margin-left:50%;'/>";
		table += "</form>";
		$('#formDiv').html(table);*/

		var gloablVals = data[0];
		var fields = data[1];
		var stuID = data[2];

		var table = "<form id='studentEvaluationForm' method='post' action='index.php'><table class='table table-striped'><tr>";
		table += "<input type='hidden' id='studentId' name='studentId' value='"+stuID + "' />";
		table+="<th >Criteria/Grade</th>";
		for (var i = 0; i < gloablVals.length; i++) // construct the header of the table 
		{
			table+="<th >"+ gloablVals[i][0]+"</th>";
		};

		for (var i = 0; i < fields.length; i++) // construct the rest of the table
		{
			var field = fields[i];
			if(field[1] == "rubric")
			{
				table += generateRubricRow(field,gloablVals.length);
			}
			else 
			{
				table += generateTextualRow(field,gloablVals.length);
			}
		}
		table += "</table>";
		table += "<button type='button' id='cancel' class='btn btn-warning btn-lg' onClick='generateTable(\"Students\");'>Cancel</button> <button type='submit' id='submit' class='btn btn-success btn-lg ' >Submit Evaluation</button>";
		table += "</form>";
		$('#formDiv').html(table);
		addClassRules();
		$('#studentEvaluationForm').validate({ // initialize the plugin
        	submitHandler: function (form) 
        	{ // for demo
           		submitEvaluation();
            	return false; // for demo
     		}
		});
		//$('#studentEvaluationForm').submit(submitEvaluation);

	}
}

function generateTextualRow(field,length)
{
	var row = "<tr>";
	row += "<td>"+field[2]+"</td><td> <textarea class='form-control' name='field"+field[0]+"' required></textarea> </td>";
	row+= "</tr>";
	return row;
}

function generateRubricRow(field,length)
{
	var row = "<tr>";
	row+="<td >"+field[2]+"</td>";
	for (var j = 3; j < field.length; j++) 
	{
		row+="<td > <input type='radio' name='field"+field[0]+"' value='"+(j-3)+"' id='field"+field[0]+"' required/> "+field[j]+" </td>";
	}

	row+= "</tr>";
	return row;
}
function generateTable(tableName,data)
{
	$("#tabName").text(tableName+"");
	console.log("table is amazing");
	if (tableName == "Students")
	{
		$.ajax({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getTabContent&tabName=Students", 
			dataType:"json",
			success: function(msg)
			{ 

				var table = "<table class='table table-striped'>";
				table += "<tr> <th >ID</th><th >Name</th> <th >Training type</th><th >Major</th><th >Evaluation</th><th >Starting Date</th><th >End Date</th><th >Filling Date</th></tr>";

				for (var i = 0; i < msg.length; i++) 
				{
					var student = msg[i];
					console.log(student);
					table +="<tr> <td >"+student[0]+"</td><td >"+student[2]+", "+student[1]+"</td> <td >"+student[3]+"</td><td >"+student[4]+"</td>";
					if(student[9] != null )table += "<td ><a href='#' onClick='getStudentEvaluationData("+student[0]+");'>View</a></td>"; // student has an evaluation  (<a href='#' onClick='requestEvaluationReset("+student[0]+");'>Request Reset</a>)
					else table += "<td ><a href='#' onClick='getStudentEvaluationForm("+student[0]+");'>Evaluate</a></td>";
					table+="<td >"+student[7]+"</td>"+"<td >"+student[8]+"</td>";
					if(student[9] != null )table+="<td >"+student[10]+"</td>";
					else table+="<td></td>";
					table += "</tr>";
				}
				table += "</table>";
				$('#formDiv').html(table);
				return table;

			}

		});
		
		
	}
	else if(tableName == "Student Evaluation Table")
	{
		/*var grade = data[1];
		var criteria = data[0];
		var table = "<table class='table table-striped'><tr><th>Criteria </th><th>Evaluation</th></tr>";
		for (var i = 0; i < criteria.length; i++) // construct the header of the table 
		{
			table += "<tr>" + "<th>" + criteria[i]+"</td>" +"<th>" + grade[i] +"</td>" + "</tr>";
		}
		table += "</table>";
		table += "<button onClick='getTabContent(currentTab);' >Return To Student List </button>";*/
		var values = data[0];
		console.log("data is " + values);
		var glob = data[1];
		var fields = data[2];
		var table = "<table class='table table-striped'><tr><th>Field </th><th>Evaluation</th> <th>Description</th> <th>Weight</th></tr>";
		var overall = parseInt(0);
		//var max = glob[glob.length-1][1] * values.length;
		for (var i = 0; i < values.length; i++) // construct the header of the table 
		{
			var field = fields[i];
			if(field[1] == "rubric")
				{
					var index = parseInt(values[i]) +2;
					console.log(index);
					overall+= parseInt(glob[index-2][1]);
					table+= "<tr>"+	"<td>"+field[2]+"</td>"+	"<td>"+glob[index-2][0]+"</td>"+ "<td>"+field[index]+"</td>"+"<td>"+glob[index-2][1]+"</td>"+"</tr>";
				}
			else table+= "<tr>"+	"<td>"+field[2]+"</td>"+	"<td colspan='3'>"+values[i]+"</td>"+"</tr>";
		}
		table+= "<tr class='info'>"+	"<th>Overall</th><td></td><td></td>"+	"<td>"+overall+"</td></tr>";
		table += "</table>";
		table += "<button onClick='generateTable(\"Students\");' class='btn btn-primary btn-lg' >Return To Student List </button>";
		$('#formDiv').html(table);
	}
}




/*
	Function that handle [Evaluations]
*/




/*
	End Of Functions that handle [Evaluations]
*/