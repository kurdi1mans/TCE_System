window.onload = init;

var time_string = "";

function init()
{
    $("#Login").click(loginuser);
}

function loginuser()
{
    getTime();
}

function getTime()
{
    $.ajax
    (
        "index.php",
        {
            type: "POST",
            processData: true,
            data: "grp=Ajax&cmd=getServerTime",
            dataType: "json",
            success: function(json)
            {
                time_string = json;
                login();
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                bootbox.alert("Error: " + jqXHR.responseText);
                bootbox.alert("Error: " + textStatus);
                bootbox.alert("Error: " + errorThrown);
            }
        }
    );

    
}
function login()
{
    $.ajax
    (
        "index.php",
        {
            type: "POST",
            processData: true,
            data: "grp=Login&cmd=login&username="+getusername()+"&hashed_password="+getHashedPassword(),
            dataType: "json",
            success: function(json)
            {
                processResponse(json);
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                bootbox.alert("Error: " + jqXHR.responseText);
                bootbox.alert("Error: " + textStatus);
               bootbox.alert("Error: " + errorThrown);
            }
        }
    );
}

function getusername()
{
    return $("#username").val();
}
function getHashedPassword()
{
    var hashed_password = CryptoJS.MD5($("#password").val());
    var hashed_password_stamped = CryptoJS.MD5(hashed_password+time_string);
    return hashed_password_stamped;
}

function processResponse(respo)
{
    if(respo == true)
    {
        location.href = 'userpage.php';
    }
    else
    {
        bootbox.alert("the username or password you entered is incorrect");
        $("#resetDiv").html("<button id=\"Reset\" class=\"btn btn-lg btn-primary btn-block\" type=\"button\">Reset Password</button>");
        $("#Reset").click(resetPassword);
    }
}

function resetPassword()
{
    $.ajax
    (
        "index.php",
        {
            type: "POST",
            processData: true,
            data: "grp=Ajax&cmd=resetForgottenPassword&username="+getusername(),
            dataType: "json",
            success: function(json)
            {
                if(json == true) bootbox.alert("Password reset has been requested. Check your email for the new password or try reset again if you don't receive the email");
                else bootbox.alert("Password reset was not successful .. please contact the system admin");
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                
                bootbox.alert("Error: " + jqXHR.responseText);
                bootbox.alert("Error: " + textStatus);
                bootbox.alert("Error: " + errorThrown);
            }
        }
    );
}