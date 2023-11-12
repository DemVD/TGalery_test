<?php
    // backend file
    // do work
    sleep(15);
    echo "backend2.php has finished execution";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        echo 'POST request received!';
    } else {
        echo 'Not a POST request.';
    }
?>