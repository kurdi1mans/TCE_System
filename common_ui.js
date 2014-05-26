

$(document).ready(function(){ // request the user's tabs.
	
	


	$.ajax({
		type: "POST",
		url: "index.php", 
		data: "grp=Ajax&cmd=getTabs", 
		dataType: "json",
		success: function(tabNames)
		{ 
			
			//console.log(tabsNames);
			//$('#tabsDiv').html(tabs);
			var tabs = "<ul class='nav nav-pills nav-stacked'>";
			for (var i = 0; i < tabNames.length; i++) 
			{
				tabs +="<li class=''><a id='"+tabNames[i].replace(" ","")+"' href='#' onClick='changeTabActivationStatus(this);getTabContent(\""+tabNames[i]+"\");'>"+tabNames[i]+"</a></li>";
			}
			tabs +="</ul>";
			$('#tabsDiv').html(tabs);

		}
		
		});
		
	
});


function changeTabActivationStatus(clickedTab)
{
	$('#tabsDiv .active').removeClass();
	$('#'+clickedTab.id).parent().addClass('active');
}


function alertPositive(msg,time)
{
	$('#notify').addClass("alert-positive");
	//alert(msg);
	var alertt="";
	//alertt += "<div class=\"alert alert-dismissable alert-success\">";
	//alertt += "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">×</button>";
	alertt += "  <strong>"+msg+"</strong>";
	//alertt += "</div>";

	$('#notify').html(alertt);
	//window.setTimeout(function() { $(".alert-dismissable").alert('close'); }, 10000);
	
	$('#notify').toggleClass("in");
	setTimeout(function(){$('#notify').toggleClass('in')},5000);

	/*$('#notify').toggleClass("in",true).delay(5000).queue(
		function(){

			$('#notify').toggleClass("in",false);
	});*/
	//window.setTimeout(function() { $(".alert").alert('close'); }, 10000);
}

function alertNegative(msg)
{
	
	//alert(msg);
	var alertt="";
	//alertt += "<div class=\"alert alert-dismissable alert-danger\">";
	//alertt += "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">×</button>";
	alertt += "<p><strong>"+msg+"</strong></p>";
	//alertt += "</div>";
	$('#notify').toggleClass("in");
	setTimeout(function(){$('#notify').toggleClass('in')},5000);

	//window.setTimeout(function() { $(".alert-dismissable").alert('close'); }, 10000);
}


function alertWarning(msg)
{
	
	//alert(msg);
	var alertt="";
	//alertt += "<div class=\"alert alert-dismissable alert-warning\">";
	//alertt += "  <button type=\"button\" class=\"close\" data-dismiss=\"alert\">×</button>";
	alertt += "  <p><strong>"+msg+"</strong></p>";
	//alertt += "</div>";

	$('#notify').html(alertt);
	$('#notify').toggleClass("in");
	setTimeout(function(){$('#notify').toggleClass('in')},5000);
	//window.setTimeout(function() { $(".alert-dismissable").alert('close'); }, 10000);
}