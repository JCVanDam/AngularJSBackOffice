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

    $bid_id = $_POST['bid_id'];
    $navigator = (isset($_POST['navigator']) && !empty($_POST['navigator'])) ? $_POST['navigator'] : NULL;
    $language = (isset($_POST['language']) && !empty($_POST['language'])) ? $_POST['language'] : NULL;
    $url = (isset($_POST['url']) && !empty($_POST['url'])) ? $_POST['url'] : NULL;
    $url_title = (isset($_POST['url_title']) && !empty($_POST['url_title'])) ? $_POST['url_title'] : NULL;

    $req = $dbh->prepare("INSERT INTO calls VALUES (0, :bid_id, NULL, NULL, NULL, :navigator, :language, :url, :url_title, :btn_display, NULL, NULL, NULL, 0)");
    $req->bindValue(':bid_id', $bid_id);
    $req->bindValue(':navigator', $navigator);
    $req->bindValue(':language', $language);
    $req->bindValue(':url', $url);
    $req->bindValue(':url_title', $url_title);
    $req->bindValue(':btn_display', date('Y-m-d H:i:s'));
	$ret = ($req->execute()) ? $dbh->lastInsertId() : -1;
}

echo json_encode($ret);
?>