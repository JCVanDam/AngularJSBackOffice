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

if (isset($_GET['data']) && !empty($_GET['data']))
{
	$data = json_decode($_GET['data']);
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');
	
	$req = $dbh->prepare("SELECT browser FROM buttons WHERE bid_id = :bid_id");
	$req->bindValue(':bid_id', $data->bid_id);
	if ($req->execute())
	{
		$res = $req->fetch(PDO::FETCH_ASSOC);
		$ret = $res['browser'];
	}

	$dbh = NULL;
}

echo json_encode($ret);
?>