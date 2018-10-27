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

if (isset($_POST['action']) && !empty($_POST['action']))
{
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');

	switch ($_POST['action'])
	{
		case 'create':
			$bid_id = ($_POST['bid_id']) ? $_POST['bid_id'] : NULL;
			$navigator = ($_POST['navigator']) ? $_POST['navigator'] : NULL;
			$language = ($_POST['language']) ? $_POST['language'] : NULL;
			$url = ($_POST['url']) ? $_POST['url'] : NULL;
			$url_title = ($_POST['url_title']) ? $_POST['url_title'] : NULL;

			$req = $dbh->prepare("INSERT INTO calls VALUES (0, :bid_id, :token, :ip, :location, :navigator, :language, :url, :url_title, :btn_display, :btn_click, :call_start, :call_end, :rating)");
			$req->bindValue(':bid_id', $bid_id);
			$req->bindValue(':token', NULL);
			$req->bindValue(':ip', NULL);
			$req->bindValue(':location', NULL);
			$req->bindValue(':navigator', $navigator);
			$req->bindValue(':language', $language);
			$req->bindValue(':url', $url);
			$req->bindValue(':url_title', $url_title);
			$req->bindValue(':btn_display', date('Y-m-d H:i:s'));
			$req->bindValue(':btn_click', NULL);
			$req->bindValue(':call_start', NULL);
			$req->bindValue(':call_end', NULL);
			$req->bindValue(':rating', 0);
			
			$ret = ($req->execute()) ? $dbh->lastInsertId() : -1;
			break;

		case 'locate':
			$log_id = ($_POST['log_id']) ? $_POST['log_id'] : NULL;
			$ip = ($_POST['ip']) ? $_POST['ip'] : NULL;
			$location = ($_POST['location']) ? $_POST['location'] : NULL;

			$req = $dbh->prepare("UPDATE calls SET ip = :ip, location = :location WHERE id=:id");
			$req->bindValue(':id', $log_id);
			$req->bindValue(':ip', $ip);
			$req->bindValue(':location', $location);
			$ret = ($req->execute()) ? TRUE : FALSE;

		case 'click':
			$log_id = ($_POST['log_id']) ? $_POST['log_id'] : NULL;

			$req = $dbh->prepare("UPDATE calls SET btn_click=:btn_click WHERE id=:id");
			$req->bindValue(':id', $log_id);
			$req->bindValue(':btn_click', date('Y-m-d H:i:s'));
			
			$ret = ($req->execute()) ? TRUE : FALSE;
			break;

		case 'start':
			$log_id = ($_POST['log_id']) ? $_POST['log_id'] : NULL;
			$token = ($_POST['token']) ? $_POST['token'] : NULL;

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
					$req->bindValue(':btn_display', date('Y-m-d H:i:s'));
					$req->bindValue(':btn_click', $res->btn_click);
					$req->bindValue(':call_start', NULL);
					$req->bindValue(':call_end', NULL);
					$req->bindValue(':rating', 0);
					
					$ret = ($req->execute()) ? $dbh->lastInsertId() : -1;
				}
				else
				{
					$req = $dbh->prepare("UPDATE calls SET token=:token WHERE id=:id");
					$req->bindValue(':id', $log_id);
					$req->bindValue(':token', $token);
					
					$ret = ($req->execute()) ? $log_id : -2;
				}
			}
			break;

		case 'stop':
			$log_id = ($_POST['log_id']) ? $_POST['log_id'] : NULL;

			$req = $dbh->prepare("UPDATE calls SET call_end=:call_end WHERE id=:id");
			$req->bindValue(':id', $log_id);
			$req->bindValue(':call_end', date('Y-m-d H:i:s'));
			
			$ret = ($req->execute()) ? TRUE : FALSE;
			break;

		case 'rate':
			$log_id = ($_POST['log_id']) ? $_POST['log_id'] : NULL;
			$rating = ($_POST['rating']) ? $_POST['rating'] : NULL;

			$req = $dbh->prepare("UPDATE calls SET rating=:rating WHERE id=:id");
			$req->bindValue(':id', $log_id);
			$req->bindValue(':rating', $rating);
			
			$ret = ($req->execute()) ? TRUE : FALSE;
			break;

		default:
			$ret = NULL;
			break;
	}
}

echo json_encode($ret);
?>