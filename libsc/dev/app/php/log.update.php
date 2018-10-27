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

if (isset($_POST['log_id']) && !empty($_POST['log_id']) && isset($_POST['token']) && !empty($_POST['token']))
{
    $dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');
    $log_id = $_POST['log_id'];
    $token = $_POST['token'];

    $req = $dbh->prepare("SELECT * FROM calls WHERE id = :id");
    $req->bindValue(':id', $log_id);
    if ($req->execute())
    {
        $res = $req->fetch(PDO::FETCH_OBJ);
        if ($res->call_start != NULL)
        {
            $req = $dbh->prepare("INSERT INTO calls VALUES (0, :bid_id, :token, :ip, :location, :navigator, :language, :url, :url_title, :btn_display, :btn_click, :call_start, :call_end, :rating)");
            $req->bindValue(':bid_id', $res->bid_id);
            $req->bindValue(':token', $token);
            $req->bindValue(':ip', $res->ip);
            $req->bindValue(':location', $res->location);
            $req->bindValue(':navigator', $res->navigator);
            $req->bindValue(':language', $res->language);
            $req->bindValue(':url', $res->url);
            $req->bindValue(':url_title', $res->url_title);
            $req->bindValue(':btn_display', $res->btn_display);
            $req->bindValue(':btn_click', date('Y-m-d H:i:s'));
            $req->bindValue(':call_start', NULL);
            $req->bindValue(':call_end', NULL);
            $req->bindValue(':rating', 0);
            
            $ret = ($req->execute()) ? $dbh->lastInsertId() : -1;
        }
        else
        {
            $req = $dbh->prepare("UPDATE calls SET token = :token, btn_click = :btn_click WHERE id = :id");
            $req->bindValue(':id', $log_id);
            $req->bindValue(':token', $token);
            $req->bindValue(':btn_click', date('Y-m-d H:i:s'));
            
            $ret = ($req->execute()) ? $log_id : -1;
        }
    }
}

echo json_encode($ret);
?>