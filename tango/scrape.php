<?php
require("include/db.php");

#get config
$CONFIG = array();
$config_sql = "select * from config";
$cres = mysqli_query($db, $config_sql);
while($crow = mysqli_fetch_assoc($cres)){
	$CONFIG[$crow[name]] = $crow[value];
}

$login_url = "https://www.appannie.com/account/login/";
$login_postData = array(
		"username"=>$CONFIG['aa_login'],
		"password"=>$CONFIG['aa_password'],
		"remeber_user"=>''
	);

#login to AA
$cookie = "cookie.txt";
$ch = curl_init(); 
curl_setopt ($ch, CURLOPT_URL, $login_url); 
curl_setopt ($ch, CURLOPT_SSL_VERIFYPEER, FALSE); 
curl_setopt ($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.6) Gecko/20070725 Firefox/2.0.0.6"); 
curl_setopt ($ch, CURLOPT_TIMEOUT, 60); 
curl_setopt ($ch, CURLOPT_FOLLOWLOCATION, 0); 
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1); 
curl_setopt ($ch, CURLOPT_COOKIEJAR, $cookie); 
curl_setopt ($ch, CURLOPT_REFERER, "https://www.appannie.com/account/login/"); 

curl_setopt ($ch, CURLOPT_POSTFIELDS, http_build_query($login_postData)); 
curl_setopt ($ch, CURLOPT_POST, 1); 
$result = curl_exec ($ch); 

echo $result;  
curl_close($ch);



?>