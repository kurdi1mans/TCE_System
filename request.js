$(document).ready(function(){ // request the user's tabs.
	
	$.ajax({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=getScriptName", 
		dataType: "json",
		success: function(name)
		{ 
			$('#userscript').prop('src', name);
		}
		
		});
			
	
});