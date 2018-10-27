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

date_default_timezone_set('Europe/Paris');

$ret = NULL;

if (isset($_POST['bid_id']) && !empty($_POST['bid_id']))
{
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');
	
	$req = $dbh->prepare("SELECT * FROM buttons WHERE bid_id = :bid_id");
	$req->bindValue('bid_id', $_POST['bid_id']);
	if ($req->execute())
	{
		if (($res = $req->fetch(PDO::FETCH_ASSOC)))
		{
			$h = explode(';', $res['display']);
			$h = explode('-', $h[date('N') - 1]);
			$n = date('H:i');
			$res['open'] = ($h[0] <= $n && $n <= $h[1]) ? true : false;
			unset($res['display']);
			
			if ($res['queue_id'] < 10)
				$res['queue_id'] = '00'.$res['queue_id'];
			else if ($res['queue_id'] >= 10 && $res['queue_id'] < 100)
				$res['queue_id'] = '0'.$res['queue_id'];

			$ret = $res;
		}
	}

	$dbh = NULL;
}

echo json_encode($ret);
?>
