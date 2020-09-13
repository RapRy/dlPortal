<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
    function updateData($conn){
        $userId = filter_var($_POST['userId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $inputVal = filter_var($_POST['inputVal'], FILTER_SANITIZE_SPECIAL_CHARS);

        $stmt = mysqli_stmt_init($conn);

        date_default_timezone_set("Asia/Brunei");
        $dateTime = date("Y-m-d H-i-s-a");

        $updateQuery = "UPDATE users SET receiveUpdate=?, latestActivityDate=? WHERE userId=?";
        mysqli_stmt_prepare($stmt, $updateQuery);
        mysqli_stmt_bind_param($stmt, "ssi", $inputVal, $dateTime, $userId);
        mysqli_stmt_execute($stmt);

        $insertActivity = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
        $activityType = "receiveUpdate";
        $userActivity = $inputVal;
        $userActivityDesc = "updatedReceiveUpdate";

        mysqli_stmt_prepare($stmt, $insertActivity);
        mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $userActivity, $userActivityDesc, $dateTime);

        mysqli_stmt_execute($stmt);

        $_SESSION['receiveUpdate'] = $inputVal;

        $data = [];
        $date = date_parse($dateTime);
        $newDate = "";

        switch($date['month']){
            case 1:
                $newDate = "January ".$date['day'].", ".$date['year'];
                break;
            case 2:
                $newDate = "February ".$date['day'].", ".$date['year'];
                break;
            case 3:
                $newDate = "March ".$date['day'].", ".$date['year'];
                break;
            case 4:
                $newDate = "April ".$date['day'].", ".$date['year'];
                break;
            case 5:
                $newDate = "May ".$date['day'].", ".$date['year'];
                break;
            case 6:
                $newDate = "June ".$date['day'].", ".$date['year'];
                break;
            case 7:
                $newDate = "July ".$date['day'].", ".$date['year'];
                break;
            case 8:
                $newDate = "August ".$date['day'].", ".$date['year'];
                break;
            case 9:
                $newDate = "September ".$date['day'].", ".$date['year'];
                break;
            case 10:
                $newDate = "October ".$date['day'].", ".$date['year'];
                break;
            case 11:
                $newDate = "November ".$date['day'].", ".$date['year'];
                break;
            case 12:
                $newDate = "December ".$date['day'].", ".$date['year'];
                break;
            default:
                $newDate = $date['month']."/".$date['day']."/".$date['year'];
            break;
        }
        
        array_push($data, ['activityDate' => $newDate]);

        foreach($data as $date){
            //    loop though the the array and output it, ":"is used to seperate our data once we fetch it in javascript 
            echo $date['activityDate'].":";
        }

        mysqli_stmt_close($stmt);
		mysqli_close($conn);
    }


    updateData($conn);
?>