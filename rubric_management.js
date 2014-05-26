
var rowCount = 2;
var colCount=0;

function generateRubricAddForm(data,previousViewInfo)
{

	console.log("in generate rubric Add form ");
	var form="";
	form += "<div id='templateAddFormContainer' style='width:70%;'>";
	form += "<form role='form' action='index.php' id='templateAddForm'>";
	
	// global values input based on the number of columns
	form += "<div class='form-group'>";
	form += "<label for='col0'>Global Values: </label>";
	for (var i = 0; i < colCount; i++) {
		form += "<input type='text' class='form-control' id='col"+i+"' name='col"+i+"'>";
	};
	form += "  </div>";

	form+= "<div id='rowsDiv'>";
	form += "<div class='form-group'>";
	form += "<label for='row0col0'>Global Values: </label>";
	for (var i = 0; i < colCount; i++) {
		form += "<input type='text' class='form-control' id='row0col"+i+"' name='row0col"+i+"'>";
	};
	form += "  </div>";

	// row 2 
	form += "<div class='form-group'>";
	form += "<label for='row1col0'>Global Values: </label>";
	for (var i = 0; i < colCount; i++) {
		form += "<input type='text' class='form-control' id='row1col"+i+"' name='row1col"+i+"'>";
	};
	form += "  </div>";

	form += "</div>" ; 
	// global values inputs sequence 
	// div for inputing fields 
	// add row and submit buttons 



	form += "<button type='button' class='btn btn-primary' onClick='addRow();'>Add Row</button>  <button type='submit' class='btn btn-primary'>Submit</button>";
	form += "</form>";
	form += "</div>";
	console.log(form);
	$('#rubricDiv').html(form);
	var funct = function()
	{
		addTemplate(previousViewInfo);
		return false;
	}
	$('#templateAddForm').submit(funct);


	/*
		$('#rubricForm').submit(function()
		{
	        var data={}; // rubric table []
	        $('#rubricTable').find('tr').each(function(){
	            var id=$(this).attr('id');
	            var row={};
	            $(this).find('input,select,textarea').each(function(){
	                row[$(this).attr('name')]=$(this).val();
	            });
	            data[id]=row;
	        });
	        console.log(data);
	        // get textual data

    });*/
		
}


function generateRubricInfoCollector(data,previousViewInfo)
{
	console.log("in generate rubric collector");

		var table = "<label for='cols'>Columns<label><input class='form-control' type='number' name='cols' id='cols' min='2' max='10' >";
		table += "<button type='button' class='form-control' onClick='generateRubricAddForm("+data+","+previousViewInfo+");'></button>";
		table += "<div id='rubricDiv'><div>"
		/*var table = "<label for='cols'>Columns<label><input class='form-control' type='number' name='cols' id='cols' min='2' max='10' >";
		table += "<label for='rows'>Rows<label><input class='form-control' type='number' name='rows' id='rows' min='2' max='10' >";
		table += "<label for='text'>Number of Textual fields<label><input class='form-control' type='number' name='text' id='text' min='2' max='10' >";
		*/
		$('#formDiv').html(table);
}

function addRow()
{
	//row"+rowCount+"col"+i+"
	var row = "";
	row += "<div class='form-group'>";
	row += "<label for='row"+rowCount+"col0'>Global Values: </label>";
	for (var i = 0; i < colCount; i++) {
		row += "<input type='text' class='form-control' id='row"+rowCount+"col"+i+"' name='row"+rowCount+"col"+i+"'>";
	};
	row += "  </div>";
	rowCount++;

	$("#rowsDiv").append(row);
}