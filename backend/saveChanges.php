<?php require('connection/dbConnection.php'); ?>
<?php
    session_start();
    $data = [];

    function insertData($conn, $inputValue, $data, $key){
        $userId = filter_var($_POST['userId'], FILTER_SANITIZE_SPECIAL_CHARS);
        $inputValue = filter_var($inputValue, FILTER_SANITIZE_SPECIAL_CHARS);

        date_default_timezone_set("Asia/Brunei");
        $dateTime = date("Y-m-d H-i-s-a");
        
        $stmt = mysqli_stmt_init($conn);
		// $key is the name of the column in the table
        $insertInput = "UPDATE users SET $key=?, latestActivityDate=? WHERE userId=?";    
        mysqli_stmt_prepare($stmt, $insertInput);
        mysqli_stmt_bind_param($stmt, "ssi", $inputValue, $dateTime, $userId);
        mysqli_stmt_execute($stmt);
		
        $insertActivity = "INSERT INTO userslog (userId, activityType, userActivity, userActivityDesc, activityDate) VALUES (?, ?, ?, ?, ?)";
        $activityType = "updateProfile";
        $userActivity = $key;

        mysqli_stmt_prepare($stmt, $insertActivity);
        mysqli_stmt_bind_param($stmt, "issss", $userId, $activityType, $userActivity, $inputValue, $dateTime);
        mysqli_stmt_execute($stmt);

        mysqli_stmt_close($stmt);
		// reassign value of global seesion variable
        $_SESSION[$key] = $inputValue;
        $_SESSION['activityDate'] = $dateTime;

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
    }

    if(isset($_POST['userId'])){
		// update both if both have changes
        if(isset($_POST['firstName'])){
			// update firstname if there is a change
            insertData($conn, $_POST['firstName'], $data, "firstName"); 
        }
        
        if(isset($_POST['lastName'])){
			// update lastname if there is a change
            insertData($conn, $_POST['lastName'], $data, "lastName");
        }

        mysqli_close($conn);
    }
?>