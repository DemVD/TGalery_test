<?php

require "DBConn.php";

// Create connection
$conn = mysqli_connect($host, $user, $pass, $db);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['oldLastName'], $_POST['oldFirstName'], $_POST['oldFathersName'], 
           $_POST['newLastName'], $_POST['newFirstName'], $_POST['newFathersName'])) {
    $oldLastName = mysqli_real_escape_string($conn, $_POST['oldLastName']);
    $oldFirstName = mysqli_real_escape_string($conn, $_POST['oldFirstName']);
    $oldFathersName = mysqli_real_escape_string($conn, $_POST['oldFathersName']);

    $newLastName = mysqli_real_escape_string($conn, $_POST['newLastName']);
    $newFirstName = mysqli_real_escape_string($conn, $_POST['newFirstName']);
    $newFathersName = mysqli_real_escape_string($conn, $_POST['newFathersName']);

    // Prepare the SQL statement
    $sql = "UPDATE customermaindata SET FirstName = '$newFirstName', FathersName = '$newFathersName', LastName = '$newLastName' WHERE FirstName = '$oldFirstName' AND FathersName = '$oldFathersName' AND LastName = '$oldLastName'";

    if (mysqli_query($conn, $sql)) {
        echo "Record updated successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
} else {
    // If not set, send an error message
    echo "All fields must be filled";
}

mysqli_close($conn);

?>
