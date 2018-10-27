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

if (isset($_POST['action']) && !empty($_POST['action']) && isset($_POST['sip_id']) && !empty($_POST['sip_id']))
{
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');
	
	switch ($action)
	{
		case 'check':
			$req = $dbh->prepare("SELECT channels_available, channels_busy FROM companies WHERE sip_id = :sip_id");
			$req->bindValue('sip_id', $_POST['sip_id']);
			if ($req->execute())
			{
				if (($res = $req->fetch(PDO::FETCH_OBJ)))
				{
					if ($res->channels_busy < $res->channels_available)
					{
						$req = $dbh->prepare("UPDATE channels SET channels_busy = :channels_busy WHERE sip_id = :sip_id");
						$req->bindValue(':channels_busy', $res->channels_busy + 1);
						$req->bindValue('sip_id', $_POST['sip_id']);
						if ($req->execute())
							$ret = TRUE;
					}
					else
						$ret = FALSE;
				}
			}
			break;

		case 'remove':

			break;
		
		default:
			
			break;
	}

	$dbh = NULL;
}

echo json_encode($ret);
?>
