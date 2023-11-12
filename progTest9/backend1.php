<?php
    // backend file
    // do work
    sleep(5);
    echo "backend1.php has finished execution";
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        echo 'POST request received!';
    } else {
        echo 'Not a POST request.';
    }
?>