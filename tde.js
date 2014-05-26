

var time_string="";
var currentTab = "";
var rowCount = 0;
var colCount = 0;

function getTabContent(tabName)  // if a user clicks on a tab the content for that tab is generated.
{
	$('#notify').empty();
	currentTab = tabName;
	if(tabName=="Settings")
	{
		// if data is null display error message
		generateForm("Settings","","");
		
	}
	else if (tabName == "Students")
	{
		generateTable("Students","","");
	
		// if data is null display error message
		
	}
	else if(tabName == "Evaluation Instances")
	{
		generateTable("Evaluation Instances","","");
	}
	else if(tabName == "Evaluation Templates")
	{
		generateTable("Evaluation Templates","","");
	}
	else if(tabName == "Import Data")
	{
		generateForm("Import Data","","");
	}
	else if(tabName == "Courses")
	{
		generateTable("Courses","","");
	}
	else if(tabName == "Majors")
	{
		generateTable("Majors","","");
	}
	else if(tabName == "Departments")
	{
		generateTable("Departments","","");
	}
	else if(tabName == "Colleges")
	{
		generateTable("Colleges","","");
	}
	else if(tabName == "Training Types")
	{
		generateTable("Training Types","","");
	}
	else if(tabName == "Export Data")
	{
		generateForm("Export Data","","");
	}

	else if(tabName == "Control Panel")
	{
		generateTable("Control Panel","","");
	}
}


function generateControl(label,name,placeholder,type,value,classes)
{
	var control = "";
	control += "<div class='form-group'>";
	control += "<label class='control-label' for='"+name+"'>"+label+"</label>";
	control += "<input type='"+type+"' class='form-control "+classes+"' id='"+name+"' name='"+name+"' placeholder='"+placeholder+"' value='"+value+"' required>";
	control += "  </div>";
	return control;
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

function generateForm(formName,data,previousViewInfo)
{

	var myFunction;
	var formId;
	$("#tabName").text(formName);
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
				
				settings += generateControl("Current Password",msg[0],"Current Password","password","");
				settings += generateControl("New Password",msg[1],"New Password","password","");
				settings += generateControl("confirm new Password",msg[2],"confirm new Password","password","");

				settings += "<button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
				settings += "</form>";
				settings += "</div>";
				$('#formDiv').html(settings);
				$('#userPasswordChangeForm').submit(changeUserPassword);
			}

		});

	}
	else if(formName == "Student Add")
	{
		var form="";
		form += "<div id='studentAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='studentAddForm' >";
		
		form += generateControl("Student Id","studentId","2xxxyyzzz'","text","","number min-len-9 max-len-9");
		

		form += generateControl("First Name","student_fname","Mansour","name","","min-len-2");
	

		form += generateControl("Last Name","student_lname","Kurdi","name","","min-len-2");
	

		form += generateControl("Email","student_email","200925130@kfupm.edu.sa","email","");
	

		form += generateControl("Course","courseId","ICS399","text","","min-len-5 max-len-7");


		form += generateControl("Semester","semester","131","text","","number min-len-3 max-len-3");


		form += generateControl("Supervisor Name","supervisor_name","Ahmad Al Ahmad","name","","min-len-2");
	

		form += generateControl("Supervisor Email","supervisor_email","ahmad@aramco.com","email","");
	

		form += generateControl("Company Name","company_name","Aramco","name","","min-len-2");


		form += generateControl("Company Location","company_location","Jeddah","text","","min-len-2");
		

		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>";
		form += "</div>";

		
		$('#formDiv').html(form);
		
		myFunction = addStudent;
		formId = "studentAddForm";
		addClassRules();
		$('#'+formId).validate({ 
	        	submitHandler: function (form) { 
	           	myFunction(previousViewInfo);
	            return false; 
	    	 }
		});
		


	}
	else if(formName == "Student Update Form")
	{
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getStudent&studentId="+data, 
           dataType:"json",
           success: function(student)
           {
           		console.log("generate update student form is called");
				var form="";
				form += "<div id='studentUpdateFormContainer' style='width:30%;'>";
				form += "<form role='form' action='index.php' id='studentUpdateForm'>";
				form += "<input type='hidden' class='form-control' id='old_studentId' name='old_studentId' value='"+student[0]+"'>";
				form += generateControl("Student Id","studentId","2xxxyyzzz'","text",student[0],"number min-len-9 max-len-9");
				form += generateControl("First Name","student_fname","Mansour","text",student[1],"min-len-2");
				form += generateControl("Last Name","student_lname","Kurdi","text",student[2],"min-len-2");
				form += generateControl("Email","student_email","200925130@kfupm.edu.sa","email",student[3],"");
				form += generateControl("Course","courseId","ICS399","text",student[4],"min-len-5 max-len-7");
				form += generateControl("Semester","semester","131","text",student[5],"number min-len-3 max-len-3");
				form += generateControl("Supervisor Name","supervisor_name","Ahmad Al Ahmad","text",student[6],"min-len-2");
				form += generateControl("Supervisor Email","supervisor_email","ahmad@aramco.com","email",student[7]);
				form += generateControl("Company Name","company_name","Aramco","text",student[8],"min-len-2");
				form += generateControl("Company Location","company_location","Jeddah","text",student[9],"min-len-2");
				form += " <button  class='btn btn-lg btn-warning' onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",null,\"studentId="+student[0]+"\");return false;'>Cancel</button>   <button type='submit' class='btn btn-lg btn-primary'>Submit</button>";
				form += "</form>"; 
				form += "</div>";
				
				
				$('#formDiv').html(form);
				
				myFunction = updateStudent;
				formId = "studentUpdateForm";
				addClassRules();
				$('#'+formId).validate({ 
		        	submitHandler: function (form) { 
		           		myFunction(previousViewInfo);
		            	return false; 
		     		}
				});
           }
       });
		
	}
	else if(formName == "Add Instance")
	{
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTemplates", 
           dataType:"json",
           success: function(templates)
           {
               var form="";
					form += "<div id='instanceAddFormContainer' style='width:30%;'>";
					form += "<form role='form' action='index.php' id='instanceAddForm'>";

					form += generateControl("Semester","semester","132","text","","number min-len-3 max-len-3");
					form += generateControl("Starting Date","sdate","","text","","");
					form += generateControl("Expiration Date","edate","","text","");

					form += "<div class='form-group'>";
					form += "<label for='template'>Template </label>";
					form += "<select form='instanceAddForm' name='template' id='template' class='form-control'>";
					var selected = "";
					for (var i = 0; i < templates.length; i++) {
						var template = templates[i];
						form += "<option value='"+template[0]+"'"+selected+">"+template[1]+"</option>";
					}
					form +="</select>";
					form += "  </div>";

					form += " <button class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
					form += "</form>";
					form += "</div>";
				
					
					$('#formDiv').html(form);
					var pickerOpts = {
						dateFormat: $.datepicker.ATOM,
						};	
					$('#sdate').datepicker(pickerOpts);
					$('#edate').datepicker(pickerOpts);
					myFunction = addInstance;
					formId = "instanceAddForm";
					addClassRules();
					$('#'+formId).validate({ 
						rules: {
        					edate: { greaterThan: "#sdate" }
    					},
			        	submitHandler: function (form) { 
			           		myFunction(previousViewInfo);
			            	return false; 
     					}
					});
           	}
         });
		
	}
	else if(formName == "Update Instance")
	{
		var url = "index.php"; 

    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTemplates", 
           dataType:"json",
           success: function(templates)
           {
               var form="";
					form += "<div id='UpdateFormContainer' style='width:30%;'>";
					form += "<form role='form' action='index.php' id='instanceUpdateForm'>";
					form += "<input type='hidden' class='form-control' id='instanceId' name='instanceId' value='"+data[0]+"'>";

					form += generateControl("Semester","semester","132","text",data[2],"number max-len-3 min-len-3");
					form += generateControl("Starting Date","sdate","","text",data[3],"");
					form += generateControl("Expiration Date","edate","","text",data[4],"");
					
					form += "<div class='form-group'>";
					form += "<label for='template'>Template </label>";
					form += "<select form='instanceUpdateForm' name='template' id='template' class='form-control'>";
					var selected = "";
					for (var i = 0; i < templates.length; i++) {
						var template = templates[i];

						if(template[0] == data[1])selected = "selected='selected'"; // to make the selected option the original template
						else selected = "";

						form += "<option value='"+template[0]+"'"+selected+">"+template[1]+"</option>";
					}
					form +="</select>";
					form += "  </div>";

					form += "  <button class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",null);return false;'>Cancel</button>  <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
					form += "</form>";
					form += "</div>";
					
					console.log(form);
					$('#formDiv').html(form);
					var pickerOpts = {
						dateFormat: $.datepicker.ATOM,
						};	
					
	
					$('#sdate').datepicker(pickerOpts);
					$('#edate').datepicker(pickerOpts);
					
					myFunction = updateInstance;
					formId = "instanceUpdateForm";
					addClassRules();
					$('#'+formId).validate({ 
						rules: {
        					edate: { greaterThan: "#sdate" }
    					},
        				submitHandler: function (form) { 
           				myFunction(previousViewInfo);
            			return false; 
    			 	}
	});
           }
         });
		
		
	}
	else if(formName == "Add Domain")
	{
		var form="";
		form += "<div id='domainAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='domainAddForm'>";

		form += "<input type='hidden' class='form-control' id='instanceId' name='instanceId' value='"+data+"'>";
		
		form += "<div class='form-group'>";
		form += "<select class='form-control' form=\"domainAddForm\" onchange=\"domainAddChangeCallBack(this);\">";
		form += "		  	<option value=\"-1\">Select Range<\/option>";
		form += "		  	<option value=\"all\">All<\/option>";
		form += "		  	<option value=\"college\">Specific College<\/option>";
		form += "		  	<option value=\"department\">Specific Department<\/option>";
		form += "		  	<option value=\"major\">Specific Major<\/option>";
		form += "<\/select>";
		form += "  </div>";

		form += "<div id='training_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{

				var input = "";
				input += "<label for='training'>Training Type</label>";
				input += "<select class='form-control' name='training' id='training' form=\"domainAddForm\">";
				input += "<option value=\"-1\">Select Training Type<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i]+"\">"+list[i]+"<\/option>";
				};
				input += "<\/select>";
				$("#training_div").html(input);
			}
		});

		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";

		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
	
		$('#formDiv').html(form);				
		myFunction = addDomain;
		formId = "domainAddForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
		
	}
	else if(formName == "Update Domain")
	{
		var form="";
		form += "<div id='domainUpdateFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='domainUpdateForm'>";
		form += "<input type='hidden' class='form-control' id='domainId' name='domainId' value='"+data[0]+"'>";

		form += "<input type='hidden' class='form-control' id='instanceId' name='instanceId' value='"+data[1]+"'>";
		
		form += "<div class='form-group'>";
		form += "<select class='form-control' form=\"domainUpdateForm\" onchange=\"domainUpdateChangeCallBack(this);\">";
		form += "		  	<option value=\"-1\">Select Range<\/option>";
		form += "		  	<option value=\"all\">All<\/option>";
		form += "		  	<option value=\"college\">Specific College<\/option>";
		form += "		  	<option value=\"department\">Specific Department<\/option>";
		form += "		  	<option value=\"major\">Specific Major<\/option>";
		form += "<\/select>";
		form += "  </div>";
		

		form += "<div id='training_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='training'>Training Type</label>";
				input += "<select class='form-control' name='training' id='training' form=\"domainUpdateForm\">";
				input += "<option value=\"-1\">Select Training Type<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i]+"\">"+list[i]+"<\/option>";
				};
				input += "<\/select>";
				$("#training_div").html(input);
			}
		});

		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";

		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
		
		myFunction = updateDomain;
		formId = "domainUpdateForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});

		
	}
	else if(formName == "Add Template")
	{

		var url = "index.php";
		console.log("in form add Template");
		$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTemplates", 
           dataType:"json",
           success: function(templates)
           {
           		var templateNames = templates.map(function(value,index) { return value[1]; });
           		var templateIds = templates.map(function(value,index) { return value[0]; });
           		templateNames.unshift("New Template");
           		templateIds.unshift("new");
           		var table = "<div class='form-group col-lg-2' ><label for='cols'>Columns: </label><input class='form-control ' type='number' name='cols' id='cols' min='2' max='10' required ></div>";
           		table+=  "<div class='form-group col-lg-2' >" + generateSelectControl("Based On","template","",templateNames,templateIds,"") + "</div>";
				table += "<br /><button type='button' class='btn btn-primary btn-lg' onClick='generateRubricInfoCollector("+data+","+JSON.stringify(previousViewInfo)+");'>Genearate Form</button>";
				table += "<br /><div id='rubricDiv'></div>";
				$('#formDiv').html(table);
           }
       });
		
		
		
	}
	else if(formName == "Modify Template")
	{
		generateRubricFormUpdate(data,previousViewInfo,"modify");
	}

	else if(formName == "Correct Template")
	{
		generateRubricFormUpdate(data,previousViewInfo,"correct");
	}

	else if(formName == "Add Course")
	{
		var form="";
		form += "<div id='courseAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='courseAddForm'>";

		form += generateControl("Course Code","courseId","ICS399","text","","min-len-5 max-len-7");

		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";
		
		

		form += "<div id='training_div' class='form-group'>";
		form += "  </div>";
		

		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
	
		$('#formDiv').html(form);

		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=majors",
			dataType:"json",
			success: function(list)
			{

				var input = "";
				var majors = list.map(function(value,index) { return value[0]; });
				console.log(majors);
				input+= generateSelectControl("Major","major","courseAddForm",majors ,majors,"");
				$("#data_div").html(input);
			}
		});
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{

				var input = "";
				input+=generateSelectControl("Training Type","training_type","courseAddForm",list,list,"");
				
				$("#training_div").html(input);
			}
		});
		

		myFunction = addCourse;
		formId = "courseAddForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});

	}
	else if(formName == "Update Course")
	{
		var form="";
		form += "<div id='courseUpdateFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='courseUpdateForm'>";

		form += "<input type='hidden' class='form-control' id='old_id' name='old_id' value='"+data[0]+"' >";

		form += generateControl("Course Code","courseId","ICS399","text",data[0],"min-len-5 max-len-7");


		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=majors",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				var majors = list.map(function(value,index) { return value[0]; });
				input+=generateSelectControl("Major","major","courseUpdateForm",majors,majors,"");
			
				$("#data_div").html(input);
			}
		});

		form += "<div id='training_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{

				var input = "";
				input+=generateSelectControl("Training Type","training_type","courseUpdateForm",list,list,"");
				
				$("#training_div").html(input);
			}
		});

		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
	
		myFunction = updateCourse;
		formId = "courseUpdateForm";
		addClassRules();
		$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            	return false; 
     		}
		});
	}
	else if(formName == "Add Major")
	{
		var form="";
		form += "<div id='courseAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='majorAddForm'>";

		form += generateControl("Major Code","major_code","CS","text","","min-len-2 max-len-4");
	

		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=departments",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				var depts = list.map(function(value,index) { return value[0]; });
				input+=generateSelectControl("Department","department","majorAddForm",depts,depts,"");
				
				$("#data_div").html(input);
			}
		});

		
		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
		
		myFunction = addMajor;
		formId = "majorAddForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
	}
	else if(formName == "Update Major")
	{
		var form="";
		form += "<div id='majorUpdateFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='majorUpdateForm'>";

		form += "<input type='hidden' class='form-control' id='old_major' name='old_major' value='"+data[0]+"' >";

		form += generateControl("Major Code","major_code","CS","text",data[0],"min-len-2 max-len-4");


		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=departments",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				var depts = list.map(function(value,index) { return value[0]; });
				input+=generateSelectControl("Department","department","majorUpdateForm",depts,depts,"");
				
				$("#data_div").html(input);
			}
		});


		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
	
		myFunction = updateMajor;
		formId = "majorUpdateForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
		
	}
	else if(formName == "Add Department")
	{
		var form="";
		form += "<div id='departmentAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='departmentAddForm'>";

		form += generateControl("Department Code","dept_code","ICS","text",""," min-len-2 max-len-4 ");

		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";
		
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=colleges",
			dataType:"json",
			success: function(list)
			{
				var text = generateSelectControl("College","college","departmentAddForm",list,list,"");
				
				$("#data_div").html(text);
			}
		});

		
		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
	
		myFunction = addDepartment;
		formId = "departmentAddForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
	}
	else if(formName == "Update Department")
	{
		var form="";
		form += "<div id='departmentUpdateFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='departmentUpdateForm'>";

		form += "<input type='hidden' class='form-control' id='old_dept' name='old_dept' value='"+data[0]+"' >";

		form += generateControl("New Department Code","dept_code","ICS","text",data[0],"min-len-2 max-len-4");

		form += "<div id='data_div' class='form-group'>";
		form += "  </div>";
		

		
		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=colleges",
			dataType:"json",
			success: function(list)
			{
				var text = generateSelectControl("College","college","departmentUpdateForm",list,list,"");
			
				$("#data_div").html(text);
			}
		});
		myFunction = updateDepartment;
		formId = "departmentUpdateForm";
			addClassRules();
		$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});

	}
	else if(formName == "Add College")
	{
		var form="";
		form += "<div id='collegeAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='collegeAddForm'>";

		form += generateControl("College Code","college","CCSE","text","","min-len-2 max-len-4");
		
		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
		
		myFunction = addCollege;
		formId = "collegeAddForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
	}
	else if(formName == "Update College")
	{
		var form="";
		form += "<div id='collegeUpdateFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='collegeUpdateForm'>";

		form += "<input type='hidden' class='form-control' id='old_college' name='old_college' value='"+data[0]+"' >";

		form += generateControl("New College Code","college","CCSE","text",data[0],"min-len-2 max-len-4");

		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
		
		myFunction = updateCollege;
		formId = "collegeUpdateForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
	}

	else if(formName == "Add Training Type")
	{
		var form="";
		form += "<div id='trainingAddFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='trainingAddForm'>";

		form += generateControl("Training Type","training","summer","text","","min-len-2 max-len-10");
		
		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);

		myFunction = addTrainingType;
		formId = "trainingAddForm";
			addClassRules();
	$('#'+formId).validate({ 
        	submitHandler: function (form) { 
           		myFunction(previousViewInfo);
            return false; 
     }
	});
	}
	else if(formName == "Update Training Type")
	{
		var form="";
		form += "<div id='trainingUpdateFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='trainingUpdateForm'>";

		form += "<input type='hidden' class='form-control' id='old_training' name='old_training' value='"+data[0]+"' >";

		form += generateControl("New Training Type","training","summer","text",data[0],"min-len-2 max-len-10");
		
		form += "   <button  class='btn btn-warning btn-lg' onClick='generateTable(\""+previousViewInfo[0]+"\",null,null);return false;'>Cancel</button> <button type='submit' class='btn btn-primary btn-lg'>Submit</button>";
		form += "</form>"; 
		form += "</div>";
		console.log(form);
		$('#formDiv').html(form);
		myFunction = updateTrainingType;
		formId = "trainingUpdateForm";
	
		addClassRules();
		$('#'+formId).validate({ 
        	submitHandler: function (form) 
        	{ 
           		myFunction(previousViewInfo);
            	return false; 
     		}
		});

	}
	else if(formName== "Export Data")
	{
		var exportOptions = ["Student Data","Company Data"];

		var form="";
		form += "<div id='exportDataFormContainer' style='width:30%;'>";
		form += "<form role='form' action='index.php' id='exportDataForm'>";

		form+="<div class='form-group'>"+ generateSelectControl("Export ","export_option","exportDataForm",exportOptions,exportOptions,"exportOptionsListSelectionChanged(this);") +"</div>";

		form += "<div id='exportOption'> </div> "




		form += "    <button type='submit' class='btn btn-primary btn-lg'>Export Data</button>";
		form += "</form>"; 
		form += "<br > <br > <div id='downloadDiv'></div>";
		form += "</div>";

		

		$('#formDiv').html(form);
		myFunction = exportData;
		formId = "exportDataForm";
		addClassRules();
		$('#'+formId).validate({ 
        	submitHandler: function (form) 
        	{ 
           		myFunction(previousViewInfo);
            	return false; 
     		}
		});

	}

	else if(formName== "Import Data")
	{
		console.log("import ");
		var form="";
		form += " <div class=\"form-group\">";
		form += "    <label for=\"exampleInputFile\">Import Students From an External File</label>";
		form += "    <input type=\"file\" id=\"exampleInputFile\"  onchange='importStudents(this);' /> <span id='loading' ></span>";
		form += "  </div>";

		$('#formDiv').html(form);

	}

}

function exportOptionsListSelectionChanged(sel)
{
	var value = sel.options[sel.selectedIndex].value;
	var form = "";
	if(value == "Student Data")
	{
		var byList = ["Semester","Instance"];
		var domainList = ["All","College","Department","Major"];

		form+="<div class='form-group'>"+ generateSelectControl("Export By ","export_by","exportDataForm",byList,byList,"byListSelectionChanged(this);") +"</div>";

		form+="<div class='form-group'>"+ generateSelectControl("Domain","domainType","exportDataForm",domainList,domainList,"domainListSelectionChanged(this);")+"</div>";

		form += "<div class='form-group' id='by_div'></div>";
		
		form += "<div class='form-group' id='data_div'></div>";

		form += "<div id='training_div' class='form-group'></div>";

		$('#exportOption').html(form);

		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{
				list.unshift("all");
				var input = generateSelectControl("Training Type","training","exportDataForm",list,list,"");
			
				$("#training_div").html(input);
			}
		});

	}
	else if(value == "Company Data")
	{
		form += "<div class='form-group' id='semesters_div'></div>";

		form += "<div id='training_div' class='form-group'></div>";

		$('#exportOption').html(form);

		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{
				list.unshift("all");
				var input = generateSelectControl("Training Type","training","exportDataForm",list,list,"");
				$("#training_div").html(input);
			}
		});
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=Semester",
			dataType:"json",
			success: function(list)
			{
				var input = generateSelectControl("Semester","semester","exportDataForm",list,list,"");
				$("#semesters_div").html(input);
			}
		});


	}
}

function domainListSelectionChanged(sel)
{
	var value = sel.options[sel.selectedIndex].value;

	if(value=="All")
	{

		var input = "";
		input += "<input type='hidden' class='form-control' id='all' name='all' value='1'>";
		$("#data_div").html(input);

	}
	else if(value=="College")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=colleges",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='college'>College</label>";
				input += "<select class='form-control' name='college' form=\"exportDataForm\">";
				input += "<option value=\"-1\">Select College<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i]+"\">"+list[i]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="Department")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=departments",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='department'>Department</label>";
				input += "<select class='form-control' name='department' form=\"exportDataForm\">";
				input += "<option value=\"-1\">Select Department<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i][0]+"\">"+list[i][0]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="Major")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=majors",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='major'>Major</label>";
				input += "<select class='form-control' name='major' form=\"exportDataForm\">";
				input += "<option value=\"-1\">Select Major<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i][0]+"\">"+list[i][0]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else 
	{
		return "";
	}


}

function byListSelectionChanged(sel)
{
	var v = sel.options[sel.selectedIndex].value;
	$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type="+v,
			dataType:"json",
			success: function(list)
			{
				var input = generateSelectControl(v,"byValue","exportDataForm",list,list,"");
			
				$("#by_div").html(input);
			}
		});
		return false;

}

function generateSelectControl(label,name,formId,optionNames,optionValues,onChangeString)
{
	var input = "<div class='form-group'>";
	input += "<label for='"+name+"'>"+label+"</label>";
	input += "<select class='form-control' name='"+name+"' id='"+name+"' form=\""+formId+"\" onChange='"+onChangeString+"'  required>";
	input += "<option disabled selected value=\"-1\">"+label+"<\/option>";
	for (var i = 0; i < optionNames.length; i++) {
		input += "<option value=\""+optionValues[i]+"\">"+optionNames[i]+"<\/option>";
	};
	input += "<\/select>";
	input+= "</div>";
	return input;
}

function remindSupervisor(elm,super_id)
{
	//alertWarning("sending reminder to supervisor, please wait...",1000);
	var loading = $(" <img src='assets/loading.gif' />").insertAfter(elm);
	$.ajax
	({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=RemindeSupervisor&supervisor_id="+super_id,
		dataType:"json",
		success: function(msg)
		{ 
			if(msg == true )
			{
				loading.remove();
				elm.innerHtml = "Reminder Sent";
				alertWarning("reminder sent to supervisor successfully");
			}
			else 
			{
				loading.remove();
				alertWarning("couldn't send reminder to supervisor, please try again later.");
			}
		},
		error: function(msg)
		{
			loading.remove();
			alertWarning("couldn't send reminder to supervisor, please try again later.");
		}
	});

}

function remindAllInstanceSupervisors(elm,instanceId)
{
	
	var loading = $(" <img src='assets/loading.gif' />").insertAfter(elm);
	$.ajax
	({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=RemindAll&instance_id="+instanceId,
		dataType:"json",
		success: function(msg)
		{ 
			if(msg == true )
			{
				loading.remove();
				elm.innerHtml = "Reminder Sent to All Supervisors";
				alertWarning("reminders sent to all supervisors successfully");
			}
			else 
			{
				loading.remove();
				alertWarning("couldn't send reminders to all supervisors, please try again later.");
			}
		},
		error: function(msg)
		{
			loading.remove();
			alertWarning("couldn't send reminders to all supervisors, please try again later.");
		}
	});

}

function generateTable(tableName,data,previousViewInfo,filterQuery)
{
	$("#tabName").text(tableName+"");
	
	var info = JSON.stringify(["Students",null,null,filterQuery]);
	if (tableName == "Students")
	{
		var info = JSON.stringify(["Students"]);
		var table =""; 
		table += "<div id='bar'>"+generateBar("Add Student","generateForm(\"Student Add\",null,"+info+");","Find Student By Id","studentId")+"</div>";
		table += "<div id='studentListDiv'></div>";
		$('#formDiv').html(table);

		var funct = function(){
		 generateTable("Students",null,null,$("#searchForm").serialize()); 
		 return false;
		};
		$('#searchForm').submit(funct);		

		if(filterQuery != null)
		{
			$.ajax
			({
				type: "POST",
				url: "index.php", 
				data: "grp=Ajax&cmd=getTabContent&tabName=Students&"+filterQuery,
				dataType:"json",
				success: function(msg)
				{ 
					
					console.log(msg);
					var table =""; 
					table += "<table class='table table-striped'>";
					
					table += "<tr> <th >###</th><th >ID</th><th >Name</th>";
					table += "</tr>";
					for (var i = 0; i < msg.length; i++) 
					{
						var student = msg[i];
						if(student == null) break;
						// edit delete buttons
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class=\"dropdown-menu\"><li><a href='#' id='getProfile' onClick='generateProfile(\"Student Profile\","+student[0]+","+info+");'>View Profile</a></li> <li><a href='#' onClick='generateForm(\"Student Update Form\","+student[0]+","+info+");'>Edit</a></li><li><a href='#' onClick='deleteStudent("+student[0]+","+info+");'>Delete</a></li> </ul></div> </td> "; 
						// student info
						table +="<td >"+student[0]+"</td><td >"+student[2]+", "+student[1]+"</td>";
					
						table += "</tr>";
					}
					
					$('#studentListDiv').html(table);
					

				},
				error: function(msg)
				{
					alertWarning("An error occured : " + msg);
				}
			
			});
		}
		
	}
	else if(tableName == "Student Evaluation Table")
	{
		var values = data[0];
		var glob = data[1];
		var fields = data[2];
		var table = "<table class='table table-striped'><tr><th>Field </th><th>Evaluation</th> <th>Description</th> <th>Weight</th></tr>";
		var overall = 0;
		//var max = glob[glob.length-1][1] * values.length;
		for (var i = 0; i < values.length; i++) // construct the header of the table 
		{
			var field = fields[i];
			if(field[1] == "rubric")
				{
					var index = parseInt(values[i]) +2;
					console.log(index);
					overall+=glob[index-2][1];
					table+= "<tr>"+	"<td>"+field[2]+"</td>"+	"<td>"+glob[index-2][0]+"</td>"+ "<td>"+field[index]+"</td>"+"<td>"+glob[index-2][1]+"</td>"+"</tr>";
				}
			else table+= "<tr>"+	"<td>"+field[2]+"</td>"+	"<td colspan='3'>"+values[i]+"</td>"+"</tr>";
		}
		table+= "<tr class='info'>"+	"<th>Overall</th><td></td><td></td>"+	"<td>"+overall+"</td></tr>";
		table += "</table>";
		table += "<button onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+");' class='btn btn-primary btn-lg' >Return To Student List </button>";
		$('#formDiv').html(table);
	}
	else if(tableName == "Evaluation Instances")
	{
		var info = JSON.stringify(["Evaluation Instances"]);
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getTabContent&tabName=Instances", 
			dataType:"json",
			success: function(msg)
			{ 
				var table = "";
				table += "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Instance\",null,"+info+");'>Add Instance</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Instance Id</th><th >Template</th> <th >Semester</th><th >Starting Date</th><th >Expiration Date</th><th >Number of Evaluations</th></tr>";
					for (var i = 0; i < msg.length; i++) 
					{
						var instance = msg[i];
						var viewStudentsLink = "<li><a href='#' onClick='generateTable(\"Instance Students\","+instance[0]+","+info+");'>View Students</a></li>";
						var editInstanceLink = "<li><a href='#' onClick='generateForm(\"Update Instance\","+JSON.stringify(instance)+","+info+");'>Edit</a></li> ";
					

						if(instance[instance.length-1]>0) // if the number of evaluations for this instance is >0
							{
								editInstanceLink = ""; // doesn't allow edit if theere are evaluations of this instance
							}
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table +="<ul class=\"dropdown-menu\">" +  viewStudentsLink+editInstanceLink+"<li><a href='#' onClick='deleteInstance("+instance[0]+","+info+");'>Delete</a></li> <li><a href='#' onClick='generateTable(\"Instance Domains\","+instance[0]+","+info+");'>View Associated Domains</a></li></ul> </div></td> ";
						table +="<td>"+instance[0]+"</td><td >"+instance[1]+"</td>"+"<td >"+instance[2]+"</td>"+"<td >"+instance[3]+"</td>"+"<td >"+instance[4]+"</td>"+"<td >"+instance[5]+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
			}
		});
	}
	else if (tableName == "Instance Students")
	{
		var info = JSON.stringify(["Instance Students",data,previousViewInfo]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getInstanceStudentList&instanceId="+data, 
           dataType:"json",
           success: function(students)
           {
           		if(students.length >0)
           		{
           			var table = "";
           			table += "<button class='btn btn-primary btn-lg' onclick='generateTable(\"Evaluation Instances\",\"\",\"\");' >Back</button> <button id='remindAllButton' class='btn btn-success btn-lg' onClick='remindAllInstanceSupervisors(this,"+data+");'>Remind All Instance Supervisors</button> <br><br>";
					table += "<table class='table table-striped'>";
					
					table += "<tr> <th >###</th><th >Id</th><th >Name</th> <th >Supervisor</th>";
					table += "<th >Evaluation</th></tr>";
					for (var i = 0; i < students.length; i++) 
					{
						var student = students[i];
						// edit delete buttons
						// modify this to make Edit button in student profile 
						
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						
						table+= "<ul class='dropdown-menu'><li><a href='#' onClick='generateProfile(\"Student Profile\","+student[0]+","+info+");'>View Profile</a></li> <li><a href='#' onClick='generateForm(\"Student Update Form\","+student[0]+","+info+");'>Edit</a></li><li><a href='#' onClick='deleteStudent("+student[0]+","+info+");'>Delete</a></li> </ul> </div></td> "; 
						// student info
						table +="<td >"+student[0]+"</td><td >"+student[2]+", "+student[1]+"</td> <td >"+student[5]+"</td>";
						
						if(student[19] != null )table += "<td ><a href='#' onClick='getStudentEvaluationData("+student[19]+","+info+");'>View</a>(<a href='#' onClick='deleteEvaluation("+student[19]+","+info+");'>Delete</a>)</td>"; // student has an evaluation
						
						else table += "<td ><a href='#' id='remind"+i+"' onClick='remindSupervisor(this,"+student[4]+");'>Remind Supervisor</a></td>";
						table += "</tr>";
					}
						
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			generateTable("Evaluation Instances","","");
           			alertWarning("This instance has no students");

           		}
           }
         });
	}
	else if(tableName == "Instance Domains")
	{
		var info = JSON.stringify(["Instance Domains",data]);
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getDomainsByInstanceID&instanceId="+data, 
			dataType: "json",
			success: function(msg)
			{ 
				var table = "<button class='btn btn-primary btn-lg' onclick='generateTable(\"Evaluation Instances\",\"\",\"\");' >Back</button> <button class='btn btn-success btn-lg' onClick='generateForm(\"Add Domain\","+data+","+info+");'>Add Domain</button><br/><br/>";
					
					table += "<table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Domain Id</th> <th >Training Type</th><th >Domain type</th><th >Domain value</th></tr>";
					for (var i = 0; i < msg.length; i++) 
					{
						var domain = msg[i];
						var editDomainLink = "<li><a href='#' onClick='generateForm(\"Update Domain\","+JSON.stringify(domain)+","+info+");'>Edit</a></li>";
					
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table +="<ul class='dropdown-menu'>"+ editDomainLink+"<li><a href='#' onClick='deleteDomain("+domain[0]+","+info+");'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+domain[0]+"</td>";
						table +="<td >"+domain[2]+"</td>";
						if(domain[3].length>0)
						{
							table +="<td >Major</td>";
							table +="<td >"+domain[3]+"</td>";
						}
						else if(domain[4].length>0)
						{
							table +="<td >Department</td>";
							table +="<td >"+domain[4]+"</td>";
						}
						else if(domain[5].length>0)
						{
							table +="<td >College</td>";
							table +="<td >"+domain[5]+"</td>";
						}
						else
						{
							table +="<td >All</td>";
							table +="<td >-</td>";
						}
						table += "</tr>";
					}
					table+= "</table>";

					$('#formDiv').html(table);
				if(msg.length<=0)
				{
					alertWarning("This instance has no associated domains");
				}
			}
		});
	}
	else if(tableName == "Evaluation Templates")
	{

		var info = JSON.stringify(["Evaluation Templates",data]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTabContent&tabName=Templates", 
           dataType:"json",
           success: function(templates)
           {
           		if(templates.length >0)
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Template\",null,"+info+");return false;'>Add Template</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Template Name</th></tr>";
					for (var i = 0; i < templates.length; i++) 
					{
						var template = templates[i];
						var editTemplateLink = "<li><a href='#' onClick='generateForm(\"Modify Template\","+JSON.stringify(template)+","+info+");return false;'>Modify</a></li>";
						editTemplateLink += "<li><a href='#' onClick='generateForm(\"Correct Template\","+JSON.stringify(template)+","+info+");return false;'>Correct</a></li>";
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class='dropdown-menu'>"+editTemplateLink+"<li><a href='#' onClick='deleteTemplate("+template[0]+","+info+");return false;'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+template[1]+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			alertWarning("there are no templates in the system.");
           		}
           }
         });
	}
	else if(tableName == "Courses")
	{

		var info = JSON.stringify(["Courses",data]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTabContent&tabName=Courses", 
           dataType:"json",
           success: function(courses)
           {
           		if(courses.length >0)
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Course\",null,"+info+");return false;'>Add Course</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Course Code</th> <th >Training Type</th><th >Major</th><th >Department</th><th >College</th></tr>";
					for (var i = 0; i < courses.length; i++) 
					{
						var course = courses[i];
						var editCourseLink = "<li><a href='#' onClick='generateForm(\"Update Course\","+JSON.stringify(course)+","+info+");return false;'>Edit</a></li>";
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class='dropdown-menu'>"+editCourseLink+"<li><a href='#' onClick='deleteCourse(\""+course[0]+"\","+info+");return false;'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+course[0]+"</td>"+"<td >"+course[1]+"</td>"+"<td >"+course[2]+"</td>"+"<td >"+course[3]+"</td>"+"<td >"+course[4]+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			alertWarning("This instance has no students");
           		}
           }
         });
	}
	else if(tableName == "Majors")
	{

		var info = JSON.stringify(["Majors",data]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTabContent&tabName=Majors", 
           dataType:"json",
           success: function(majors)
           {
           		if(majors.length >0)
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Major\",null,"+info+");return false;'>Add Major</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Major Code</th><th >Department Code</th></tr>";
					for (var i = 0; i < majors.length; i++) 
					{
						var major = majors[i];
						var editMajorLink = "<li><a href='#' onClick='generateForm(\"Update Major\","+JSON.stringify(major)+","+info+");return false;'>Edit</a></li>";
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class='dropdown-menu'>"+editMajorLink+"<li><a href='#' onClick='deleteMajor(\""+major[0]+"\","+info+");return false;'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+major[0]+"</td>"+"<td >"+major[1]+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Major\",null,"+info+");return false;'>Add Major</button>";
           			$('#formDiv').html(table);
           			alertWarning("There are no majors in the system. Add one using the add button ");
           		}
           }
         });
	}
	else if(tableName == "Departments")
	{

		var info = JSON.stringify(["Departments",data]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTabContent&tabName=Departments", 
           dataType:"json",
           success: function(departments)
           {
           		if(departments.length >0)
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Department\",null,"+info+");return false;'>Add Department</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Department Code</th><th >College Code</th></tr>";
					for (var i = 0; i < departments.length; i++) 
					{
						var department = departments[i];
						var editDepartmentLink = "<li><a href='#' onClick='generateForm(\"Update Department\","+JSON.stringify(department)+","+info+");return false;'>Edit</a></li>";
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class='dropdown-menu'>"+editDepartmentLink+"<li><a href='#' onClick='deleteDepartment(\""+department[0]+"\","+info+");return false;'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+department[0]+"</td>"+"<td >"+department[1]+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Department\",null,"+info+");return false;'>Add Department</button>";
           			$('#formDiv').html(table);
           			alertWarning("There are no departments in the system. Add one using the add button ");
           		}
           }
         });
	}
	else if(tableName == "Colleges")
	{

		var info = JSON.stringify(["Colleges",data]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTabContent&tabName=Colleges", 
           dataType:"json",
           success: function(colleges)
           {
           		if(colleges.length >0)
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add College\",null,"+info+");return false;'>Add College</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >College Code</th></tr>";
					for (var i = 0; i < colleges.length; i++) 
					{
						var college = colleges[i];
						var editCollegeLink = "<li><a href='#' onClick='generateForm(\"Update College\","+JSON.stringify(college)+","+info+");return false;'>Edit</a></li>";
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class='dropdown-menu'>"+editCollegeLink+"<li><a href='#' onClick='deleteCollege(\""+college+"\","+info+");return false;'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+college+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add College\",null,"+info+");return false;'>Add College</button>";
           			$('#formDiv').html(table);
           			alertWarning("There are no colleges in the system. Add one using the add button ");
           		}
           }
         });
	}
	else if(tableName == "Training Types")
	{

		var info = JSON.stringify(["Training Types",data]);
		var url = "index.php"; 
    	$.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getTabContent&tabName=Training", 
           dataType:"json",
           success: function(colleges)
           {
           		if(colleges.length >0)
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Training Type\",null,"+info+");return false;'>Add Training Type</button>";
					
					table += "<br /><br /><table class='table table-striped'>";
					table += "<tr> <th >###</th><th >Training Type</th></tr>";
					for (var i = 0; i < colleges.length; i++) 
					{
						var college = colleges[i];
						var editCollegeLink = "<li><a href='#' onClick='generateForm(\"Update Training Type\","+JSON.stringify(college)+","+info+");return false;'>Edit</a></li>";
						table += "<tr><td> <div class=\"btn-group\"><button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">Options<span class=\"caret\"></span></button>";
						table += "<ul class='dropdown-menu'>"+editCollegeLink+"<li><a href='#' onClick='deleteTrainingType(\""+college+"\","+info+");return false;'>Delete</a></li></ul> </div> </td> ";
						table +="<td >"+college+"</td>";
						table += "</tr>";
					}
					table+= "</table>";
					$('#formDiv').html(table);
           		}
           		else 
           		{
           			var table = "<button class='btn btn-success btn-lg' onClick='generateForm(\"Add Training Type\",null,"+info+");return false;'>Add College</button>";
           			$('#formDiv').html(table);
           			alertWarning("There are no colleges in the system. Add one using the add button ");
           		}
           }
         });
	}
	else if(tableName == "Control Panel")
	{
		var info = JSON.stringify(["Training Types",data]);
		var table = "<table class='table table-striped'>";
		table += "<tr> <th >###</th><th >Status</th></tr>";
		table += "<tr> <td ><div><button class='btn btn-primary btn-lg' onClick='controlOp(\"Announce\",\"announceStatus\",\"Started instances are completely announced\",\"Some instances require completion of announcement\");'>Announce All started Instances</button></div></td><td style='width=70%;' id='announceStatus'> Checking...</td> </tr>";
		table += "<tr> <td ><div><button class='btn btn-primary btn-lg' onClick='controlOp(\"dexp\",\"deleteStatus\",\"Files Deleted Successfully\",\"Couldnt Delete Files\");'>Delete Old Exported files</button></div></td><td style='width=70%;' id='deleteStatus'> </td> </tr>";
		table+= "</table>";
		$('#formDiv').html(table);
		controlOp("checkUnAnnounced","announceStatus","Started instances are completely announced","Some instances require completion of announcement");


	}
}

function controlOp(op, statusId, msgSuccess, msgFailure)
{
	console.log(op);
	var url = "index.php"; 
    	$.ajax
    	({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=controlOp&op="+op, 
           dataType:"json",
           success: function(status)
           {
           		if(status == true)
           		{
           			var msg ="<h4 class='text-success'>"+msgSuccess+"</h4>";
           			$("#"+statusId).html(msg);
           		}
           		else 
           		{
           			var msg = "<h4 class='text-danger'>"+msgFailure+"</h4>";
           			$("#"+statusId).html(msg);
           		}
           }
       });
    	return true;
}
function generateProfile(profileName,data,previousViewInfo)
{
	
	$("#tabName").text(profileName+"");
	var info = JSON.stringify(["Student Profile",data,previousViewInfo]);

	if(profileName == "Student Profile")
	{
		console.log("id is : "+this.id);
		var url = "index.php"; 
    	$.ajax
    	({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=getStudentProfile&studentId="+data, 
           dataType:"json",
           success: function(student)
           {
           		console.log("the student is : "+student);
           		
           		var profile="";
				profile += "<div id=\"profile\">";
				profile += "<div class=\"panelHolder\">";
				profile += " <div class=\"panel panel-default\">";
				profile += "<div class=\"panel-heading\">";
				profile += "<h3 class=\"panel-title\">Students Information</h3>";
				profile += "</div>";
				profile += "<div class=\"panel-body\">";
				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">ID: </h5><span id=\"studentId\">"+student[0][0]+"</span>";
				profile += "</div>  ";

				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">Name: </h5><span id=\"name\">"+student[0][2]+", "+student[0][1]+"</span>";
				profile += "</div>  ";

				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">Email: </h5><span id=\"email\">"+student[0][3]+"</span>";
				profile += "</div>  ";

				

				profile += "</div>";
				profile += "</div>  ";
				profile += " </div> ";
				profile += " <div class=\"panelHolder\">";
				profile += "<div class=\"panel panel-default\">";
				profile += "<div class=\"panel-heading\">";
				profile += "<h3 class=\"panel-title\">Advisor Information</h3>";
				profile += "</div>";
				profile += "<div class=\"panel-body\">";
				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">Supervisor Name: </h5><span id=\"supervisor_name\">"+student[0][4]+"</span>";
				profile += "</div>  ";

				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">Supervisor Email: </h5><span id=\"supervisor_email\">"+student[0][5]+"</span>";
				profile += "</div>  ";

				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">Company Name: </h5><span id=\"company_name\">"+student[0][6]+"</span>";
				profile += "</div>  ";

				profile += "<div class=\"\">";
				profile += "<h5 class=\"text-primary\">Company Location: </h5><span id=\"company_location\">"+student[0][7]+"</span>";
				profile += "</div>  ";


				profile += "</div>";
				profile += "</div> ";


				profile += " <div class=\"panelHolder\">";
				profile += "<div class=\"panel panel-default\">";
				profile += "<div class=\"panel-heading\">";
				profile += "<h3 class=\"panel-title\">Evaluations</h3>";
				profile += "</div>";
				profile += "<div class=\"panel-body\">";
				
			
				profile += "<div id='evalDiv' class=\"\"></div>";
				profile += "</div>";
				profile += "</div> ";
				profile += "<div class=\"\">";
				profile += "   <button type=\"button\" class=\"btn btn- btn-lg btn-block\" onClick='generateTable(\""+previousViewInfo[0]+"\","+previousViewInfo[1]+",\""+previousViewInfo[2]+"\","+"\"studentId="+student[0][0]+"\");'>Back</button>";
			
				profile += "</div> ";
				profile += " </div>";
				$('#formDiv').html(profile);

				var evaluations_html = "";
				var number_of_evaluations = student[1].length;
				getEvaluationsRecursive(student,evaluations_html,0,number_of_evaluations,info);
           }
       });

	}
}

function getEvaluationsRecursive(student,evaluations_html,k,number_of_evaluations,previousViewInfo)
{
	$.ajax({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=getStudentEvaluationData&evaluation_id="+student[1][k][0], 
					dataType: "json",
					success: function(data)
					{
							var values = data[0];
							var glob = data[1];
							var fields = data[2];
							var table = "<table class='table table-striped'><tr><th>Field </th><th>Evaluation</th> <th>Description</th> <th>Weight</th></tr>";
							var overall = 0;
							
							for (var i = 0; i < values.length; i++) // construct the header of the table 
							{
								var field = fields[i];
								if(field[1] == "rubric")
									{
										var index = parseInt(values[i]) +2;
										console.log(index);
										overall+=parseInt(glob[index-2][1]);
										table+= "<tr>"+	"<td>"+field[2]+"</td>"+	"<td>"+glob[index-2][0]+"</td>"+ "<td>"+field[index]+"</td>"+"<td>"+glob[index-2][1]+"</td>"+"</tr>";
									}
								else table+= "<tr>"+	"<td>"+field[2]+"</td>"+	"<td colspan='3'>"+values[i]+"</td>"+"</tr>";
							}

							table+= "<tr class='info'>"+	"<th>Overall</th><td></td><td></td>"+	"<td>"+overall+"</td></tr>";
							table+= "<tr><td><a href='#' onClick='deleteEvaluation(" +student[1][k][0]+","+previousViewInfo+");'>Delete Evaluation</a></td><td></td><td></td><td></td></tr>";
							table += "</table>";
							evaluations_html+=table;
							k = k+1;
							if(k == number_of_evaluations)
							{
								$('#evalDiv').html(evaluations_html);
							}
							else getEvaluationsRecursive(student,evaluations_html,k,number_of_evaluations,previousViewInfo);
					}
				});
}


function generateBar(buttonName,buttonOnClick,searchText,searchInputName,validationClasses)
{
	var bar="";
	bar += "<nav class=\"navbar navbar-default\" role=\"navigation\">";
	bar += "  <div class=\"container-fluid\">";
	bar += "    <!-- Brand and toggle get grouped for better mobile display -->";
	bar += "    <div class=\"navbar-header\">";
	bar += "      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\">";
	bar += "        <span class=\"sr-only\">Toggle navigation<\/span>";
	bar += "        <span class=\"icon-bar\"><\/span>";
	bar += "        <span class=\"icon-bar\"><\/span>";
	bar += "        <span class=\"icon-bar\"><\/span>";
	bar += "      <\/button>";
	bar += "      <a class=\"navbar-brand disabled\" href=\"#\">Actions<\/a>";
	bar += "    <\/div>";
	bar += "    <!-- Collect the nav links, forms, and other content for toggling -->";
	bar += "    <div class=\"collapse navbar-collapse\" id=\"bs-example-navbar-collapse-1\">";
	bar += "      <ul class=\"nav navbar-nav\">";
	bar += "        <li class=\"\"><a href=\"#\" onClick='"+buttonOnClick+"'>"+buttonName+"<\/a><\/li>";
	bar += "      <\/ul>";
	bar += "      <form class=\"navbar-form navbar-left\" role=\"search\" action=\"index.php\" id=\"searchForm\">";
	bar += "        <div class=\"form-group\">";
	bar += "          <input type=\"text\" name='"+searchInputName+"' class=\"form-control "+validationClasses+"\" placeholder=\""+searchText+"\">";
	bar += "        <\/div>";
	bar += "        <button type=\"submit\" class=\"btn btn-small btn-primary\">Search<\/button>";
	bar += "      <\/form>";
	bar += "      <ul class=\"nav navbar-nav navbar-right\">";
	bar += "      <\/ul>";
	bar += "    <\/div><!-- \/.navbar-collapse -->";
	bar += "  <\/div><!-- \/.container-fluid -->";
	bar += "<\/nav>";

return bar;


}


function exportData(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#exportDataForm').serialize() + "&grp=Ajax&cmd=exportData", 
		dataType: "json",
		success: function(msg)
		{ 
			var data = "<div class=\"alert alert-success\">Exported data can be downloaded from this link : " + msg + " </div>";
			data += "<div class=\"alert alert-warning\">The file will be deleted after 24 hours. </div>";
			$("#downloadDiv").html(data);
		}
		
		});
	return false;
}




function updateTrainingType(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#trainingUpdateForm').serialize() + "&grp=Ajax&cmd=updateTrainingType", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("Training type information updated successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Training Types","","");
				}
			}
			else 
			{
				alertWarning("Couldn't update training type information : " + msg);
			}

		}
		
		});
	return false;
}

function addTrainingType(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#trainingAddForm').serialize() + "&grp=Ajax&cmd=addTrainingType", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("training type information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Training Types","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add training type information : "+msg);
				
			}

		}
		
		});
	return false;
}

function deleteTrainingType(type,previousViewInfo)
{


	bootbox.confirm("Are you sure you want to delete this training type?", 
		function(result) 
		{
  			if(result == true)
  			{
  				console.log(" id is : " + type);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteTrainingType&training="+type, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("training type deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("Training Types","","");
							}
						}
						else
						{
							alertWarning("Deletion was unsuccessful : "+msg);
						}
					}
		
				});
  			}
  		
	}); 
}












function updateCollege(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#collegeUpdateForm').serialize() + "&grp=Ajax&cmd=updateCollege", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("college information updated successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Colleges","","");
				}
			}
			else 
			{
				alertWarning("Couldn't update college information : " + msg);
			}

		}
		
		});
	return false;
}

function addCollege(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#collegeAddForm').serialize() + "&grp=Ajax&cmd=addCollege", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("college information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Colleges","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add college information : The college already exists");
			
			}

		}
		
		});
	return false;
}

function deleteCollege(college_code,previousViewInfo)
{


	bootbox.confirm("Are you sure you want to delete this college?", 
		function(result) 
		{
  			if(result == true)
  			{
  				console.log(" id is : " + college_code);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteCollege&college="+college_code, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("college deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("College","","");
							}
						}
						else
						{
							alertWarning("Deletion was unsuccessful : "+msg);
						}
					}
		
				});
  			}
  		
	}); 
}

function updateDepartment(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#departmentUpdateForm').serialize() + "&grp=Ajax&cmd=updateDepartment", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("department information updated successfully ");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Departments","","");
				}
			}
			else 
			{
				alertWarning("Couldn't update department information : " + msg);
			}

		}
		
		});
	return false;
}

function addDepartment(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#departmentAddForm').serialize() + "&grp=Ajax&cmd=addDepartment", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("Department information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Departments","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add department information : "+msg);
				
			}

		}
		
		});
	return false;
}

function deleteDepartment(dept_code,previousViewInfo)
{


	bootbox.confirm("Are you sure you want to delete this department?", 
		function(result) 
		{
  			if(result == true)
  			{
  				console.log("department id is : " + dept_code);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteDepartment&dept_code="+dept_code, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("department deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("Departments","","");
							}
						}
						else
						{
							alertWarning("Deletion was unsuccessful : "+msg);
						}
					}
		
				});
  			}
  		
	}); 
}



function updateMajor(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#majorUpdateForm').serialize() + "&grp=Ajax&cmd=updateMajor", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("major information updated successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Majors","","");
				}
			}
			else 
			{
				alertWarning("Couldn't update major information : " + msg);
			}

		}
		
		});
	return false;
}

function addMajor(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#majorAddForm').serialize() + "&grp=Ajax&cmd=addMajor", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("Major information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Majors","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add major information : "+msg);
				
			}

		}
		
		});
	return false;
}

function deleteMajor(major_code,previousViewInfo)
{


	bootbox.confirm("Are you sure you want to delete this major?", 
		function(result) 
		{
  			if(result == true)
  			{
  				console.log("major id is : " + major_code);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteMajor&major_code="+major_code, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("major deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("Majors","","");
							}
						}
						else
						{
							alertWarning("Deletion was unsuccessful : "+msg);
						}
					}
		
				});
  			}
  		
	}); 
}


function updateCourse(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#courseUpdateForm').serialize() + "&grp=Ajax&cmd=updateCourse", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("course information updated successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Courses","","");
				}
			}
			else 
			{
				alertWarning("Couldn't update course information : " + msg);
			}

		}
		
		});
	return false;
}

function addCourse(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#courseAddForm').serialize() + "&grp=Ajax&cmd=addCourse", 
		dataType: "json",
		success: function(data)
		{ 
			console.log(data);
			if(data==true)
			{
				alertWarning("course information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Courses","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add course information : "+data);
				
			}

		}
		
		});
	return false;
}

function deleteCourse(courseId,previousViewInfo)
{


	bootbox.confirm("Are you sure you want to delete this course?", 
		function(result) 
		{
  			if(result == true)
  			{
  				console.log("course id is : " + courseId);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteCourse&courseId="+courseId, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("course deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("Courses","","");
							}
						}
						else
						{
							alertWarning("Deletion was unsuccessful : "+msg);
						}
					}
		
				});
  			}
  		
	}); 
}





function deleteDomain(domainId,previousViewInfo)
{


	bootbox.confirm("Are you sure you want to delete this domain?", 
		function(result) 
		{
  			if(result == true)
  			{
  				console.log("domain id is : " + domainId);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteDomain&domainId="+domainId, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("Domain deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("Evaluation Instances","","");
							}
						}
						else
						{
							alertWarning("Deletion was unsuccessful : "+msg);
						}
					}
		
				});
  			}
  		
	}); 
}

function updateDomain(previousViewInfo)
{
		$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#domainUpdateForm').serialize() + "&grp=Ajax&cmd=updateDomain", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("domain information updated successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Evaluation Instances","","");
				}
			}
			else 
			{
				alertWarning("Couldn't update domain information : " + msg);
			}

		}
		
		});
	return false;
}

function addDomain(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#domainAddForm').serialize() + "&grp=Ajax&cmd=addDomain", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("domain information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Evaluation Instances","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add domain information : "+msg);
				
			}

		}
		
		});
	return false;
}


function deleteInstance(instanceId,previousViewInfo)
{
	bootbox.confirm("Are you sure you want to delete this instance?", function(result) {
  			if(result == true)
  			{
  			$.ajax({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=deleteInstance&instanceId="+instanceId, 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true) // deletion was sucessful
			{
				alertWarning("instance deleted successfully");
				if(previousViewInfo.length>0)
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Evaluation Instances","","");
				}
			}
			else
			{
				alertWarning("There are evaluations that use this instance ,therfore , therefore, it can't be deleted.");
			}
			
		}
		
		});
  		}
	}); 


	

	return false;
}

function addInstance(previousViewInfo)
{

	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#instanceAddForm').serialize() + "&grp=Ajax&cmd=addInstance", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				
				if(previousViewInfo.length>0)
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],null);
				}
				else
				{
					generateTable("Evaluation Instances","","");
				}
				alertWarning("evaluation instance added successfully");
			}
			else 
			{
				alertWarning("Couldn't add evaluation instance");
			}

		}
		
		});
	return false;

}

function updateInstance(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#instanceUpdateForm').serialize() + "&grp=Ajax&cmd=updateInstance", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("instance information updated successfully");
				if(previousViewInfo.length>0)
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Evaluation Instances","","");
				}
			
			}
			else 
			{
				alertWarning("Couldn't update instance information");
			}

		}
		
		});
	return false;
}

function addTemplate(previousViewInfo)
{
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#templateAddForm').serialize() + "&grp=Ajax&cmd=addTemplate", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("template information added successfully");
				if(previousViewInfo.length >0)
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Evalutation Templates","","");
				}
			}
			else 
			{
				alertWarning("Couldn't add template information");
			}

		}
		
		});
	return false;
}


function domainUpdateChangeCallBack(sel)
{

	var value = sel.options[sel.selectedIndex].value;

	if(value=="all")
	{

		var input = "";
		input += "<input type='hidden' class='form-control' id='all' name='all' value='1'>";
		$("#data_div").html(input);

	}
	else if(value=="college")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=colleges",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='college'>College</label>";
				input += "<select class='form-control' name='college' form=\"domainUpdateForm\">";
				input += "<option value=\"-1\">Select College<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i]+"\">"+list[i]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="department")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=departments",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='department'>Department</label>";
				input += "<select class='form-control' name='department' form=\"domainUpdateForm\">";
				input += "<option value=\"-1\">Select Department<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i][0]+"\">"+list[i][0]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="major")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=majors",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='major'>Major</label>";
				input += "<select class='form-control' name='major' form=\"domainUpdateForm\">";
				input += "<option value=\"-1\">Select Major<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i][0]+"\">"+list[i][0]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="training")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=training_types",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='major'>Training Type</label>";
				input += "<select class='form-control' name='training' form=\"domainUpdateForm\">";
				input += "<option value=\"-1\">Select Training Type<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i]+"\">"+list[i]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else 
	{
		return "";
	}



}





function domainAddChangeCallBack(sel)
{
	var value = sel.options[sel.selectedIndex].value;

	if(value=="all")
	{

		var input = "";
		input += "<input type='hidden' class='form-control' id='all' name='all' value='1'>";
		$("#data_div").html(input);

	}
	else if(value=="college")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=colleges",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='college'>College</label>";
				input += "<select class='form-control' name='college' form=\"domainAddForm\">";
				input += "<option value=\"-1\">Select College<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i]+"\">"+list[i]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="department")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=departments",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='department'>Department</label>";
				input += "<select class='form-control' name='department' form=\"domainAddForm\">";
				input += "<option value=\"-1\">Select Department<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i][0]+"\">"+list[i][0]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="major")
	{
		$.ajax
		({
			type: "POST",
			url: "index.php", 
			data: "grp=Ajax&cmd=getList&type=majors",
			dataType:"json",
			success: function(list)
			{
				var input = "";
				input += "<label for='major'>Major</label>";
				input += "<select class='form-control' name='major' form=\"domainAddForm\">";
				input += "<option value=\"-1\">Select Major<\/option>";
				for (var i = 0; i < list.length; i++) {
					input += "<option value=\""+list[i][0]+"\">"+list[i][0]+"<\/option>";
				};
				input += "<\/select>";
				$("#data_div").html(input);

			}
		});
	}
	else if(value=="training")
	{
		
	}
	else 
	{
		return "";
	}



}






function deleteTemplate(templateId,previousViewInfo)
{
	bootbox.confirm("Are you sure you want to delete this template?", 
		function(result) 
		{
  			if(result == true)
  			{
				console.log("template id is : " + templateId);
				$.ajax
				({
					type: "POST",
					url: "index.php", 
					data: "grp=Ajax&cmd=deleteTemplate&templateId="+templateId, 
					dataType: "json",
					success: function(msg)
					{ 
						if(msg==true) // deletion was sucessful
						{

							alertWarning("Template deleted successfully");
							if (previousViewInfo.length >0) 
							{
								generateTable(previousViewInfo[0],previousViewInfo[1],"");
							}
							else 
							{
								generateTable("Evaluation Templates","","");
							}
						}
						else
						{
							alertWarning("TTemplate deletion failed : The template is being used by evaluation instances");
						}
						
					}
					
				});
			}
			
		});
}




function updateTemplate(previousViewInfo,code)
{
	console.log("row : " + rowCount + "colm : " + colCount);
	var hiddenValues = "<input type='hidden' name='rowCount' value='"+rowCount+"'><input type='hidden' name='colCount' value='"+colCount+"' required>";
	$("#templateUpdateForm").append(hiddenValues);
	console.log($('#templateUpdateForm').serialize());
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#templateUpdateForm').serialize() + "&grp=Ajax&cmd=updateTemplate&code="+code, 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg == true)
			{
				alertWarning("Template updated successfully");
				if (previousViewInfo.length >0) 
			{
				generateTable(previousViewInfo[0],previousViewInfo[1],"");
			}
			else 
			{
				generateTable("Evaluation Templates","","");
			}
			}
			else 
			{
				alertWarning("Template information wasn't updated : " + msg);
			}
			
			
		}
		
		});
	return false;
}






function generateRubricFormUpdate(data,previousViewInfo,code)
{
	var id = data[0];
	var name = data[1];
	var global = data[2];
	var fields = data[3];

	var form="";

	rowCount = fields.length;
	colCount = global.length; 
	console.log("field count is : " + rowCount);
	form += "<form role='form' action='index.php' id='templateUpdateForm'>";
	
	form += "<input type='hidden' name='id' value='"+id+"'>";
	
	form += "<div class='form-group'>";
	form += "<label for='name'>Template Name: </label>";
	form += " <input type='text' class='form-control span12' id='name' name='name' value='"+name+"' required>";
	form += "</div>";

	form += "<table class='table table-striped' id='templateUpdateTable'>";

	
	form += "<tbody id='tableBody'>";
	form += "<tr>" +" <th>Global Value<br /><br />Weight</th>" ;

	for (var i = 0; i < colCount; i++) {
		form+="<th>";
		form += " <input type='text' class='form-control' id='gf"+i+"' name='gf"+i+"' value='"+global[i][0]+"' required>";
		form += " <input type='text' class='form-control number' id='gfnv"+i+"' name='gfnv"+i+"' value='"+global[i][1]+"' required>";
		form+="</th>";
	};
	form += "</tr>";
	form += "<tr><th> Field Name </th> <th colspan='"+colCount+"'>Global Value Description</th>  </tr>";

	for (var i = 0; i < rowCount; i++) 
	{
		var row = "<tr>";
		row += "<input type='hidden' name='eftype"+i+"' value='"+fields[i][1]+"'>";
		row += "<td><textarea style='resize:none;' class='form-control' id='efname"+i+"' name='efname"+i+"' text='"+fields[i][2]+"' required>"+fields[i][2]+"</textarea></td>";

		if(fields[i][1]=="textual")
		{
		
		}
		else if(fields[i][1] == "rubric")
		{
			for (var j = 3; j < fields[i].length; j++) {
				
				row += "<td> <textarea style='resize:none;' class='form-control' id='ef"+i+"val"+(j-3)+"' name='ef"+i+"val"+(j-3)+"' required>"+fields[i][j]+"</textarea></td>";
				
			};
			
		}
		row += "</tr>";
		form += row;

	};

	form+= "</tbody>";
	
	form += "</table>";
	if(code == "modify")form += "<div class='form-group'><button type='button' class='btn btn-primary' onClick='addField(\"rubric\");'>Add Choice Field</button> <button type='button' class='btn btn-primary' onClick='addField(\"textual\");'>Add Textual Field</button><br><br> ";
	form += "<button type='button' class='btn btn-warning btn-lg' onClick='generateTable(\"Evaluation Templates\");'>Cancel</button> <button type='submit' class='btn btn-success btn-lg'>Submit</button></div>";
	form += "</form>";
	form += "</div>";

	console.log(form);
	$('#formDiv').html(form);
	$('#templateUpdateForm').validate({ 
        	submitHandler: function (form) { 
           		updateTemplate(previousViewInfo,code);
				return false;
     		}
		});
}








function generateRubricAddForm(data,previousViewInfo)
{
	rowCount = 0;
	colCount = $("#cols").val();
	if(colCount <2 || colCount>10) 
	{
		alertWarning("number of columns has to be more than or equal to 2 and less than or equal to 10.");
		return;
	}
	console.log("in generate rubric Add form ");
	var form="<br /> <br/> ";
	form += "<form role='form' action='index.php' id='templateAddForm'>";
	form += "<div class='form-group'>";
	form += "<label for='name'>Template Name: </label>";
	form += " <input type='text' class='form-control span12' id='name' name='name' required >";
	form += "</div>";
	form += "<table class='table table-striped' id='templateAddTable'>";



	form += "<tbody id='tableBody'>";
	form += "<tr>" +" <th class='text-center'>Global Value<br /><br />Weight</th>" ;
	//form += "<tr><th></th>";
	for (var i = 0; i < colCount; i++) {
		form+="<th>";
		form += " <input type='text' class='form-control' id='gf"+i+"' name='gf"+i+"' required>";
		form += " <input type='text' class='form-control number' id='gfnv"+i+"' name='gfnv"+i+"' required>";
		form+="</th>";
	};
	form += "</tr>";
	form += "<tr><th class='text-center'> Field Name </th> <th colspan='"+colCount+"' class='text-center'>Global Value Description</th>  </tr>";

	form+= "</tbody>";
	


	form +="</table>";
	form += "<div class='form-group'><button type='button' class='btn btn-primary btn-lg' onClick='addField(\"rubric\");'>Add Choice Field</button> <button type='button' class='btn btn-primary btn-lg' onClick='addField(\"textual\");'>Add Textual Field</button> <br /> <br /><button type='button' class='btn btn-warning btn-lg' onClick='generateTable(\"Evaluation Templates\");'>Cancel</button>  <button type='submit' class='btn btn-success btn-lg'>Submit</button></div>";
	form += "</form>";
	console.log(form);
	$('#rubricDiv').html(form);
	$('#templateAddForm').validate({ 
        	submitHandler: function (form) { 
           		addTemplate(previousViewInfo);
				return false;
     		}
		});
	
		
}


function generateRubricInfoCollector(data,previousViewInfo)
{

	
	var basedOn = $("#template").val();
	colCount = $("#cols").val();
	if(colCount <2 || colCount>10) 
	{
		alertWarning("number of columns has to be more than or equal to 2 and less than or equal to 10.");
		return;
	}
	if(basedOn == "new")
	{
		generateRubricAddForm(data,previousViewInfo);
	}
	else 
	{
		generateRubricFormBasedOnTemplate(basedOn,colCount,data,previousViewInfo);
	}
}

function generateRubricFormBasedOnTemplate(tid,cols,data,previousViewInfo)
{
	//getTemplateByID
	console.log("rubric based " + tid);
	$.ajax({
		type: "POST",
		url: "index.php", 
		data:"&grp=Ajax&cmd=getTemplateByID&templateId="+tid, 
		dataType: "json",
		success: function(temp)
		{ 
			console.log("rubric based successfully " + template);

			var id = temp[0];
			var name = temp[1];
			var global = temp[2];
			var fields = temp[3];
			console.log( id + " " + name );
			var form="<br/> <br/>";
			rowCount = fields.length;
			colCount = cols; 

			form += "<form role='form' action='index.php' id='templateAddForm'>";
			
			
			form += "<div class='form-group'>";
			form += "<label for='name'>Template Name: </label>";
			form += " <input type='text' class='form-control span12' id='name' name='name' value='Based on - "+name+"' required>";
			form += "</div>";

			form += "<table class='table table-striped' id='templateAddTable'>";

			
			form += "<tbody id='tableBody'>";
			form += "<tr>" +" <th>Global Value<br /><br />Weight</th>" ;

			for (var i = 0; i < colCount; i++) {
				var fname  = "";
				var fwieght = "";

				if(global[i] != undefined) {fname = global[i][0] ; fwieght = global[i][1];}
				else 
				{
					fname = ""; 
					fwieght = "";
				}
				form+="<th>";
				form += " <input type='text' class='form-control' id='gf"+i+"' name='gf"+i+"' value='"+fname+"' required>";
				form += " <input type='text' class='form-control number' id='gfnv"+i+"' name='gfnv"+i+"' value='"+fwieght+"' required>";
				form+="</th>";
			};
			form += "</tr>";
			form += "<tr><th> Field Name </th> <th colspan='"+colCount+"'>Global Value Description</th>  </tr>";

			for (var i = 0; i < rowCount; i++) 
			{
				var row = "<tr>";
				row += "<input type='hidden' name='eftype"+i+"' value='"+fields[i][1]+"'>";
				row += "<td><textarea style='resize:none;' class='form-control' id='efname"+i+"' name='efname"+i+"' text='"+fields[i][2]+"' required>"+fields[i][2]+"</textarea></td>";

				if(fields[i][1]=="textual")
				{
				
				}
				else if(fields[i][1] == "rubric")
				{
					for (var j = 0; j < colCount; j++) {
						var fieldVal = "";
						if(fields[i][j+3] != undefined){fieldVal = fields[i][j+3];}
						else {fieldVal = "";}
						row += "<td> <textarea style='resize:none;' class='form-control' id='ef"+i+"val"+(j)+"' name='ef"+i+"val"+(j)+"' required>"+fieldVal+"</textarea></td>";
						
					};
					
				}
				row += "</tr>";
				form += row;

			};

			form+= "</tbody>";
			
			form += "</table>";
			form += "<div class='form-group'><button type='button' class='btn btn-primary' onClick='addField(\"rubric\");'>Add Choice Field</button> <button type='button' class='btn btn-primary' onClick='addField(\"textual\");'>Add Textual Field</button><br><br> <button type='button' class='btn btn-warning btn-lg' onClick='generateTable(\"Evaluation Templates\");'>Cancel</button> <button type='submit' class='btn btn-success btn-lg'>Submit</button></div>";
			form += "</form>";
			form += "</div>";

			console.log(form);
			$('#rubricDiv').html(form);
			$('#templateAddForm').validate({ 
		        	submitHandler: function (form) { 
		           		addTemplate(previousViewInfo);
						return false;
		     		}
				});
		}
	});

}


function removeField(number)
{
	$("#ef"+number).remove();
}
function addField(type)
{
	//row"+rowCount+"col"+i+"
	// efname , efXvalY
	// gfX, gfnvX
	var row = "";
	row += "<tr>";
	
	row += "<input type='hidden' name='eftype"+rowCount+"' value='"+type+"' required>";
	
	row +="<td>";
	row += "<textarea style='resize:none;' class='form-control' id='efname"+rowCount+"' name='efname"+rowCount+"' placeholder='Name' required></textarea>";
	row += "</td>";

	if(type=="textual")
	{
	
	}
	else if(type == "rubric")
	{
		for (var i = 0; i < colCount; i++) {
			row +="<td>";
			row += " <textarea style='resize:none;' class='form-control' id='ef"+rowCount+"val"+i+"' name='ef"+rowCount+"val"+i+"' placeholder='Description for value "+i+"' required></textarea>";
			row += "</td>";
		};
		row += "  </div>";
	}
	rowCount++;
	
	row += "</tr>";

	console.log("rowCount form add field is : " + rowCount);
	$("#tableBody").append(row);
}

function addTemplate(previousViewInfo)
{	
	var hidden = "<input type='hidden' name='rowCount' value='"+rowCount+"'><input type='hidden' name='colCount' value='"+colCount+"' required>";
	$("#templateAddForm").append(hidden);

	$.ajax({
		type: "POST",
		url: "index.php", 
		data: $('#templateAddForm').serialize() + "&grp=Ajax&cmd=addTemplate", 
		dataType: "json",
		success: function(msg)
		{ 
			if(msg==true)
			{
				alertWarning("template information added successfully");
				if (previousViewInfo.length >0) 
				{
					generateTable(previousViewInfo[0],previousViewInfo[1],"");
				}
				else 
				{
					generateTable("Evaluation Templates","","");
				}
				
			}
			else 
			{
				alertWarning("Couldn't add template information : "+msg);
				
			}

		}
		
		});
}

// download the file using ajax 

function downloadURL(url) {
    var hiddenIFrameID = 'hiddenDownloader',
        iframe = document.getElementById(hiddenIFrameID);
    if (iframe === null) {
        iframe = document.createElement('iframe');
        iframe.id = hiddenIFrameID;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
    }
    iframe.src = url;
};
