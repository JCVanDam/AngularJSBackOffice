<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width">
        <title>Snapcall jQuery plugin</title>
        <style type="text/css">
        body
        {
            margin: 0 auto;
            padding: 0;
            font-family: Arial, sans-serif;
        }

        table
        {
            width: 70%;
            border-collapse: collapse;
            margin: 0px auto;
        }

        table td
        {
            padding: 20px 50px;
            width: 25%;
            border: 1px solid #F8F5F4;
            border-radius: 5px;
            vertical-align: top;
        }

        #apple-topnav-1
        {
            width: 100%;
            padding: 15px 0px;
            text-align: center;
            background: #F8F5F4;
            font-size: 15px;
        }

        #apple-topnav-1 span
        {
            padding: 0px 35px;
            font-weight: bold;
        }

        #apple-topnav-2
        {
            width: 100%;
            background: #333333;
            text-align: center;
        }

        #apple-topnav-2 span
        {
            padding: 15px 25px;
            color: white;
            font-size: 28px;
        }

        .apple-title, .apple-text
        {
            text-align: center;
            margin: 30px auto 15px auto;
        }

        .apple-title
        {
            font-size: 25px;
            color: #333333;
        }

        .apple-text
        {
            font-size: 17px;
        }

        .apple-type
        {
            font-size: 13px;
            color: gray;
            margin-top: 10px;
            font-style: italic;
            text-align: center;
        }

        .apple-image
        {
            margin: auto;
            width: 250px;
        }

        .apple-image img
        {
            width: 100%;
        }

        .anim
        {
            text-align: center;
        }

        .anim:hover
        {
            cursor: pointer;
        }
        </style>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    </head>
    <body>
        <div id="apple-topnav-1">
            <span class="fa fa-apple"></span>
            <span>Macbook</span>
            <span>iMac</span>            
            <span>iPhone</span>            
            <span>Watch</span>            
            <span>Assistance</span>            
            <span>iShop</span>            
        </div>
        <div id="apple-topnav-2">
            <span class="fa fa-tablet"></span>
            <span class="fa fa-laptop"></span>
            <span class="fa fa-tv"></span>
            <span class="fa fa-desktop"></span>
        </div>
        <table>
            <tr>
                <td>
                    <div class="apple-image"><img src="http://store.storeimages.cdn-apple.com/4974/as-images.apple.com/is/image/AppleInc/aos/published/images/4/2/42/alu/42-alu-silver-nylon-pearl-grid?wid=332&hei=392&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=1472247766909" /></div>
                    <div class="apple-title">Silver Aluminum Case with Pearl Woven Nylon</div>
                    <div class="apple-text">From $158</div>
                    <div class="snapcall" btn-type="button" btn-bid="vPF6O2m6nDlYtKhw"></div>
                    <div class="apple-type">button</div>
                </td>
                <td>
                    <div class="apple-image"><img src="http://store.storeimages.cdn-apple.com/4974/as-images.apple.com/is/image/AppleInc/aos/published/images/4/2/42/stainless/42-stainless-classic-brown-grid?wid=332&hei=392&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=1472247767247" /></div>
                    <div class="apple-title">Stainless Steel Case with Saddle Brown Classic Buckle</div>
                    <div class="apple-text">From $158</div>
                    <div class="snapcall" btn-type="callbar" btn-bid="vPF6O2m6nDlYtKhw"></div>
                    <div class="apple-type">callbar <span class="fa fa-desktop fa-4x"></span></div>
                </td>
                <td>
                    <div class="apple-image"><img src="http://store.storeimages.cdn-apple.com/4974/as-images.apple.com/is/image/AppleInc/aos/published/images/4/2/42/stainless/42-stainless-black-milanese-black-grid?wid=332&hei=392&fmt=jpeg&qlt=95&op_sharpen=0&resMode=bicub&op_usm=0.5,0.5,0,0&iccEmbed=0&layer=comp&.v=1472247763547" /></div>
                    <div class="apple-title">Space Black Stainless Steel Case with Space Black Milanese Loop</div>
                    <div class="apple-text">From $158</div>
                    <div class="snapcall" btn-type="buttontxt" btn-bid="vPF6O2m6nDlYtKhw" btn-name="button-custom"></div>
                    <div class="apple-type">buttontxt</div>
                </td>
            </tr>
        </table>
        <div class="snapcall" btn-type="popin" btn-bid="vPF6O2m6nDlYtKhw" btn-name="popin-sncf"></div>

        <script data-main="js/main.js" src="node_modules/requirejs/require.js"></script>
    </body>
</html>