<?php
require "DBConn.php";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['lastName'], $_POST['firstName'], $_POST['fathersName'])) {
    $lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
    $firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
    $fathersName = mysqli_real_escape_string($conn, $_POST['fathersName']);

    $sql = "DELETE FROM customermaindata WHERE FirstName = ? AND FathersName = ? AND LastName = ? LIMIT 1";

    // Prepare the SQL statement and bind parameters
    if($stmt = mysqli_prepare($conn, $sql)){
        mysqli_stmt_bind_param($stmt, "sss", $firstName, $fathersName, $lastName);

        if(mysqli_stmt_execute($stmt)){
            echo "Record successfully deleted";
        } else {
            echo "Error: " . mysqli_error($conn);
        }
    } 

    mysqli_stmt_close($stmt);

} else {
    echo "All fields must be filled";
}

mysqli_close($conn);
?>