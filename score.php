<?php

    if(isset($_POST["json"])){
        $fp = fopen('hiscore.json', 'w');
        fwrite($fp, $_POST["json"]);   
        print $_POST["json"]; 
    }else{
        $fp = fopen('hiscore.json', 'r');
        $json = fread($fp, filesize ('hiscore.json'));
        print $json;
    }
    fclose($fp);

?>