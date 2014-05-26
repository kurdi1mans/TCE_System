
function changeUserPassword()
{
	getTime();
	var url = "index.php"; 
    $.ajax({
           type: "POST",
           url: url,
           data: "grp=Ajax&cmd=changeUserPassword&username="+ $('#username').val() + "&original_password="+getHashedPassword("original_password")+"&new_password="+getNewHashedPassword("new_password")+"", // serializes the form's elements.
           dataType: "json",
           success: function(data)
           {
               if(data ==true)
               {
                alertWarning("Password changed successfully");
                
                  
               }
               else 
               {
                  alertWarning("Couldn't change password : the password you entered is incorrect");
               }
           }
         });

    return false;
}

function getTime()
{
    var currentdate = new Date();
    currentdate+="";
    var time_fields = currentdate.split(' ');
    time_fields.splice(0, 1);
    time_fields.splice(4, 4);
    var tmp = time_fields[0];
    time_fields[0] = time_fields[1];
    time_fields[1] = tmp;

    
    time_string = time_fields.join();
    time_string = time_string.substr(0,time_string.length-3);
    //alert(time_string);
}

function getHashedPassword(id)
{
    var hashed_password = CryptoJS.MD5($("#"+id).val());
    var hashed_password_stamped = CryptoJS.MD5(hashed_password+time_string);
    return hashed_password_stamped;
}

function getNewHashedPassword(id)
{
    var hashed_password = CryptoJS.MD5($("#"+id).val());
    return hashed_password;
}