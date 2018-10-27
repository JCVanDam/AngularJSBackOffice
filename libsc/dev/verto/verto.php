<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS')
{
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']) && $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] == 'GET')
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Headers: X-Requested-With, content-type, access-control-allow-origin, access-control-allow-methods, access-control-allow-headers');
    }
    exit;
}

date_default_timezone_set('Europe/Paris');

$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');

$ret = new stdClass();
$ret->token = mt_rand(100000000000000000,999999999999999999);

$req = $dbh->prepare("SELECT sip_id, queue_id FROM buttons WHERE bid_id = :bid_id");
$req->bindValue('bid_id', $_POST['bid_id']);
if ($req->execute())
{
	if (($res = $req->fetch(PDO::FETCH_OBJ)))
	{
		$ret->sip_id = $res->sip_id;
		$ret->queue_id = str_pad($res->queue_id, 3, '0', STR_PAD_LEFT);
	}
}

$req = $dbh->prepare("INSERT INTO calls VALUES (0, :bid_id, :token, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0)");
$req->bindValue(':bid_id', $_POST['bid_id']);
$req->bindValue(':token', $ret->token);
$req->execute();

echo json_encode($ret);

$dbh = NULL;

?>