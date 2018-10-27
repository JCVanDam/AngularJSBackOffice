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

if (isset($_POST['log_id']) && !empty($_POST['log_id']) && isset($_POST['rating']) && !empty($_POST['rating']))
{
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');

    $req = $dbh->prepare("UPDATE calls SET rating = :rating WHERE id = :id");
    $req->bindValue(':id', $_POST['log_id']);
    $req->bindValue(':rating', $_POST['rating']);
	$ret = ($req->execute()) ? TRUE : FALSE;
}

echo json_encode($ret);
?>