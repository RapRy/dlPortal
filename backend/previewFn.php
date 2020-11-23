<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
    date_default_timezone_set("Asia/Brunei");

    function insertReview($conn, $contReview, $contentId, $userId, $reviewRef, $reviewType, $logDesc){
        $dateTime = date("Y-m-d H-i-s a");

        $stmt = mysqli_stmt_init($conn);
        $queryReview = "INSERT INTO reviews (userId, contentId, reviewRef, reviewType, reviewDescription, reviewDate) VALUES (?, ?, ?, ?, ?, ?)";
        mysqli_stmt_prepare($stmt, $queryReview);
        mysqli_stmt_bind_param($stmt, "iiisss", $userId, $contentId, $reviewRef, $reviewType, $contReview, $dateTime);

        if(mysqli_stmt_execute($stmt)){
            $reviewId = mysqli_stmt_insert_id($stmt);
            $insertToLog = insertUserLog($stmt, $userId, $dateTime, $reviewType, $logDesc);

            if($insertToLog){
                $fetchUserData = "SELECT profilePicture, firstName, lastName, mobileNumber FROM users WHERE userId = ?";
                mysqli_stmt_prepare($stmt, $fetchUserData);
                mysqli_stmt_bind_param($stmt, "i", $userId);
                mysqli_stmt_execute($stmt);
                mysqli_stmt_store_result($stmt);
                mysqli_stmt_bind_result($stmt, $profilePicture, $firstName, $lastName, $mobileNumber);
                mysqli_stmt_fetch($stmt);


                $fetchDate = "SELECT reviewDate FROM reviews WHERE reviewId = ?";
                mysqli_stmt_prepare($stmt, $fetchDate);
                mysqli_stmt_bind_param($stmt, "i", $reviewId);
                mysqli_stmt_execute($stmt);

                mysqli_stmt_bind_result($stmt, $reviewDate);
                mysqli_stmt_fetch($stmt);

                $date = date_parse($reviewDate);
                $dateMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


                echo json_encode([
                    'profilePicture' => $profilePicture,
                    'firstName' => $firstName,
                    'lastName' => $lastName,
                    'mobileNumber' => $mobileNumber,
                    'reviewId' => $reviewId,
                    'reviewDesc' => $contReview,
                    'date' => [
                        'month' => $dateMonth[$date['month'] - 1],
                        'day' => $date['day'],
                        'year' => $date['year'],
                        'hour' => date("g", strtotime($reviewDate)),
                        'mins' => ($date['minute'] < 10) ? "0".$date['minute'] : $date['minute'],
                        "ampm" => date("a", strtotime($reviewDate))
                    ]
                ]);
            }
        }

        mysqli_stmt_close($stmt);
    }

    function insertUserLog($stmt, $userId, $dateTime, $userActivity, $userActivityDesc){
        $insertActivity = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
        $activityType = "review";

        mysqli_stmt_prepare($stmt, $insertActivity);
        mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $userActivity, $userActivityDesc, $dateTime);

        if(mysqli_stmt_execute($stmt)){
            return true;
        }
    }

    if(isset($_POST['contentReview'])){
        $contReview = filter_var($_POST['contentReview'], FILTER_SANITIZE_SPECIAL_CHARS);
        $contentId = filter_var($_POST['contentId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $userId = filter_var($_SESSION['userId'], FILTER_SANITIZE_SPECIAL_CHARS);

        insertReview($conn, $contReview, $contentId, $userId, 0, "mainReview", "submitReview");
    }else if(isset($_POST['reviewId'])){
        $userId = filter_var($_SESSION['userId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $contentId = filter_var($_POST['contentId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $reviewId = filter_var($_POST['reviewId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $reviewComment = filter_var($_POST['reviewComment'], FILTER_SANITIZE_SPECIAL_CHARS);

        insertReview($conn, $reviewComment, $contentId, $userId, $reviewId, "subReview", "commentReview");
    }
?>