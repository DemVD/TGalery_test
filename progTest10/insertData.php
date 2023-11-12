<?php
require "DBConn.php";

// Create connection
$conn = mysqli_connect($host, $user, $pass, $db);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

if (isset($_POST['lastName'], $_POST['firstName'], $_POST['fathersName'])) {
    $lastName = mysqli_real_escape_string($conn, $_POST['lastName']);
    $firstName = mysqli_real_escape_string($conn, $_POST['firstName']);
    $fathersName = mysqli_real_escape_string($conn, $_POST['fathersName']);

    // Prepare the SQL statement
    $sql = "INSERT INTO customermaindata (FirstName, FathersName, LastName) VALUES ('$firstName', '$fathersName', '$lastName')";

    if (mysqli_query($conn, $sql)) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
} else {
    // If not set, send an error message
    echo "All fields must be filled";
}

mysqli_close($conn);
?>
