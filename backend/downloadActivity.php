<?php require('connection/dbConnection.php'); ?>
<?php
    if(isset($_POST['contentName'])){
        session_start();
        date_default_timezone_set("Asia/Brunei");
        $dateTime = date("Y-m-d H-i-s-a");

        $userId = $_SESSION['userId'];
        $contentName = filter_var($_POST['contentName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $mainCatName = filter_var($_POST['mainCatName'], FILTER_SANITIZE_SPECIAL_CHARS);
        $activityType = "contentDownload";

        $userActivityDesc = "downloadAContent";

        $stmt = mysqli_stmt_init($conn);
        $insertLog = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
        mysqli_stmt_prepare($stmt, $insertLog);
        mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $contentName, $userActivityDesc, $dateTime);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_close($stmt);
        mysqli_close($conn);
    }
?>