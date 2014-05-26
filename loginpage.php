<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <link rel="stylesheet" type="text/css" href="loginpage.css" />
        <link rel="stylesheet" href="bootstrap.min.css">
        <script type="text/javascript" src="md5.js"></script>
        <script src="jquery.min.js"></script>
        <script src="bootstrap.min.js"></script>
        <script src="docs.min.js"></script>
        <script src="bootbox.min.js"></script>
        <script type="text/javascript" src="loginpage.js"></script>
        <link href="jqui/css/ui-lightness/jquery-ui-1.10.4.custom.css" rel="stylesheet">
        <script src="jqui/js/jquery-1.10.2.js"></script>
        <script src="jqui/js/jquery-ui-1.10.4.custom.js"></script>
        <script type="text/javascript" src="jquery.validate.min.js"></script>
              <!-- Latest compiled and minified CSS -->

    </head>
    
    <body>

        <!--
                    <div id='loginFormContainer' style='width:20%;'>
                        <form role='form' action='index.php' id='loginForm'>
                            
                             <div class='form-group'>
                                <label for='username'>Username</label>
                                <input type='text' class='form-control' id='username' name='username' >
                             </div>
                            
                             <div class='form-group'>
                                <label for='password'>Password</label>
                                <input type='password' class='form-control' id='password' name='password'>
                             </div>

                            <button type='button' id="Login" class='btn btn-default'>Login</button>
                        </form>
                    </div>
                -->
                   <div class="container">
                   
      <form class="form-signin" role="form" action="index.php" id="loginForm">
        <h2 class="form-signin-heading">Please sign in</h2>
        <input type="email" class="form-control" placeholder="Email address"  id="username" name="username" required autofocus><br />
        <input type="password" class="form-control" placeholder="Password" id='password' name='password' required>
       <!--  <label class="checkbox">
          <input type="checkbox" value="remember-me"> Remember me
        </label> -->
        <button id="Login" class="btn btn-lg btn-primary btn-block" type="button">Sign in</button>
        <br><div id="resetDiv"></div>
      </form>

    </div> <!-- /container -->
                    
    </body>
</html>