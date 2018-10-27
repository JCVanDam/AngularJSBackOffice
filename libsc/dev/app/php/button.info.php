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

if (isset($_POST['bid']) && !empty($_POST['bid']))
{
	$bid = $_POST['bid'];
	$dbh = new PDO('mysql:host=127.0.0.1;dbname=snapcall', 'dev', '/R=r8/p\\');
	
	$req = $dbh->prepare("SELECT * FROM buttons WHERE bid_id = :bid_id");
	$req->bindValue('bid_id', $bid);
	if ($req->execute())
	{
		if (($res = $req->fetch(PDO::FETCH_ASSOC)))
		{
			// Metas
			$ret = new stdClass();
			$ret->meta = new stdClass();
			$ret->meta->sip = $res['sip_id'];
			$ret->meta->queue = str_pad($res['queue_id'], 3, '0', STR_PAD_LEFT);

			// Styles
			$ret->css = new stdClass();
			$ret->css->button = new stdClass();
			$ret->css->callbar = new stdClass();
			$ret->css->button->background = $res['clr_btn_bg'];
			$ret->css->button->color = $res['clr_btn_fg'];
			$ret->css->callbar->background = $res['clr_off'];
			$ret->css->callbar->backgroundActive = $res['clr_on'];

			// Dialogs
			$ret->dialog = new stdClass();
			$ret->dialog->message = new stdClass();
			$ret->dialog->message->service = $res['brand'];
			$ret->dialog->message->invite = $res['msg_off'];
			$ret->dialog->message->closed = $res['msg_close'];
			$ret->dialog->message->rating = $res['msg_rate'];
		}
	}

	$dbh = NULL;
}

echo json_encode($ret);
?>
