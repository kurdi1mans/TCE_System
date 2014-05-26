<?php
  require_once "Mail.php";
class Mailer
{
  public function sendEmail($to_address,$subject,$body)
  {
    //ini_set('max_execution_time', 0);
    $from = "TCE System <admin@mansour-kurdi.com>";
    $to = "<$to_address>";
     
    /*$host = "ssl://smtp.gmail.com";
    $port = "465";
    $username = "TCEsystem@gmail.com";
    $password = "ThisIsTCE";*/

    $host = "smtp.mansour-kurdi.com";
    $port = "25";
    $username = "admin@mansour-kurdi.com";
    $password = "*Mailer1";





     
    $headers = array ('From' => $from,'To' => $to,'Subject' => $subject);
    $smtp = Mail::factory('smtp',array ('host' => $host,'port' => $port,'auth' => true,'username' => $username,'password' => $password));
     
    $mail = $smtp->send($to, $headers, $body);
    
    //ini_set('max_execution_time', 30);
    if (PEAR::isError($mail))
    {
      //echo("<p>" . $mail->getMessage() . "</p>");
      return false;
    }
    else
    {
      return true;
    }
  }
}
?>