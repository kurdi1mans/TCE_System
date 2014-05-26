<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="shortcut icon" href="../../assets/ico/favicon.ico">

    <title>Trainees' Evaluation System</title>

    <!-- Bootstrap core CSS -->
    <link href="bootstrap.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="dashboard.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy this line! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <link href="styles.css" rel="stylesheet">
  </head>

  <body>

    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">Trainees' Evaluation System</a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="loginpage.php">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="container-fluid">
      <div class="row">
        <div id="tabsDiv" class="col-sm-3 col-md-2 sidebar">
         
        </div>

        <div id="actionBar" class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">

          <div class="row placeholders">
            <div class="col-xs-6 col-sm-3 placeholder">
               
            </div>
            <div class="col-xs-6 col-sm-3 placeholder ">

            </div>
          </div>

          <h2 id="tabName" class="sub-header"></h2>
          <div id="formDiv" class="table-responsive">
            <table class="table table-striped">
            </table>
          </div>
        </div>
      </div>
    </div>
     <div id="notify" class="jumbotron flyover flyover-top alert alert-warning"></div>
    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
   
    <script id="userscript" type="text/javascript"></script>
    <script src="jquery.min.js"></script>
     <link href="jqui/css/ui-lightness/jquery-ui-1.10.4.custom.css" rel="stylesheet">
    <script src="jqui/js/jquery-1.10.2.js"></script>
    <script src="jqui/js/jquery-ui-1.10.4.custom.js"></script>
    <script src="bootstrap.min.js"></script>
    <script src="docs.min.js"></script>
    <script src="bootbox.min.js"></script>
    <script type="text/javascript" src="request.js"></script>
    <script type="text/javascript" src="common_ui.js"></script>
    <script type="text/javascript" src="pass_change_functions.js"></script>
    <script type="text/javascript" src="evaluation_functions.js"></script>
    <script type="text/javascript" src="student_functions.js"></script>
    <script type="text/javascript" src="md5.js"></script>
    <script type="text/javascript" src="jquery.validate.min.js"></script>
    <script type="text/javascript" src="additional-methods.min.js"></script>
   

  </body>
</html>
