<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();

    date_default_timezone_set("Asia/Brunei");
    $dateTime = date("Y-m-d H-i-s-a");

    $userId = $_SESSION['userId'];

    $stmt = mysqli_stmt_init($conn);
    $updateSignOut = "UPDATE users SET lastSignOut=? WHERE userId=?";
    mysqli_stmt_prepare($stmt, $updateSignOut);
    mysqli_stmt_bind_param($stmt, "si", $dateTime, $userId);

    if(mysqli_stmt_execute($stmt)){
        // unset all session variables
        session_unset();
        // session_destroy();
        // echo "signout";
        if(session_destroy()){
            echo "signout";
        }else{
            exit();
        }
    }
?>