<?php
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
{
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET')
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    }
    exit;
}

$ret = NULL;

if (isset($_POST['bid_id']) && !empty($_POST['bid_id']))
{
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');
	
	$req = $dbh->prepare("SELECT clr_btn_bg, clr_btn_fg FROM buttons WHERE bid_id = :bid_id");
	$req->bindValue('bid_id', $_POST['bid_id']);
	if ($req->execute())
		$ret = $req->fetch(PDO::FETCH_ASSOC);
	$dbh = NULL;
}

echo json_encode($ret);
?>
