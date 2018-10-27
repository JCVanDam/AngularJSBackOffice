<?php if (isset($_GET['bid']) && !empty($_GET['bid'])) { ?>

<!DOCTYPE html>
<html>
    <head>
        <!-- Meta tags -->
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <title>Snapcall - Click to speak</title>        
        <style>
        body
        {
            margin: 0;
            padding: 0;
            background: #363636;
            font-family: Arial, sans-serif;
        }

        #circle
        {
            position: fixed;
            z-index: 1;
            top: 120px;
            left: 50%;
            width: 220px;
            height: 220px;
            margin-left: -110px;
            border-radius: 999px;
            -webkit-border-radius: 999px;
            -moz-border-radius: 999px;
            -o-border-radius: 999px;
            background: white;
        }

        #box
        {
            position: fixed;
            z-index: 2;
            top: 230px;
            left: 50%;
            width: 480px;
            margin-left: -240px;
            border-radius: 5px;
            -webkit-border-radius: 5px;
            -moz-border-radius: 5px;
            -o-border-radius: 5px;
            background: white;
        }

        #box-title
        {
            width: 250px;
            margin: auto;
            padding: 120px 15px 40px 15px;
            font-size: 23px;
            text-align: center;
            border-bottom: 1px solid black;
        }

        #box-content
        {
            padding: 40px 15px;
            font-size: 14px;
            text-align: center;
            width: 340px;
            margin: auto;
        }
        </style>
    </head>
    <body>
        <div class="snapcall" btn-type="callbar" btn-bid="<?php echo $_GET['bid']; ?>" btn-name="hosted-custom"></div>
        <div id="circle"></div>
        <div id="box">
            <div id="box-title">
                TRANSFERT D'APPEL
            </div>
            <div id="box-content">
                Veuillez patienter le temps de la recuperation de l'appel
            </div>
        </div>
        <script data-main="js/main.hosted.js" src="node_modules/requirejs/require.js"></script>
    </body>
</html>

<?php } ?>